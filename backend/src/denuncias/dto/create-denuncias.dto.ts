import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDenunciaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    protocolo: string;

    @IsNumber()
    @IsOptional()
    usuarioId?: number;

    @IsEnum(['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada'])
    @IsOptional()
    statusAtual?: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';

    @IsEnum(['PENDENTE', 'ENVIADA', 'FALHA'])
    @IsOptional()
    statusEnvio?: 'PENDENTE' | 'ENVIADA' | 'FALHA';
}