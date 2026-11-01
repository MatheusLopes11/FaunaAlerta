import { IsEnum } from 'class-validator';

export class AtualizarStatusDto {
  @IsEnum(['Recebida', 'Em_validacao', 'Em_resolucao', 'Concluida', 'Rejeitada'])
  statusDenun: 'Recebida' | 'Em_validacao' | 'Em_resolucao' | 'Concluida' | 'Rejeitada';
}