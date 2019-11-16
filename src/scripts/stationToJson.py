import csv
import json
import sys


#input argument: direcory to the stations csv
#output: structured dictionary
def constructStationsDict(dir):
    keysToSkip=['id','networkId','networkName']
    stationsDict={}
    with open(dir+'stations.csv', newline='') as csvfile:
        stations = csv.DictReader(csvfile)
        for station in stations:
            stationId = station['id']
            keys=station.keys()
            for key in keys:
                if key not in keysToSkip:
                    if stationId not in stationsDict:
                        innerDict={}
                        innerDict[key] = station[key]
                        stationsDict[stationId]=innerDict
                    else:
                        innerDict[key]=station[key]
    return stationsDict


dir=sys.argv[1]
with open(dir+'stations.json', 'w') as f:
    json.dump(constructStationsDict(dir), f)
