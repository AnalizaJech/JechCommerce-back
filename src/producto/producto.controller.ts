import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // Sólo un usuario con rol "admin" puede crear productos
  @Roles('admin')
  @Post()
  create(@Body() createDto: CreateProductoDto) {
    return this.productoService.create(createDto);
  }

  // GET: Todos los roles autenticados pueden ver los productos
  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  // GET: un producto por ID (usuario autenticado)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  // PUT: sólo "admin" puede actualizar
  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateDto);
  }

  // DELETE: sólo "admin" puede eliminar
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}
