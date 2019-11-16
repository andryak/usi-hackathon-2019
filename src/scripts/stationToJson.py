import csv
import json
import sys


#input argument: direcory to the stations csv
#output: structured dictionary
def constructStationsDict(dir):
    keysToSkip=['id','networkId','networkName']
    stationsDict={}
    with open(dir+'/stations/stations.csv', newline='') as csvfile:
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

def mapStationNameToId(dir):
    stationsDict=constructStationsDict(dir)
    nameIdMap={}
    for row in stationsDict:
        name=stationsDict[row]['name']
        nameIdMap[name]=row
    return nameIdMap

dir=sys.argv[1]
mapStationNameToId(dir)

def generateJson(dir):
    with open(dir+'/stations/stations.json', 'w') as f:
        json.dump(constructStationsDict(dir), f)
