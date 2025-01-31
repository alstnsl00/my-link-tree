import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(username);
    if (user && (await bcrypt.compare(password, user.userPw))) {
      const { ...result } = user.toObject();

      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      userEmail: user.userEmail,
      userUrn: user.userUrn,
      sub: user._id.toString(),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
