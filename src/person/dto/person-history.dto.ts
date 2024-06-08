import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PersonHistoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  count: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
