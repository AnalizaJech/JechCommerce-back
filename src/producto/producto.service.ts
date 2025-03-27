import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createDto: CreateProductoDto): Promise<Producto> {
    console.log('DTO recibido:', createDto); // <- Añade esto para ver qué llega
  
    const product = this.productoRepository.create(createDto);
  
    if (createDto.is_oferta && createDto.porcentaje_oferta) {
      product.precio_final = Number(
        createDto.precio - (createDto.precio * createDto.porcentaje_oferta) / 100
      );
    } else {
      product.precio_final = Number(createDto.precio);
    }
  
    return this.productoRepository.save(product);
  }
  

  findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const product = await this.productoRepository.findOne({ where: { id_producto: id } });
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  async update(id: number, updateDto: UpdateProductoDto): Promise<Producto> {
    const product = await this.findOne(id);

    // Mezcla datos al objeto product
    this.productoRepository.merge(product, updateDto);

    // Recalcula precio_final si recibimos cambios
    if (updateDto.is_oferta !== undefined && updateDto.porcentaje_oferta !== undefined) {
      if (updateDto.is_oferta) {
        product.precio_final = Number(
          product.precio - (product.precio * updateDto.porcentaje_oferta) / 100
        );
      } else {
        product.precio_final = Number(product.precio);
      }
    }

    return this.productoRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // para lanzar error si no existe
    await this.productoRepository.delete(id);
  }
}
