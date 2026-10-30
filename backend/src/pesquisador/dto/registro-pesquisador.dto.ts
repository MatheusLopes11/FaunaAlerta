import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class RegistroPesquisadorDto {
    @IsString() @IsNotEmpty() @MaxLength(250)
    nome: string;

    // E-mail institucional: serve de login e fica gravado no perfil de pesquisador.
    @IsEmail() @MaxLength(70)
    email: string;

    @IsString() @IsOptional() @MaxLength(20)
    telefone?: string;

    @IsString() @MinLength(8) @MaxLength(72)
    senha: string;

    @IsString() @IsNotEmpty() @MaxLength(200)
    instituicao: string;

    @IsString() @IsNotEmpty() @MaxLength(150)
    areaPesquisa: string;

    @IsUrl() @IsOptional() @MaxLength(255)
    linkLattesOrcid?: string;
}