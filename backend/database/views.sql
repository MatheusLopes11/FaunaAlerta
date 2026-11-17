-- VIEWS

USE FaunaAlerta;

/*
VIEW 1:
VIEW PARA O RELATÓRIO DO PESQUISADOR, PEGA OS ALERTAS (SEM EXPOR NENHUMA INFORMAÇÃO DO USUÁRIO) E SELECIONA JUNTO DA TABELA DA ESPÉCIE PARA QUE
TENHA MAIS INFORMAÇÕES EM TORNO DA ESPÉCIE CORRELACIONADA. ALÉM DISSO, SE UTILIZA DA FUNÇÃO classificacao_especie.
*/
-- DROP VIEW IF EXISTS vw_alertas_relatorio;

CREATE VIEW vw_alertas_relatorio AS
SELECT 
	a.id AS alerta_id,
    a.data_avistamento AS data_avistamento,
    YEAR(a.data_avistamento) AS ano,
    MONTH(a.data_avistamento) AS mes,
    DATE_FORMAT(a.data_avistamento, '%Y-%m') AS ano_mes,
    a.municipio AS municipio,
    a.UF AS UF,
    a.bioma AS bioma,
    a.situacao AS situacao,
    e.id AS especie_id,
    COALESCE(e.nome_popular, 'Não identificada') AS especie,
    e.nome_cientifico AS nome_cientifico,
    e.grupo AS grupo,
    e.origem AS origem,
    e.status_conservacao AS status_conservacao,
    classificacao_especie(e.origem, e.status_conservacao) AS classificacao,
    (SELECT COUNT(*) FROM alerta_midias m WHERE m.alerta_id = a.id) AS qtd_midias
FROM alertas a
LEFT JOIN especies e ON e.id = a.especie_id;

-- USO
SELECT * FROM vw_alertas_relatorio;

/*
VIEW 2:
ESSA VIEW DIZ A QUANTIDADE DE AVISTAMENTOS EM CADA MUNÍCIPIO	
*/

-- DROP VIEW IF EXISTS vw_ranking_locais;

CREATE VIEW vw_ranking_locais AS
SELECT 
	uf,
    municipio,
    COUNT(*) AS total_alertas,
    COUNT(DISTINCT especie_id) AS especies_distintas,
    SUM(classificacao = 'Nativa ameaçada') AS alertas_ameacadas,
    SUM(classificacao = 'Exótica invasora') as alertas_invasoras,
    MIN(data_avistamento) AS primeiro_registro,
    MAX(data_avistamento) AS ultimo_registro
FROM vw_alertas_relatorio
WHERE situacao = 'VERIFICADO'
GROUP BY uf, municipio;


-- USO
SELECT * FROM vw_ranking_locais;

USE FaunaAlerta;
CREATE OR REPLACE VIEW vw_pesquisadores_pendentes AS
SELECT u.id, u.nome, u.email, p.instituicao, p.area_pesquisa
FROM Usuario u INNER JOIN Pesquisador p ON p.usuario_id = u.id
WHERE u.status_cadastro = 'Pendente';

CREATE OR REPLACE VIEW vw_alertas_por_bioma AS
SELECT a.bioma, COUNT(*) AS total_alertas,
       SUM(a.situacao = 'VERIFICADO') AS verificados
FROM Alertas a WHERE a.bioma IS NOT NULL GROUP BY a.bioma;

CREATE OR REPLACE VIEW vw_especies_ameacadas AS
SELECT e.nome_popular, e.status_conservacao, eb.bioma
FROM Especies e INNER JOIN Especie_biomas eb ON eb.especie_id = e.id
WHERE e.status_conservacao IN ('NT','VU','EN','CR','EW');