import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment extends Document {
  @Prop({ required: true })
  commentId: string;

  @Prop({ required: true })
  userUrn: string;

  @Prop()
  whois: string;

  @Prop()
  note: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
