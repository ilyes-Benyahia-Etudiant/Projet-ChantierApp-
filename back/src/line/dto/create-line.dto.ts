import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateLineDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price_per_qty: number;

  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @IsInt()
  @IsNotEmpty()
  estimate_id: number;
}
