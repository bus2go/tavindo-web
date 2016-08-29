SELECT DISTINCT
    route_short_name AS linha,
    route_long_name AS nome
FROM routes
ORDER BY route_short_name ASC;