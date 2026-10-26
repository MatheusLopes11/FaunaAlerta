import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateDocumentoVerificaoDto {
    @IsNumber()
    @IsNotEmpty()
    usuarioId: number;

    @IsEnum(['COMPROVANTE_VINCULO', 'LATTES', 'CARTAO_CNPJ', 'PORTARIA_NOMEACAO', 'OUTRO'])
    @IsNotEmpty()
    tipo: 'COMPROVANTE_VINCULO' | 'LATTES' | 'CARTAO_CNPJ' | 'PORTARIA_NOMEACAO' | 'OUTRO';

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    caminhoArquivo: string;
}