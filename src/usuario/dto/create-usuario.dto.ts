import { IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nom_persona: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  rol: string; // <-- ¡Agrega esta línea!
}
