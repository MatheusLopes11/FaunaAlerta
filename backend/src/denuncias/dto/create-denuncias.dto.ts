import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { TIPOS_DENUNCIA, type TipoDenuncia } from '../tipos.js';

export class CreateDenunciaDto {
    @IsEnum([...TIPOS_DENUNCIA])
    tipo: TipoDenuncia;

    @IsDateString()
    dataOcorrencia: string;

    @IsString() @IsNotEmpty() @MaxLength(100)
    municipio: string;

    @IsString() @Length(2, 2)
    uf: string;

    @IsString() @IsOptional() @MaxLength(150)
    referencia?: string;

    @IsString() @IsNotEmpty() @MaxLength(5000)
    descricao: string;

    @IsNumber() @Min(-34.5) @Max(6) @IsOptional()
    latitude?: number;

    @IsNumber() @Min(-74.5) @Max(-28) @IsOptional()
    longitude?: number;
}