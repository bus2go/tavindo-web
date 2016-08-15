SELECT DISTINCT 
    NULL AS id_gps,
    r.route_id, 
    route_short_name AS linha, 
    route_long_name AS descricao, 
    'S' AS ativo,
    service_id, 
    rt.trip_headsign, 
    s.shape_id, 
    shape_pt_lat AS lat, 
    shape_pt_lon AS lon, 
    shape_pt_sequence::integer, 
    shape_dist_traveled 
FROM routes r, routes_trips rt, trips t, shapes s
WHERE r.route_short_name = $1
AND r.route_id = rt.route_id
AND rt.trip_id = t.trip_id
AND t.shape_id = s.shape_id
ORDER BY
    rt.trip_headsign ASC,
    shape_pt_sequence::integer ASC;