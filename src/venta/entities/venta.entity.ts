import { Producto } from 'src/producto/entities/producto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  @ManyToOne(() => Producto, producto => producto.ventas)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @ManyToOne(() => Usuario, usuario => usuario.ventas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column('numeric')
  monto_final: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_venta: Date;
}
