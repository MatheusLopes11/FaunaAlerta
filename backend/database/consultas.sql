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