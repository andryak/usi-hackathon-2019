import csv
import json
import sys

KEYS_TO_CONVERT_TO_FLOAT = ['latitude', 'longitude']


# input argument: directory to the stations csv
# output: structured dictionary
def constructStationsDict(dir):
    keysToSkip = ['id', 'networkId', 'networkName']
    stationsDict = {}
    with open(dir + '/stations/stations.csv', newline='') as csvfile:
        stations = csv.DictReader(csvfile)
        for station in stations:
            stationId = station['id']
            keys = station.keys()
            for key in keys:
                if key not in keysToSkip:
                    if stationId not in stationsDict:
                        innerDict = {}
                        innerDict[key] = station[
                            key] if key not in KEYS_TO_CONVERT_TO_FLOAT else string_to_float(station[key])
                        stationsDict[stationId] = innerDict
                    else:
                        innerDict[key] = station[
                            key] if key not in KEYS_TO_CONVERT_TO_FLOAT else string_to_float(station[key])
    return stationsDict


def string_to_float(str):
    return float(str)


def mapStationNameToId(dir):
    stationsDict = constructStationsDict(dir)
    nameIdMap = {}
    for row in stationsDict:
        name = stationsDict[row]['name']
        nameIdMap[name] = row
    return nameIdMap


dir = sys.argv[1]
mapStationNameToId(dir)


def generateJson(dir):
    with open(dir + '/stations/stations.json', 'w') as f:
        json.dump(constructStationsDict(dir), f)
