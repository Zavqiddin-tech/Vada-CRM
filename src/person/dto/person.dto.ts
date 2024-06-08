import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PersonContractDto } from './person-contract.dto';

export class PersonDto {
  companyId: string;

  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsString()
  @IsNotEmpty()
  lname: string;

  phone1: number;

  phone2: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  @IsNotEmpty()
  verify: boolean;

  @IsNumber()
  @IsNotEmpty()
  status: 0;

  @ValidateNested({ each: true })
  @Type(() => PersonContractDto)
  contract: PersonContractDto[];
}
