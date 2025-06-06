import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!, // el ! asegura que nunca será undefined
    });
  }

  async validate(payload: any) {
    return {
      id_usuario: payload.sub,
      username: payload.username,
      rol: payload.rol,
    };
  }
  
}
