import { IsIn, IsInt, Max, Min } from 'class-validator';

export class ImportarGbifDto {
  @IsIn(['MAMIFERO', 'AVE', 'REPTIL', 'ANFIBIO', 'ARACNIDEO', 'INSETO'])
  grupo: string;

  @IsInt() @Min(1) @Max(100)
  quantidade: number;
}