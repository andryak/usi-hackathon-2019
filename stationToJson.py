import csv
import json


dir = '../publibike/stations/'

stationsDict={}
with open(dir+'stations.csv', newline='') as csvfile:
    stations = csv.DictReader(csvfile)
    for station in stations:
        stationId = station['id']
        keys=station.keys()
        for key in keys:
            if key != 'id':
                if stationId not in stationsDict:
                    innerDict={}
                    innerDict[key] = station[key]
                    stationsDict[stationId]=innerDict
                else:
                    innerDict[key]=station[key]
with open(dir+'stations.json', 'w') as f:
    json.dump(stationsDict, f)        