import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Contract, ContractSchema } from './schema/contract.schema';

export type PersonDocument = HydratedDocument<Person>;

@Schema({ timestamps: true })
export class Person {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  fname: string;

  @Prop({ required: true })
  lname: string;

  @Prop()
  phone1: number;

  @Prop()
  phone2: number;

  @Prop()
  verify: boolean;

  @Prop()
  status: number;

  @Prop()
  date: string;

  @Prop({ type: [ContractSchema] })
  contract: Contract[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);
