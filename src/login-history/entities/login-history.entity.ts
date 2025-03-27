import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoginHistory {
  @PrimaryGeneratedColumn()
  id_login: number;

  @ManyToOne(() => Usuario, usuario => usuario.login_history, { eager: true })
  usuario: Usuario;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_login: Date;
}
