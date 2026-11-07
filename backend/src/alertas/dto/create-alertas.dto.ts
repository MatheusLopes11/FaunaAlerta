import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlertaDto {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    especieId?: number;

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

    @Type(() => Number)
    @IsNumber()
    @Min(-34.5)
    @Max(6)
    @IsOptional()
    latitude?: number;

    @Type(() => Number)
    @IsNumber()
    @Min(-74.5)
    @Max(-28)
    @IsOptional()
    longitude?: number;
}