import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  nom_producto: string;

  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsBoolean()
  is_oferta?: boolean;

  @IsOptional()
  @IsInt()
  porcentaje_oferta?: number;

  @IsInt()
  @Min(0)
  stock: number;
}
