import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListEspeciesQueryDto {
    @Type(() => Number) @IsInt() @Min(1) @IsOptional()
    page?: number = 1;

    @Type(() => Number) @IsInt() @Min(1) @Max(50) @IsOptional()
    limit?: number = 12;

    @IsString() @IsOptional()
    busca?: string;

    @IsString() @IsOptional()
    grupo?: string;

    @IsString() @IsOptional()
    status?: string;

    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean() @IsOptional()
    apareceEmCasas?: boolean;

    @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : undefined))
    @IsBoolean() @IsOptional()
    revisado?: boolean;
}