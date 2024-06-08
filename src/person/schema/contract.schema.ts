import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { History, HistorySchema } from './history.schema';

@Schema({ timestamps: true })
export class Contract extends Document {
  @Prop()
  paid: number;

  @Prop({ type: [HistorySchema] })
  history: History[];
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
