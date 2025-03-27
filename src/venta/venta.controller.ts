import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ventas')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  @Roles('cliente')
  crearVenta(@Body() dto: CreateVentaDto, @Request() req) {
    return this.ventaService.crearVenta(dto, req.user);
  }

  @Get('mis-compras')
  @Roles('cliente')
  obtenerMisCompras(@Request() req) {
    return this.ventaService.obtenerMisVentas(req.user.id_usuario);
  }

  @Get()
  @Roles('admin')
  obtenerTodas() {
    return this.ventaService.obtenerTodas();
  }
}
