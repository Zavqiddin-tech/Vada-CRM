import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { PersonHistoryDto } from './person-history.dto';

export class PersonContractDto {
  @IsNumber()
  @IsNotEmpty()
  paid: number;

  @ValidateNested({ each: true })
  @Type(() => PersonHistoryDto)
  history: PersonHistoryDto[];
}
