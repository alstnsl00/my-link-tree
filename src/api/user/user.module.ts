import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserLinkService } from './user-link.service';
import { UserLikeService } from './user-like.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { UserLink, UserLinkSchema } from '../../schemas/user-link.schema';
import { UserLike, UserLikeSchema } from '../../schemas/user-like.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserLink.name, schema: UserLinkSchema },
    ]),
    MongooseModule.forFeature([
      { name: UserLike.name, schema: UserLikeSchema },
    ]),
  ],
  providers: [UserService, UserLinkService, UserLikeService],
  controllers: [UserController],
  exports: [UserService, UserLinkService, UserLikeService],
})
export class UserModule {}
