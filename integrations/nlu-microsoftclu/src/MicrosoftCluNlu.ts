import {
  EntityMap,
  InterpretationPluginConfig,
  Jovo,
  JovoError,
  NluData,
  NluPlugin,
} from '@jovotech/framework';

import {
  AnalyzeConversationResult,
  ConversationAnalysisClient,
  ConversationAnalysisClientOptionalParams,
  ConversationPrediction,
  ConversationTaskParameters,
  ConversationalTask,
} from '@azure/ai-language-conversations';

import { AzureKeyCredential, KeyCredential, TokenCredential } from '@azure/core-auth';
import { v4 as uuidV4 } from 'uuid';
import { INTENT_NONE, PROJECTKIND_CONVERSATION, PARTICIPANT_USER } from './constants';

export interface MicrosoftCluLibraryConfig {
  taskParameters: ConversationTaskParameters;
  options?: ConversationAnalysisClientOptionalParams;
}

export interface MicrosoftCluNluConfig extends InterpretationPluginConfig {
  endpoint: string;
  credential: TokenCredential | KeyCredential | string;
  fallbackLanguage: string;
  libraryConfig: MicrosoftCluLibraryConfig;
}

export class MicrosoftCluNlu extends NluPlugin<MicrosoftCluNluConfig> {
  getDefaultConfig(): MicrosoftCluNluConfig {
    return {
      ...super.getDefaultConfig(),
      fallbackLanguage: 'en',
      endpoint: '',
      libraryConfig: {
        taskParameters: {
          projectName: '',
          deploymentName: '',
        },
      },
    };
  }

  async processText(jovo: Jovo, text: string): Promise<NluData | undefined> {
    if (!this.config.endpoint) {
      throw new JovoError({
        message: `Can not send request to Microsoft-CLU. The endpoint is missing.`,
      });
    }

    if (!this.config.libraryConfig.taskParameters.projectName) {
      throw new JovoError({
        message: `Can not send request to Microsoft-CLU. The projectName is missing.`,
      });
    }

    if (!this.config.libraryConfig.taskParameters.deploymentName) {
      throw new JovoError({
        message: `Can not send request to Microsoft-CLU. The deploymentName is missing.`,
      });
    }

    const result = await this.sendTextToServer(jovo, text);

    if (result.prediction.projectKind === PROJECTKIND_CONVERSATION) {
      const topIntent = result.prediction.topIntent || INTENT_NONE;

      const nluData: NluData = {};

      nluData.intent = { name: topIntent };
      nluData.entities = this.getEntityMapFromResponse(result);
      nluData.native = result;

      return nluData;
    }
  }

  private async sendTextToServer(jovo: Jovo, text: string): Promise<AnalyzeConversationResult> {
    const service: ConversationAnalysisClient = new ConversationAnalysisClient(
      this.config.endpoint,
      typeof this.config.credential === 'string'
        ? new AzureKeyCredential(this.config.credential)
        : this.config.credential,
      this.config.libraryConfig.options,
    );

    const body: ConversationalTask = {
      kind: PROJECTKIND_CONVERSATION,
      analysisInput: {
        conversationItem: {
          participantId: PARTICIPANT_USER,
          id: jovo.$request.getRequestId ? jovo.$request.getRequestId() || uuidV4() : uuidV4(),
          language: this.getLocale(jovo),
          text,
        },
      },
      parameters: this.config.libraryConfig.taskParameters,
    };

    const { result } = await service.analyzeConversation(body);

    return result;
  }

  private getEntityMapFromResponse(response: AnalyzeConversationResult): EntityMap {
    const prediction = response.prediction as ConversationPrediction;

    return prediction.entities.reduce((entityMap: EntityMap, entity) => {
      const entityName = entity.category;
      const textValue = entity.text;
      let resolvedValue = textValue;

      const extraInfo = entity.extraInformation?.[0];
      if (extraInfo && extraInfo.extraInformationKind === 'ListKey') {
        resolvedValue = extraInfo.key ?? textValue;
      }

      entityMap[entityName] = {
        id: resolvedValue,
        resolved: resolvedValue,
        value: textValue,
        native: entity,
      };

      return entityMap;
    }, {});
  }

  private getLocale(jovo: Jovo): string {
    const locale = jovo.$request.getLocale() || this.config.fallbackLanguage;

    // Only use generic locales like 'en' instead of e.g. 'en-US'
    const genericLocale = locale.split('-')[0];

    return genericLocale;
  }
}
