import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthIdentitiesRepository } from './auth/dataaccess/auth-identities.repository';
import { JwtStrategy } from './jwt.strategy';
import { env } from '../env';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthIdentitiesRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
