import { IsNotEmpty, IsString } from '@jovotech/output';

export class Cell {
  @IsString()
  @IsNotEmpty()
  text!: string;
}
