import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { AuthUser } from '../../../common/types/auth-user';
import { ChatService } from '../services/chat.service';
import { CreateSessionDto } from '../dtos/create-session.dto';
import { AddMessageDto } from '../dtos/add-message.dto';

@Controller('v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sessions')
  async createSession(@Req() request: Request, @Body() body: CreateSessionDto) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.chatService.createSession(user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sessions/:id/messages')
  async addMessage(@Req() request: Request, @Param('id') id: string, @Body() body: AddMessageDto) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.chatService.addMessage(user, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions/:id')
  async getSession(@Req() request: Request, @Param('id') id: string) {
    const user = (request as Request & { user: AuthUser }).user;
    return this.chatService.getSession(user, id);
  }
}
