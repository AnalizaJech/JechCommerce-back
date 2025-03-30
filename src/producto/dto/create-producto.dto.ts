// src/producto/dto/create-producto.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean, IsPositive, Max, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nom_producto: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsBoolean()
  is_oferta?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentaje_oferta?: number | null;



}
