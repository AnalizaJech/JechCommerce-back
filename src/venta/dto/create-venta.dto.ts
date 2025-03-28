import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVentaDto {
  @ApiProperty({ example: 1, description: 'ID del producto a comprar' })
  @IsInt()
  @IsPositive()
  id_producto: number;

  @ApiProperty({ example: 2, description: 'Cantidad de productos a comprar' })
  @IsInt()
  @IsPositive()
  cantidad: number;
}
