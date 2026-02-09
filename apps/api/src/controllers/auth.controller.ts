import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { z } from 'zod';
import { Errors } from '../common/errors/errors';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../modules/jwt-auth.guard';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() body: unknown) {
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      throw Errors.validation(parsed.error.flatten());
    }

    return this.authService.login(parsed.data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  me(@Req() request: Request) {
    return (request as Request & { user?: unknown }).user ?? null;
  }
}
