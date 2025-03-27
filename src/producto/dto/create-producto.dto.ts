export class CreateProductoDto {
    nom_producto: string;
    descripcion: string;
    precio: number;
    is_oferta?: boolean;
    porcentaje_oferta?: number;
  }
  