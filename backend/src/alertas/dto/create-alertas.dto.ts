import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAlertaDto {
    @IsNumber()
    @IsOptional()
    especieId?: number;

    @IsNumber()
    @IsOptional()
    usuarioId?: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    municipio: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(2)
    uf: string;

    @IsEnum(['AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL'])
    @IsOptional()
    bioma?: 'AMAZONIA' | 'CERRADO' | 'MATA ATLANTICA' | 'CAATINGA' | 'PAMPA' | 'PANTANAL';

    @IsDateString()
    @IsNotEmpty()
    dataAvistamento: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsEnum(['PENDENTE', 'VERIFICADO', 'REJEITADO'])
    @IsOptional()
    situacao?: 'PENDENTE' | 'VERIFICADO' | 'REJEITADO';
}