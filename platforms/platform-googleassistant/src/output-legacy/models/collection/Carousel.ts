import {
  ArrayMaxSize,
  ArrayMinSize,
  Card,
  Carousel as BaseCarousel,
  IsArray,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { CAROUSEL_MAX_SIZE, CAROUSEL_MIN_SIZE } from '../../constants';
import { LegacyCollectionItem } from './LegacyCollectionItem';

export class Carousel {
  @IsArray()
  @ArrayMinSize(CAROUSEL_MIN_SIZE)
  @ArrayMaxSize(CAROUSEL_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => LegacyCollectionItem)
  items!: LegacyCollectionItem[];

  toCarousel?(): BaseCarousel {
    return {
      items: this.items.map((item) => {
        const card: Card = {
          title: item.title,
        };
        if (item.optionInfo?.key) {
          card.key = item.optionInfo.key;
        }
        if (item.description) {
          card.subtitle = item.description;
        }
        if (item.image?.url) {
          card.imageUrl = item.image.url;
        }
        return card;
      }),
    };
  }
}
