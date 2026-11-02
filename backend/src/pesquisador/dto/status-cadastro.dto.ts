import { IsEnum, IsOptional } from 'class-validator';

export const STATUS_CADASTRO = ['Aprovado', 'Pendente', 'Negado'] as const;
export type StatusCadastro = (typeof STATUS_CADASTRO)[number];

export class AlterarStatusCadastroDto {
    @IsEnum([...STATUS_CADASTRO])
    statusCadastro: StatusCadastro;
}

export class ListaSolicitacoesQueryDto {
    @IsEnum([...STATUS_CADASTRO]) @IsOptional()
    status?: StatusCadastro;
}
