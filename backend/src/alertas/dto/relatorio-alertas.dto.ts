import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export const SITUACOES = ['PENDENTE', 'VERIFICADO', 'REJEITADO'] as const;
export type Situacao = (typeof SITUACOES)[number];

export class RelatorioAlertasQueryDto {
    @IsString() @Length(2, 2) @IsOptional()
    uf?: string;

    @IsString() @MaxLength(100) @IsOptional()
    municipio?: string;

    @Type(() => Number) @IsInt() @Min(1) @IsOptional()
    especieId?: number;

    @IsDateString() @IsOptional()
    de?: string;

    @IsDateString() @IsOptional()
    ate?: string;

    @IsEnum([...SITUACOES]) @IsOptional()
    situacao?: Situacao;
}

export class MunicipiosQueryDto {
    @IsString() @Length(2, 2)
    uf: string;
}

export class AlterarSituacaoDto {
    @IsEnum([...SITUACOES])
    situacao: Situacao;
}