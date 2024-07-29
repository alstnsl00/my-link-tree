import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserLikeDocument = UserLike & Document;

@Schema()
export class UserLike extends Document {
  @Prop({ required: true })
  userUrn: string;

  @Prop()
  likeUrn: string;

  @Prop({ default: 0 })
  likeFlag: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserLikeSchema = SchemaFactory.createForClass(UserLike);
