import { EnumLike } from '@jovotech/framework';
import { IsEnum } from '@jovotech/output';
import { Image } from '../common/Image';
import { DisplayTemplateList1Item } from './list-items/DisplayTemplateList1Item';
import { DisplayTemplateList2Item } from './list-items/DisplayTemplateList2Item';
import { TextContent } from './TextContent';

export enum DisplayTemplateType {
  Body1 = 'BodyTemplate1',
  Body2 = 'BodyTemplate2',
  Body3 = 'BodyTemplate3',
  Body6 = 'BodyTemplate6',
  Body7 = 'BodyTemplate7',
  List1 = 'ListTemplate1',
  List2 = 'ListTemplate2',
}

export type DisplayTemplateTypeLike = EnumLike<DisplayTemplateType>;

export enum BackButtonVisibility {
  Hidden = 'HIDDEN',
  Visible = 'VISIBLE',
}
export type BackButtonVisibilityLike = EnumLike<BackButtonVisibility>;

export class DisplayTemplate<TYPE extends DisplayTemplateTypeLike = DisplayTemplateTypeLike> {
  @IsEnum(DisplayTemplateType)
  type!: TYPE;
  token!: string;
  backButton?: BackButtonVisibilityLike;
  backgroundImage?: Image;
  title?: string;
  textContent?: TYPE extends DisplayTemplateType.Body7 ? never : TextContent;
  image?: TYPE extends DisplayTemplateType.Body1 ? never : Image;
  listItems?: TYPE extends DisplayTemplateType.List1
    ? DisplayTemplateList1Item[]
    : TYPE extends DisplayTemplateType.List2
    ? DisplayTemplateList2Item[]
    : never;
}
