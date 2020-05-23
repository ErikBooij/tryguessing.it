<?php
declare(strict_types=1);

use TryGuessingIt\CityFetcherWikipedia;
use TryGuessingIt\Domain\City;

include __DIR__ . '/../vendor/autoload.php';

$opts = getopt('', ['refresh']);

$refresh = isset($opts['refresh']);
$dataDir = __DIR__ . '/../data';

define('FILE_RAW_DATA', "{$dataDir}/raw.csv");
define('FILE_CITIES', "{$dataDir}/cities.json");
define('FILE_CITY_IDS', "{$dataDir}/city_ids.json");
define('FILE_CITIES_INDEXED', "{$dataDir}/cities_indexed.json");
define('FILE_COUNTRIES', "{$dataDir}/countries.json");
define('FILE_CAPITALS', "{$dataDir}/capitals.json");

// Raw data downloaded from https://simplemaps.com/data/world-cities
if (!file_exists(FILE_RAW_DATA)) {
    echo 'No raw data file found. Rerun with --refresh to fetch raw data.', PHP_EOL;
    exit(1);
}

if (!is_readable(FILE_RAW_DATA)) {
    echo 'Raw data file at ' . realpath(FILE_RAW_DATA) . ' is not readable', PHP_EOL;
    exit(1);
}

$rawDataHandle = fopen(FILE_RAW_DATA, 'r');

$skip = 1;

$cities = [];

while ($record = fgetcsv($rawDataHandle)) {
    if ($skip-- > 0) continue;

    $cities[] = new City(
        (string)$record[1],
        (string)$record[4],
        (float)$record[2],
        (float)$record[3],
        ((string)$record[8]) === 'primary'
    );
}

usort($cities, fn(City $a, City $b): int => $a->getCountry() <=> $b->getCountry() ?: $a->getName() <=> $b->getName());

file_put_contents(FILE_CITIES, json_encode($cities));
file_put_contents(FILE_COUNTRIES, json_encode(array_values(array_unique(array_map(fn (City $city): string => $city->getCountry(), $cities)))));
file_put_contents(FILE_CITY_IDS, json_encode(array_map(fn(City $city): string => $city->getId(), $cities)));
file_put_contents(FILE_CAPITALS, json_encode(array_values(array_filter($cities, fn(City $city): bool => $city->isCapital()))));


