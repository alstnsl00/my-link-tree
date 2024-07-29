import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserLinkDocument = UserLink & Document;

@Schema()
export class UserLink extends Document {
  @Prop({ required: true })
  clickId: string;

  @Prop({ required: true })
  userUrn: string;

  @Prop()
  link: string;

  @Prop({ default: 0 })
  linkNum: number;

  @Prop()
  linkType: string;

  @Prop()
  linkName: string;

  @Prop({ default: 0 })
  linkCnt: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserLinkSchema = SchemaFactory.createForClass(UserLink);
