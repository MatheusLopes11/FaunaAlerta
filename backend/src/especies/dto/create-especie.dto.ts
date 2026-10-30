import {
    IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength, IsInt, Min, IsBoolean, IsArray, ArrayUnique,
} from 'class-validator';

export class CreateEspecieDto {
    @IsString() @IsNotEmpty() @MaxLength(120)
    nomePopular: string;

    @IsString() @IsNotEmpty() @MaxLength(150)
    nomeCientifico: string;

    @IsEnum(['NATIVA', 'EXOTICA', 'EXOTICA_INVASORA'])
    origem: string;

    @IsEnum(['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'DD', 'NE']) @IsOptional()
    statusConservacao?: string;

    @IsString() @IsOptional()
    descricao?: string;

    @IsString() @IsOptional() @MaxLength(500)
    imagemUrl?: string;

    @IsEnum(['MAMIFERO', 'AVE', 'REPTIL', 'ANFIBIO', 'PEIXE', 'ARACNIDEO', 'INSETO', 'OUTRO']) @IsOptional()
    grupo?: string;

    @IsEnum(['NENHUM', 'BAIXO', 'MODERADO', 'ALTO']) @IsOptional()
    nivelRisco?: string;

    @IsString() @IsOptional()
    descricaoRisco?: string;

    @IsInt() @Min(0) @IsOptional()
    expectativaVidaMin?: number;

    @IsInt() @Min(0) @IsOptional()
    expectativaVidaMax?: number;

    @IsBoolean() @IsOptional()
    apareceEmCasas?: boolean;

    @IsString() @IsOptional()
    curiosidades?: string;

    @IsString() @IsOptional() @MaxLength(255)
    fonte?: string;

    @IsArray() @ArrayUnique()
    @IsEnum(['AMAZONIA', 'CERRADO', 'MATA ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL'], { each: true })
    @IsOptional()
    biomas?: ('AMAZONIA' | 'CERRADO' | 'MATA ATLANTICA' | 'CAATINGA' | 'PAMPA' | 'PANTANAL')[];

    @IsBoolean() @IsOptional()
    revisado?: boolean;
}