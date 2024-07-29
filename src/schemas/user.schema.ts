import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  userPw: string;

  @Prop({ required: true })
  userUrn: string;

  @Prop()
  userName: string;

  @Prop()
  userDesc: string;

  @Prop()
  userJob: string;

  @Prop()
  userPhoto: string;

  @Prop({ default: false })
  userValid: boolean;

  @Prop({ default: null })
  verifyCode: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
