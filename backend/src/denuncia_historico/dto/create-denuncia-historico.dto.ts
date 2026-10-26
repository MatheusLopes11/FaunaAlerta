import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDenunciaHistoricoDto {
    @IsNumber()
    @IsNotEmpty()
    denunciaId: number;

    @IsEnum(['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada'])
    @IsOptional()
    statusDenun?: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';

    @IsString()
    @IsOptional()
    @MaxLength(255)
    observacao?: string;

    @IsEnum(['ORGAO', 'SISTEMA'])
    @IsNotEmpty()
    origem: 'ORGAO' | 'SISTEMA';
}