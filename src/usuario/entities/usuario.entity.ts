import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from '../../venta/entities/venta.entity';
import { LoginHistory } from '../../login-history/entities/login-history.entity';

export type Rol = 'admin' | 'cliente';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nom_persona: string;

  @Column({ unique: true, length: 20 }) // Por ejemplo 20 caracteres permitidos
  username: string;


  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'cliente' })
  rol: Rol;

  // AÑADE claramente ESTAS RELACIONES AQUÍ:

  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[];

  @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.usuario)
  login_history: LoginHistory[];
}
