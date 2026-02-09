import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Errors } from '../common/errors/errors';
import { UsersRepository } from '../dataaccess/users.repository';

type LoginInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInput) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user || !user.password_hash) {
      throw Errors.unauthorized('Invalid credentials');
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      throw Errors.unauthorized('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenant_id,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenantId: user.tenant_id,
      },
    };
  }
}
