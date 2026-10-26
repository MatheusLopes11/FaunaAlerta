import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, IsUrl } from 'class-validator';

export class CreateAlertaMidiaDto {
    @IsNumber()
    @IsNotEmpty()
    alertaId: number;

    @IsEnum(['FOTO', 'VIDEO'])
    @IsNotEmpty()
    tipo: 'FOTO' | 'VIDEO';

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    url: string;
}