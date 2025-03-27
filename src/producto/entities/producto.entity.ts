import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from 'src/venta/entities/venta.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column({ length: 30 })
  nom_producto: string;

  @Column({ length: 100 })
  descripcion: string;

  @Column('numeric')
  precio: number;

  @Column({ default: false })
  is_oferta: boolean;

  @Column('numeric', { default: 0 })
  porcentaje_oferta: number;

  @Column('numeric')
  precio_final: number;

  @OneToMany(() => Venta, venta => venta.producto)
  ventas: Venta[];
}
