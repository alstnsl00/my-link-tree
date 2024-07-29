import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { UserLink, UserLinkSchema } from '../../schemas/user-link.schema';
import { UserLike, UserLikeSchema } from '../../schemas/user-like.schema';
import { Comment, CommentSchema } from '../../schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserLink.name, schema: UserLinkSchema },
    ]),
    MongooseModule.forFeature([
      { name: UserLike.name, schema: UserLikeSchema },
    ]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
