SELECT
    NULL AS id_gps,
    NULL AS route_id, 
    d.route_short_name AS linha, 
    d.route_short_name AS descricao,  
    'S' AS ativo,
    NULL AS service_id, 
    d.trip_headsign, 
    d.shape_id, 
    d.lat, 
    d.lon, 
    shape_pt_sequence,
    distancia_total
FROM distance d
WHERE d.route_short_name = $1
ORDER BY
    d.trip_headsign ASC,
    d.shape_pt_sequence ASC;