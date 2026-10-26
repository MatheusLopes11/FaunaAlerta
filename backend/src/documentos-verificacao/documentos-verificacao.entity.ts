import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity.js';

@Entity('documentos_verificacao')
export class DocumentosVerificacao {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true})
    id: number;

    @Column({ name: 'usuario_id', type: 'int', unsigned: true, nullable: true })
    usuarioId: number;

    @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Column({
        type: 'enum',
        enum: ['COMPROVANTE_VINCULO', 'LATTES', 'CARTAO_CNPJ', 'PORTARIA_NOMEACAO', 'OUTRO'],
        nullable: false,
    })
    tipo: 'COMPROVANTE_VINCULO' | 'LATTES' | 'CARTAO_CNPJ' | 'PORTARIA_NOMEACAO' | 'OUTRO';

    @Column({ name: 'caminho_arquivo', type: 'varchar', length: 255, nullable: false })
    caminhoArquivo: string;
}