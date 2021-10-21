import { IsValidCardImageUrl } from '../../decorators/validation/IsValidCardImageUrl';

export class CardImage {
  @IsValidCardImageUrl()
  smallImageUrl?: string;

  @IsValidCardImageUrl()
  largeImageUrl?: string;
}
