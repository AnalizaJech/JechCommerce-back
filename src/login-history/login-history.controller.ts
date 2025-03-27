import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginHistoryService } from './login-history.service';
import { CreateLoginHistoryDto } from './dto/create-login-history.dto';
import { UpdateLoginHistoryDto } from './dto/update-login-history.dto';

@Controller('login-history')
export class LoginHistoryController {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Post()
  create(@Body() createLoginHistoryDto: CreateLoginHistoryDto) {
    return this.loginHistoryService.create(createLoginHistoryDto);
  }

  @Get()
  findAll() {
    return this.loginHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoginHistoryDto: UpdateLoginHistoryDto) {
    return this.loginHistoryService.update(+id, updateLoginHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginHistoryService.remove(+id);
  }
}
