import { Module } from '@nestjs/common';
import { LoginHistoryService } from './login-history.service';
import { LoginHistoryController } from './login-history.controller';

@Module({
  controllers: [LoginHistoryController],
  providers: [LoginHistoryService],
})
export class LoginHistoryModule {}
