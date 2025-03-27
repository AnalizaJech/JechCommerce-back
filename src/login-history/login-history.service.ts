import { Injectable } from '@nestjs/common';
import { CreateLoginHistoryDto } from './dto/create-login-history.dto';
import { UpdateLoginHistoryDto } from './dto/update-login-history.dto';

@Injectable()
export class LoginHistoryService {
  create(createLoginHistoryDto: CreateLoginHistoryDto) {
    return 'This action adds a new loginHistory';
  }

  findAll() {
    return `This action returns all loginHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loginHistory`;
  }

  update(id: number, updateLoginHistoryDto: UpdateLoginHistoryDto) {
    return `This action updates a #${id} loginHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} loginHistory`;
  }
}
