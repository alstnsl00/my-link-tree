import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { EmailModule } from './email/email.module';
import { EmailController } from './email/email.controller';
import { PostModule } from './post/post.module';
import { PostController } from './post/post.controller';

@Module({
  imports: [AuthModule, UserModule, EmailModule, PostModule],
  controllers: [
    AuthController,
    UserController,
    EmailController,
    PostController,
  ],
})
export class ApiModule {}
