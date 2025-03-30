import { Producto } from 'src/producto/entities/producto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  @ManyToOne(() => Producto, producto => producto.ventas)
  @JoinColumn({ name: 'id_producto' }) // este debe coincidir con la columna en la tabla
  producto: Producto;



  @ManyToOne(() => Usuario, (usuario) => usuario.ventas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column()
  cantidad: number;

  @Column({ type: 'numeric' })
  precio_unitario: number;

  @Column('numeric')
  monto_final: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_venta: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date; // Si necesitas auditar las actualizaciones
}
