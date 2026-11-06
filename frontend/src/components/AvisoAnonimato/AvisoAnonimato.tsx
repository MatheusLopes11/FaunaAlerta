import { Link } from 'react-router-dom'

export function AvisoAnonimato({ logado }: { logado: boolean }) {
    return (
        <div className={logado ? 'denuncia-aviso denuncia-aviso-ok' : 'denuncia-aviso'}>
            {logado ? (
                <p><strong>Denúncia identificada.</strong> Ela ficará vinculada à sua conta e você poderá acompanhar o andamento no histórico do seu perfil.</p>
            ) : (
                <p><strong>Você não está logado: esta denúncia será anônima.</strong></p>
            )}

            <details>
                <summary>Qual a diferença entre denúncia identificada e anônima?</summary>
                <ul>
                    <li><strong>Identificada (com login):</strong> você recebe um protocolo e a denúncia fica ligada à sua conta. Cada mudança de situação feita pelo órgão (em validação, em resolução, concluída ou recusada) aparece no seu histórico.</li>
                    <li><strong>Anônima (sem login):</strong> você também recebe um protocolo, mas nada fica ligado a você e a denúncia não aparece em nenhum histórico. Guarde o número: o acompanhamento só poderá ser feito diretamente com o órgão.</li>
                    <li><strong>Em ambos os casos</strong> o formulário não pede nome nem contato, e o órgão recebe apenas o relato, o local e a data.</li>
                </ul>
                {!logado && (
                    <p>Quer acompanhar pelo sistema? <Link to="/login">Entre na sua conta</Link> antes de enviar (o que você preencheu aqui será perdido).</p>
                )}
            </details>
        </div>
    )
}