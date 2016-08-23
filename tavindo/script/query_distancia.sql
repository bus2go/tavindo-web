SELECT
    d1.route_short_name,
    d1.trip_headsign,
    d1.shape_id,
    d1.lat,
    d1.lon,
    d1.shape_pt_sequence,
    d1.distance,
    SUM(d1.distance) OVER (PARTITION BY shape_id ORDER BY shape_pt_sequence) AS distancia_total
FROM points_distance d1
ORDER BY route_short_name, trip_headsign, shape_pt_sequence;