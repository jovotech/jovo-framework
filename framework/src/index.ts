import { JovoLogger } from '@jovotech/common';
import axios from 'axios';

// do not use source map support with jest.
if (process.env.JEST_WORKER_ID === undefined) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('source-map-support').install();
}

export const Logger = new JovoLogger();

export * from '@jovotech/common';

export * from 'axios';
export { axios };

export {
  Card,
  Carousel,
  CarouselItem,
  CarouselItemSelection,
  CarouselSelection,
  DenormalizePlatformOutputTemplate,
  DenormalizeOutputTemplate,
  DynamicEntity,
  DynamicEntitiesModeLike,
  DynamicEntities,
  DynamicEntityValue,
  DynamicEntitiesMode,
  Entity,
  JovoResponse,
  Listen,
  ListenValue,
  Message,
  MessageValue,
  NormalizedOutputTemplate,
  NormalizedPlatformOutputTemplate,
  NormalizedOutputTemplatePlatforms,
  OutputTemplateConverterStrategy,
  OutputTemplateConverter,
  OutputTemplate,
  OutputTemplateBase,
  OutputTemplatePlatforms,
  OutputValidationError,
  PlatformOutputTemplate,
  QuickReply,
  QuickReplyValue,
} from '@jovotech/output';

export * from './App';
export * from './AsyncJovo';
export * from './BaseComponent';
export * from './BaseDelegateComponent';
export * from './BaseOutput';
export * from './ComponentPlugin';
export * from './ComponentTree';
export * from './ComponentTreeNode';
export * from './DependencyInjector';
export * from './Extensible';
export * from './HandleRequest';
export * from './I18Next';
export * from './Jovo';
export * from './JovoInput';
export * from './JovoInputBuilder';
export * from './JovoProxy';
export * from './JovoRequest';
export * from './JovoSession';
export * from './JovoUser';
export * from './JovoDevice';

export * from './Middleware';
export * from './MiddlewareCollection';
export * from './Platform';
export * from './Plugin';
export * from './Server';
export * from './RequestBuilder';

export * from './audio/AudioUtilities';
export * from './audio/ParsedAudioInput';

export * from './decorators/Component';
export * from './decorators/Global';
export * from './decorators/Handle';
export * from './decorators/If';
export * from './decorators/Inject';
export * from './decorators/Injectable';
export * from './decorators/Intents';
export * from './decorators/Output';
export * from './decorators/Platforms';
export * from './decorators/PrioritizedOverUnhandled';
export * from './decorators/SubState';
export * from './decorators/Types';

export * from './errors/CircularDependencyError';
export * from './errors/ComponentNotAvailableError';
export * from './errors/ComponentNotFoundError';
export * from './errors/DuplicateChildComponentsError';
export * from './errors/DuplicateGlobalIntentsError';
export * from './errors/HandlerNotFoundError';
export * from './errors/InvalidComponentTreeBuiltError';
export * from './errors/InvalidDependencyError';
export * from './errors/InvalidParentError';
export * from './errors/MatchingRouteNotFoundError';
export * from './errors/MatchingPlatformNotFoundError';
export * from './errors/UnresolvableDependencyError';

export * from './metadata/ClassDecoratorMetadata';
export * from './metadata/ComponentMetadata';
export * from './metadata/ComponentOptionMetadata';
export * from './metadata/HandlerMetadata';
export * from './metadata/HandlerOptionMetadata';
export * from './metadata/InjectMetadata';
export * from './metadata/InjectableMetadata';
export * from './metadata/MetadataStorage';
export * from './metadata/MethodDecoratorMetadata';
export * from './metadata/OutputMetadata';

export * from './plugins';

export * from './interfaces';
export * from './enums';
export * from './utilities';

export * from './testsuite/TestJovo';
export * from './testsuite/TestUser';
export * from './testsuite/TestSuite';
export * from './testsuite/TestServer';
export * from './testsuite/TestRequest';
export * from './testsuite/TestRequestBuilder';
export * from './testsuite/TestResponse';
export * from './testsuite/TestOutputConverterStrategy';
export * from './testsuite/TestPlatform';
