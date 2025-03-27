import { Controller, Post, Body, Request, UseGuards, Module, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
    imports: [UsuarioModule], // ajusta según tu lógica
    controllers: [AuthController],
    providers: [AuthService],
})

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
async login(@Body() loginDto: LoginDto) {
  try {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    return this.authService.login(user);
  } catch (err) {
    throw new UnauthorizedException('Usuario o contraseña incorrectos');
  }
}

}
