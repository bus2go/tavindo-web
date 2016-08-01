/*
SELECT DISTINCT r.ordem, r.id_linha, r.num_linha, r.total_pontos, r.data_hora_inicio, r.data_hora_fim, g.id_gps, g.sequencia, g1.lat, g1.lon, g1.velocidade, g.data_hora
FROM rota_gps r, gps_ativo g, gps g1
WHERE r.num_linha = $1 
AND r.id_linha = g.id_linha
AND r.ordem = g.ordem
AND r.ordem = $2
AND r.total_pontos = $3
AND g.data_hora >= r.data_hora_inicio
AND g.data_hora <= r.data_hora_fim
AND g.id_gps = g1.id
AND g.sequencia <= $4
AND g.sequencia > g.seq_anterior
ORDER BY g.sequencia ASC

 ordem  | id_linha | num_linha | total_pontos |    data_hora_inicio    |     data_hora_fim      | sequencia_ultimo 
--------+----------+-----------+--------------+------------------------+------------------------+------------------
 A72038 |        1 | 422       |          397 | 2015-11-16 04:59:17-05 | 2015-11-16 12:16:36-05 |              401

*/

SELECT g.id_rota,
    g.ordem, 
    g.id_linha, 
    g.num_linha, 
    g.data_hora AS data_hora_inicio, 
    g.data_hora AS data_hora_fim,
    g.id_gps,
    g.sequencia,
    g1.lat,
    g1.lon,
    g1.velocidade,
    g.data_hora
FROM gps_ativo g, gps g1
WHERE g.id_gps = g1.id
AND g.id_rota = $1
/*
AND g.data_hora >= $3
AND g.data_hora <= $4
AND g.ordem = $2
AND g.num_linha = $1
*/