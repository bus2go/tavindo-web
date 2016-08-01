SELECT g.id_rota, g.ordem, g.id_linha, g.num_linha, 
    COUNT(*) AS total_pontos, 
    MIN(g.data_hora) AS data_hora_inicio, 
    MAX(g.data_hora) AS data_hora_fim,
    MAX(g.sequencia) AS sequencia_ultimo
FROM gps_ativo g
WHERE g.num_linha = $1
GROUP BY g.id_rota, g.ordem, g.id_linha, g.num_linha
ORDER BY COUNT(*) DESC
LIMIT 1;