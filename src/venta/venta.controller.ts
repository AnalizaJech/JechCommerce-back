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
import { Venta } from './entities/venta.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ventas')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
@Roles('cliente')
async crearVenta(
  @Body() items: CreateVentaDto[],
  @Request() req,
): Promise<any> {
  return this.ventaService.crearVentas(items, req.user); // 👈 req.user DEBE tener id_usuario
}


  @Get('mis-compras')
  @Roles('cliente')
  async obtenerMisCompras(@Request() req): Promise<Venta[]> {
    return this.ventaService.obtenerMisVentas(req.user.id_usuario);
  }

  @Get('ventas-globales')
  @Roles('admin')
  async obtenerVentasGlobales(): Promise<Venta[]> {
    return this.ventaService.obtenerTodas();
  }

  

  
}
