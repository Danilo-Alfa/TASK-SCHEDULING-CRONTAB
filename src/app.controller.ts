import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './dto/createUser.request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createUser(@Body() body: CreateUserRequest): Promise<void> {
    return this.appService.CreateUser(body);
  }
}
