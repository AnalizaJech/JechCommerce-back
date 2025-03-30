import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,  // Importamos el ParseIntPipe
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard) // Protegemos todas las rutas con JwtAuthGuard y RolesGuard
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // Ruta para crear productos, solo accesible por un "admin"
  @Roles('admin')
  @Post()
  create(@Body() createDto: CreateProductoDto) {
    return this.productoService.create(createDto);
  }

  // Ruta para obtener todos los productos, accesible por cualquier usuario autenticado
  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  // Ruta para obtener un producto por su ID (requiere autenticación)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {  // Usamos ParseIntPipe para convertir el parámetro id
    return this.productoService.findOne(id);
  }

  // Ruta para actualizar un producto por ID, solo accesible por un "admin"
  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateProductoDto) {
    return this.productoService.update(id, updateDto);
  }

  // Ruta para eliminar un producto por ID, solo accesible por un "admin"
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.remove(id);
  }
}
