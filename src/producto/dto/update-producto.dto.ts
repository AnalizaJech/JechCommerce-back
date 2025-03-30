import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  
  @IsOptional()
  @IsString()
  nom_producto?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)  // Permitimos 0 o valores positivos
  precio?: number;

  @IsOptional()
  @IsBoolean()
  is_oferta?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)  // Permitimos 0 para porcentaje de oferta
  @Max(100) // Aseguramos que el porcentaje no sea mayor a 100
  porcentaje_oferta?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)  // Permitimos 0 o valores positivos para stock
  stock?: number;
}
