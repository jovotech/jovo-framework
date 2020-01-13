import {
  HorizontalAlignment,
  IAdaptiveCard,
  IBackgroundImage,
  IColumnSet,
  IContainer,
  IFactSet,
  IImage,
  IImageSet,
  IOpenUrlAction,
  IShowCardAction,
  ISubmitAction,
  ITextBlock,
  IVersion,
  Spacing,
} from 'adaptivecards/lib/schema'; // tslint:disable-line
import _merge = require('lodash.merge');

export type AdaptiveCardOptions = Omit<IAdaptiveCard, 'type' | 'version'>;

export class AdaptiveCard implements IAdaptiveCard {
  actions?: Array<ISubmitAction | IOpenUrlAction | IShowCardAction>;
  backgroundImage?: IBackgroundImage | string;
  body?: Array<ITextBlock | IImage | IImageSet | IFactSet | IColumnSet | IContainer>;
  height?: 'auto' | 'stretch';
  horizontalAlignment?: HorizontalAlignment;
  id?: string;
  separator?: boolean;
  spacing?: Spacing;
  speak?: string;
  type: 'AdaptiveCard' = 'AdaptiveCard';
  version?: IVersion | string = '1.0';

  constructor(options: AdaptiveCardOptions) {
    _merge(this, options);
  }
}
