import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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

    private dataSource: DataSource,
  ) {}

  // ✅ Venta individual (usada si se compra solo 1 producto)
  async crearVenta(dto: CreateVentaDto, usuario: Usuario): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const producto = await queryRunner.manager.findOne(Producto, {
        where: { id_producto: dto.id_producto },
      });

      if (!producto) throw new NotFoundException(`Producto ID ${dto.id_producto} no encontrado`);
      if (dto.cantidad <= 0) throw new BadRequestException('La cantidad debe ser mayor a 0');
      if (producto.stock < dto.cantidad) {
        throw new BadRequestException(`Stock insuficiente para "${producto.nom_producto}"`);
      }

      // Descontar stock
      producto.stock -= dto.cantidad;
      await queryRunner.manager.save(producto);

      // Crear venta
      const venta = queryRunner.manager.create(Venta, {
        producto: { id_producto: producto.id_producto },
        usuario: { id_usuario: usuario.id_usuario },
        cantidad: dto.cantidad,
        precio_unitario: producto.precio_final,
        monto_final: producto.precio_final * dto.cantidad,
        fecha_venta: new Date(),
      });

      const ventaGuardada = await queryRunner.manager.save(venta);
      await queryRunner.commitTransaction();
      return ventaGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error en crearVenta:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ✅ Múltiples ventas (carrito)
  async crearVentas(
    items: CreateVentaDto[],
    usuario: Usuario,
  ): Promise<{ message: string; ventas: Venta[]; total: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ventas: Venta[] = [];

      for (const dto of items) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id_producto: dto.id_producto },
        });

        if (!producto) {
          throw new NotFoundException(`Producto con ID ${dto.id_producto} no encontrado`);
        }

        if (dto.cantidad <= 0) {
          throw new BadRequestException(`Cantidad inválida para ${producto.nom_producto}`);
        }

        if (producto.stock < dto.cantidad) {
          throw new BadRequestException(`Stock insuficiente para "${producto.nom_producto}"`);
        }

        // Descontar stock
        producto.stock -= dto.cantidad;
        await queryRunner.manager.save(producto);

        // Crear venta
        const venta = queryRunner.manager.create(Venta, {
          producto: { id_producto: producto.id_producto },
          usuario: { id_usuario: usuario.id_usuario },
          cantidad: dto.cantidad,
          precio_unitario: producto.precio_final,
          monto_final: producto.precio_final * dto.cantidad,
          fecha_venta: new Date(),
        });

        const ventaGuardada = await queryRunner.manager.save(venta);
        ventas.push(ventaGuardada);
      }

      await queryRunner.commitTransaction();

      const total = ventas.reduce((sum, v) => sum + Number(v.monto_final), 0);
      return {
        message: 'Compra realizada con éxito',
        ventas,
        total,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error en crearVentas:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ✅ Historial de compras del cliente
  async obtenerMisVentas(id_usuario: number): Promise<Venta[]> {
    return this.ventaRepo.find({
      where: { usuario: { id_usuario } },
      relations: ['producto'],
      order: { fecha_venta: 'ASC' },
    });
  }

  // ✅ Historial global de ventas (admin)
  async obtenerTodas(): Promise<Venta[]> {
    return this.ventaRepo.find({
      relations: ['usuario', 'producto'],
      order: { fecha_venta: 'ASC' },
    });
  }
}
