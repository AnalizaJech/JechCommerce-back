import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Venta } from 'src/venta/entities/venta.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column({ type: 'varchar', length: 650 })
  nom_producto: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column('numeric')
  precio: number;

  @Column({ type: 'int', nullable: true })
  porcentaje_oferta: number | null;

  @Column({ type: 'boolean', default: false })
  is_oferta: boolean;

  @Column({ type: 'float' })
  precio_final: number;

  @Column('int', { nullable: true, default: 0 })
  stock: number;

  @OneToMany(() => Venta, (venta) => venta.producto)
  ventas: Venta[];

  // Método que actualiza el precio final en función de la oferta
  @BeforeInsert()
  @BeforeUpdate()
  updatePrecioFinal() {
    if (this.is_oferta && this.porcentaje_oferta != null) {
      this.precio_final = this.precio - (this.precio * this.porcentaje_oferta) / 100;
    } else {
      this.precio_final = this.precio;
    }
  }
}
