import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDenunciaMidiaMockDto {
  @IsNumber()
  @IsNotEmpty()
  denunciaId: number; 

  @IsEnum(['FOTO', 'VIDEO'])
  @IsNotEmpty()
  tipo: 'FOTO' | 'VIDEO';

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  denuncianteNome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  denuncianteEmail?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  denuncianteTelefone?: string;
}