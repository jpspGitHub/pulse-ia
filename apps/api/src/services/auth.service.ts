import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Errors } from '../common/errors/errors';
import { AuthIdentitiesRepository } from '../modules/auth/dataaccess/auth-identities.repository';
import { Role } from '../domain/enums/role.enum';
import { UserStatus } from '../domain/enums/user-status.enum';

type LoginInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authIdentitiesRepository: AuthIdentitiesRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInput) {
    const record = await this.authIdentitiesRepository.findLocalByEmail(email);
    if (!record || !record.password_hash) {
      throw Errors.unauthorized('Invalid credentials');
    }

    if (record.status !== UserStatus.Active) {
      throw Errors.forbidden('User is not active');
    }

    const matches = await bcrypt.compare(password, record.password_hash);
    if (!matches) {
      throw Errors.unauthorized('Invalid credentials');
    }

    const role = record.role ?? Role.Employee;
    const payload = {
      sub: record.user_id,
      email: record.email,
      tenantId: record.tenant_id,
      name: record.full_name,
      role,
      locale: record.preferred_locale,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: record.user_id,
        email: record.email,
        name: record.full_name,
        tenantId: record.tenant_id,
        role,
        locale: record.preferred_locale,
      },
    };
  }
}
