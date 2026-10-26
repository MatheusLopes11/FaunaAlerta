import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDenunciaRecebidaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  protocolo: string;

  @IsEnum(['CACA', 'PESCA', 'MAUS_TRATOS', 'TRAFICO', 'OUTRO'])
  @IsNotEmpty()
  tipo: 'CACA' | 'PESCA' | 'MAUS_TRATOS' | 'TRAFICO' | 'OUTRO';

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  localDescricao?: string;

  @IsString()
  @IsOptional()
  dataOcorrencia?: string;

  @IsEnum(['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada'])
  @IsOptional()
  statusDenun?: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';
}