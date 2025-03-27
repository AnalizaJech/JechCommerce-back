import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Usuario> {
    const { nom_persona, username, password } = registerDto;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = this.userRepository.create({
      nom_persona,
      username,
      password: hashedPassword,
      rol: 'cliente', // Rol fijo cliente claramente
    });
  
    return await this.userRepository.save(user);
  }
  
  

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }
  

  async login(user: any) {
    const payload = { username: user.username, sub: user.id_usuario, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
