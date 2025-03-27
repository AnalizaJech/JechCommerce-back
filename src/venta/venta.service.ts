import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Producto } from 'src/producto/entities/producto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepo: Repository<Venta>,

    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,
  ) {}

  async crearVenta(dto: CreateVentaDto, usuario: Usuario): Promise<Venta> {
    const producto = await this.productoRepo.findOne({
      where: { id_producto: dto.id_producto },
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');

    const venta = this.ventaRepo.create({
      producto,
      usuario,
      monto_final: producto.precio_final,
    });

    return this.ventaRepo.save(venta);
  }

  async obtenerMisVentas(id_usuario: number): Promise<Venta[]> {
    return this.ventaRepo.find({
      where: { usuario: { id_usuario } },
      relations: ['producto'],
      order: { fecha_venta: 'DESC' },
    });
  }

  async obtenerTodas(): Promise<Venta[]> {
    return this.ventaRepo.find({
      relations: ['usuario', 'producto'],
      order: { fecha_venta: 'DESC' },
    });
  }
}
