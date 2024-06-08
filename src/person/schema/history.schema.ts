import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
  @Prop()
  name: string;

  @Prop()
  count: string;

  @Prop()
  price: number;
}

export const HistorySchema = SchemaFactory.createForClass(History);
