-- CONSULTAS 
select * from usuario;


-- Mostra os dez locais com mais avistamentos
SELECT uf, municipio, total_alertas, especies_distintas, alertas_ameacadas, alertas_invasoras, ultimo_registro
FROM vw_ranking_locais
ORDER BY total_alertas DESC, especies_distintas DESC LIMIT 10;

-- Mostra os dez animais com mais avistamentos relacionados
SELECT especie, nome_cientifico, classificacao, status_conservacao, 
	COUNT(*) AS avistamentos,
    COUNT(DISTINCT CONCAT(uf, '-', municipio)) AS locais
FROM vw_alertas_relatorio
WHERE situacao = 'VERIFICADO' AND especie_id IS NOT NULL
GROUP BY especie_id, especie, nome_cientifico, classificacao, status_conservacao
ORDER BY avistamentos DESC LIMIT 10;

-- Mostra as especies nativas ameaçadas que foram avistadas, por estado
SELECT uf, especie, nome_cientifico, status_conservacao,
	COUNT(*) AS avistamentos,
    MAX(data_avistamento) AS ultimo_avistamento
FROM vw_alertas_relatorio
WHERE situacao = 'VERIFICADO' AND classificacao = 'Nativa ameaçada'
GROUP BY uf, especie, nome_cientifico, status_conservacao
ORDER BY uf, avistamentos DESC;

-- Mostra o primeiro avistamento p/ estado
SELECT uf, especie, nome_cientifico,
	MIN(data_avistamento) AS primeiro_registro,
    MAX(data_avistamento) AS ultimo_registro,
    COUNT(*) AS avistamento,
    COUNT(DISTINCT municipio) AS municipios
FROM vw_alertas_relatorio
WHERE situacao ='VERIFICADO' AND classificacao = 'Exótica invasora'
GROUP BY uf, especie, nome_cientifico
ORDER BY primeiro_registro DESC;

-- Compara a classificacao x bioma, mostrando a quantidade de alertas de especies pertecentes a determinado bioma
SELECT COALESCE(bioma, 'Não informado') AS bioma,
	COUNT(*) AS total,
    SUM(classificacao = 'Nativa ameaçada') AS nativas_ameadacadas,
    SUM(classificacao = 'Exótica invasora') AS invasoras,
    SUM(classificacao = 'Exótica') AS exoticas,
    SUM(classificacao IN('Nativa, Nativa quase ameaçada')) AS nativas_outras,
    SUM(classificacao = 'Não identificada') AS nao_identificadas
FROM vw_alertas_relatorio
WHERE situacao = 'VERIFICADO'
GROUP BY 1
ORDER BY total DESC;

USE FaunaAlerta;
-- 1. Catálogo com biomas (página /especies e mapa da home)
SELECT e.nome_popular, e.status_conservacao, GROUP_CONCAT(eb.bioma) AS biomas
FROM Especies e LEFT JOIN Especie_biomas eb ON eb.especie_id = e.id
GROUP BY e.id ORDER BY e.nome_popular;

-- 2. Espécies ameaçadas por bioma (mapa da home)
SELECT eb.bioma, COUNT(*) AS especies_ameacadas
FROM Especie_biomas eb JOIN Especies e ON e.id = eb.especie_id
WHERE e.status_conservacao IN ('VU','EN','CR','EW')
GROUP BY eb.bioma ORDER BY especies_ameacadas DESC;

-- 3. Relatório do pesquisador: alertas por espécie e situação
SELECT e.nome_popular, a.situacao, COUNT(*) AS total
FROM Alertas a JOIN Especies e ON e.id = a.especie_id
WHERE a.data_avistamento BETWEEN '2026-01-01' AND '2026-12-31'
GROUP BY e.nome_popular, a.situacao ORDER BY total DESC;

-- 4. Histórico de denúncias de um usuário (perfil)
SELECT d.protocolo, d.tipo, d.status_atual, d.criado_em
FROM Denuncias d JOIN Usuario u ON u.id = d.usuario_id
WHERE u.email = 'maria@email.com' ORDER BY d.criado_em DESC;

-- 5. Cadastros de pesquisadores para análise do admin
SELECT u.nome, p.instituicao, p.area_pesquisa, u.status_cadastro
FROM Usuario u JOIN Pesquisador p ON p.usuario_id = u.id
ORDER BY FIELD(u.status_cadastro,'Pendente','Aprovado','Negado');

-- 6. Linha do tempo de uma denúncia
SELECT h.criado_em, h.status_denun, h.origem, h.observacao
FROM Denuncia_historico h JOIN Denuncias d ON d.id = h.denuncia_id
WHERE d.protocolo = 'FA-2026-CD5N9P' ORDER BY h.criado_em;

-- 7. Uso das views, funções e procedures
SELECT * FROM vw_alertas_por_bioma;
SELECT nome_popular, fn_total_alertas_especie(id) AS alertas FROM Especies;
CALL sp_resumo_denuncias_usuario((SELECT id FROM Usuario WHERE email='maria@email.com'));