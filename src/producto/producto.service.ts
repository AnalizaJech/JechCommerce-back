import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  // Crear un producto
  async create(createDto: CreateProductoDto): Promise<Producto> {
    console.log('DTO recibido:', createDto);
  
    const isOferta = createDto.is_oferta ?? false;
  
    // Si no está en oferta, no le ponemos porcentaje
    const productoData: Partial<Producto> = {
      nom_producto: createDto.nom_producto,
      descripcion: createDto.descripcion,
      precio: createDto.precio,
      stock: typeof createDto.stock === 'number' ? createDto.stock : Number(createDto.stock) || 0,

      is_oferta: isOferta,
      porcentaje_oferta: isOferta ? createDto.porcentaje_oferta : null,
    };
    console.log('Stock recibido:', createDto.stock, typeof createDto.stock);

    const product = this.productoRepository.create(productoData);
  
    // Cálculo seguro del precio final
    if (isOferta && createDto.porcentaje_oferta != null) {
      product.precio_final =
        createDto.precio - (createDto.precio * createDto.porcentaje_oferta) / 100;
    } else {
      product.precio_final = createDto.precio;
    }
  
    return this.productoRepository.save(product);
  }
  
  
  
  

  // Obtener todos los productos
  findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  // Obtener un producto por id
  async findOne(id: number): Promise<Producto> {
    const product = await this.productoRepository.findOne({ where: { id_producto: id } });
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  // Actualizar un producto
  async update(id: number, updateDto: UpdateProductoDto): Promise<Producto> {
    console.log('DTO recibido para actualización:', updateDto); // Agrega este log para verificar los datos recibidos
  
    const product = await this.findOne(id);
  
    // Mezcla los datos del DTO con el producto existente
    this.productoRepository.merge(product, updateDto);
  
    // Recalcular precio final si hay cambios
    if (updateDto.is_oferta !== undefined || updateDto.porcentaje_oferta !== undefined) {
      const isOferta = updateDto.is_oferta !== undefined ? updateDto.is_oferta : product.is_oferta;
      this.calcularPrecioFinal(product, isOferta, updateDto.porcentaje_oferta);
    }
  
    return this.productoRepository.save(product);
  }
  
  


  // Eliminar un producto
  async remove(id: number): Promise<void> {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id },
      relations: ['ventas'],
    });
  
    if (!producto) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
  
    if (producto.ventas && producto.ventas.length > 0) {
      throw new BadRequestException('No se puede eliminar un producto con ventas registradas.');
    }
  
    await this.productoRepository.delete(id);
  }
  
  

  // Método para calcular el precio final del producto basado en oferta
  private calcularPrecioFinal(product: Producto, isOferta: boolean, porcentajeOferta?: number) {
    if (isOferta && porcentajeOferta != null) {
      product.precio_final = product.precio - (product.precio * porcentajeOferta) / 100;
    } else {
      product.precio_final = product.precio;
    }
  }
  
}
