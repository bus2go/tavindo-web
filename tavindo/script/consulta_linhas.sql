SELECT DISTINCT
    route_id,
    route_short_name AS linha,
    route_long_name AS nome,
    route_city AS city,
    CASE
        WHEN route_city = 'Rio de Janeiro' THEN 1
        WHEN route_city = 'Intermunicipal RMRJ' THEN 2
        ELSE 3
    END AS ordem
FROM routes
ORDER BY
    ordem ASC,
    route_city ASC,
    route_short_name ASC;