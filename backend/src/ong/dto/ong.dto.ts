import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOngDto {
    @IsString()
    @MaxLength(150)
    nome: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    contato?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    site?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    areasAtuacao?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(2)
    uf?: string;
    }