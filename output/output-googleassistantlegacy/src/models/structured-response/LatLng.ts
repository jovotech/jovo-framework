import { IsLatitude, IsLongitude } from '@jovotech/output';

export class LatLng {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
