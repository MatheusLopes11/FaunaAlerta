import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginacaoQueryDto {
    @Type(() => Number) @IsInt() @Min(1) @IsOptional()
    page?: number = 1;

    @Type(() => Number) @IsInt() @Min(1) @Max(50) @IsOptional()
    limit?: number = 5;
}