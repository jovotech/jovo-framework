import { IsBoolean, IsObject, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { IsValidDirectivesArray } from '../decorators/validation/IsValidDirectivesArray';
import { AplExecuteCommandsDirective } from './apl/AplExecuteCommandsDirective';
import { AplLoadIndexListDataDirective } from './apl/AplLoadIndexListDataDirective';
import { AplRenderDocumentDirective } from './apl/AplRenderDocumentDirective';
import { AplSendIndexListDataDirective } from './apl/AplSendIndexListDataDirective';
import { AplUpdateIndexListDirective } from './apl/AplUpdateIndexListDirective';
import { AplaRenderDocumentDirective } from './apla/AplaRenderDocumentDirective';
import { ApltExecuteCommandsDirective } from './aplt/ApltExecuteCommandsDirective';
import { ApltRenderDocumentDirective } from './aplt/ApltRenderDocumentDirective';
import { AudioPlayerClearQueueDirective } from './audio-player/AudioPlayerClearQueueDirective';
import { AudioPlayerPlayDirective } from './audio-player/AudioPlayerPlayDirective';
import { AudioPlayerStopDirective } from './audio-player/AudioPlayerStopDirective';
import { Card } from './card/Card';
import { OutputSpeech } from './common/OutputSpeech';
import { DialogConfirmIntentDirective } from './dialog/DialogConfirmIntentDirective';
import { DialogConfirmSlotDirective } from './dialog/DialogConfirmSlotDirective';
import { DialogDelegateDirective } from './dialog/DialogDelegateDirective';
import { DialogElicitSlotDirective } from './dialog/DialogElicitSlotDirective';
import { DialogUpdateDynamicEntitiesDirective } from './dialog/DialogUpdateDynamicEntitiesDirective';
import { Directive } from './Directive';
import { DisplayRenderTemplateDirective } from './display/DisplayRenderTemplateDirective';
import { HintDirective } from './display/HintDirective';
import { HtmlHandleMessageDirective } from './html/HtmlHandleMessageDirective';
import { HtmlStartDirective } from './html/HtmlStartDirective';
import { Reprompt } from './Reprompt';
import { VideoAppLaunchDirective } from './video-app/VideoAppLaunchDirective';

export class Response {
  [key: string]: unknown;

  @IsOptional()
  @ValidateNested()
  @Type(() => OutputSpeech)
  outputSpeech?: OutputSpeech;

  @IsOptional()
  @ValidateNested()
  @Type(() => Card)
  card?: Card;

  @IsOptional()
  @ValidateNested()
  @Type(() => Reprompt)
  reprompt?: Reprompt;

  @IsOptional()
  @IsBoolean()
  shouldEndSession?: boolean;

  @IsOptional()
  @IsObject()
  apiResponse?: Record<string, string | number | boolean>;

  @IsOptional()
  @IsValidDirectivesArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => Directive, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: AplRenderDocumentDirective, name: 'Alexa.Presentation.APL.RenderDocument' },
        { value: AplExecuteCommandsDirective, name: 'Alexa.Presentation.APL.ExecuteCommands' },
        { value: AplSendIndexListDataDirective, name: 'Alexa.Presentation.APL.SendIndexListData' },
        { value: AplUpdateIndexListDirective, name: 'Alexa.Presentation.APL.UpdateIndexListData' },
        { value: AplLoadIndexListDataDirective, name: 'Alexa.Presentation.APL.LoadIndexListData' },
        { value: ApltRenderDocumentDirective, name: 'Alexa.Presentation.APLT.RenderDocument' },
        { value: ApltExecuteCommandsDirective, name: 'Alexa.Presentation.APLT.ExecuteCommands' },
        { value: AplaRenderDocumentDirective, name: 'Alexa.Presentation.APLA.RenderDocument' },
        { value: AudioPlayerPlayDirective, name: 'AudioPlayer.Play' },
        { value: AudioPlayerStopDirective, name: 'AudioPlayer.Stop' },
        { value: AudioPlayerClearQueueDirective, name: 'AudioPlayer.ClearQueue' },
        { value: DialogDelegateDirective, name: 'Dialog.Delegate' },
        { value: DialogElicitSlotDirective, name: 'Dialog.ElicitSlot' },
        { value: DialogConfirmSlotDirective, name: 'Dialog.ConfirmSlot' },
        { value: DialogConfirmIntentDirective, name: 'Dialog.ConfirmIntent' },
        { value: DialogUpdateDynamicEntitiesDirective, name: 'Dialog.UpdateDynamicEntities' },
        { value: DisplayRenderTemplateDirective, name: 'Display.RenderTemplate' },
        { value: HintDirective, name: 'Hint' },
        { value: HtmlStartDirective, name: 'Alexa.Presentation.HTML.Start' },
        { value: HtmlHandleMessageDirective, name: 'Alexa.Presentation.HTML.HandleMessage' },
        { value: VideoAppLaunchDirective, name: 'VideoApp.Launch' },
      ],
    },
  })
  directives?: Directive[];
}
