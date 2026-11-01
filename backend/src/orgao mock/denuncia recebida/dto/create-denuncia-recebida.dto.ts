import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { TIPOS_DENUNCIA, type TipoDenuncia } from '../../../denuncias/tipos.js';

export class CreateDenunciaRecebidaDto {
  @IsString() @IsNotEmpty() @MaxLength(20)
  protocolo: string;

  @IsEnum([...TIPOS_DENUNCIA]) @IsNotEmpty()
  tipo: TipoDenuncia;

  @IsString() @IsNotEmpty()
  descricao: string;

  @IsString() @IsOptional() @MaxLength(255)
  localDescricao?: string;

  @IsString() @IsOptional()
  dataOcorrencia?: string;

  @IsNumber() @Min(-34.5) @Max(6) @IsOptional()
  latitude?: number;

  @IsNumber() @Min(-74.5) @Max(-28) @IsOptional()
  longitude?: number;

  @IsEnum(['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada']) @IsOptional()
  statusDenun?: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';
}