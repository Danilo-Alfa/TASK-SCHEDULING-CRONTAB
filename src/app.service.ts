import { Injectable, Logger } from '@nestjs/common';
import { CreateUserRequest } from './dto/createUser.request';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    private readonly eventMitter: EventEmitter2,
    private scheduleRegistry: SchedulerRegistry,
  ) {}

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  async CreateUser(body: CreateUserRequest): Promise<void> {
    this.logger.log('Creating User...', body);
    const userId = '123';
    this.eventMitter.emit(
      'user.created',
      new UserCreatedEvent(userId, body.email),
    );
    const establishWsTimeout = setTimeout(
      () => this.establishWsTimeout(userId),
      5000,
    );
    this.scheduleRegistry.addTimeout(
      `${userId}_establish_ws`,
      establishWsTimeout,
    );
  }

  private establishWsTimeout(userId: string) {
    this.logger.log('establishing web Socket connectino with user...', userId);
  }

  @OnEvent('user.created')
  welceomeNewUser(payload: UserCreatedEvent) {
    this.logger.log('welcoming new User... ', payload.email);
  }

  @OnEvent('user.created')
  async sendWelcomeGift(payload: UserCreatedEvent) {
    this.logger.log('Sending welcome gift...', payload.email);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
    this.logger.log('Welcome gift sent', payload.email);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'deleteExpiredUsers' })
  deleteExpiredUsers() {
    this.logger.log('Deleting expired users...');
  }
}
