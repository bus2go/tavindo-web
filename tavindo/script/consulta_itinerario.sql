/*
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
*/
SELECT
    route_id,
    route_city,
    route_short_name,
    route_long_name,
    route_fare,
    route_service,
    route_headsign1,
    route_poly1,
    route_headsign2,
    route_poly2
FROM routes
WHERE route_id = $1
ORDER BY
    route_city ASC,
    route_headsign1 ASC;