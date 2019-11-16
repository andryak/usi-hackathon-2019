import csv
import json
import sys


#input argument: direcory to the stations csv
#output: json representing with the needed json data
def stationsToJSON():
    keysToSkip=['id','networkId','networkName']
    stationsDict={}
    with open(sys.argv[0]+'stations.csv', newline='') as csvfile:
        stations = csv.DictReader(csvfile)
        for station in stations:
            stationId = station['id']
            keys=station.keys()
            for key in keys:
                if key not in keysToSkip:
                    print(key)
                    if stationId not in stationsDict:
                        innerDict={}
                        innerDict[key] = station[key]
                        stationsDict[stationId]=innerDict
                    else:
                        innerDict[key]=station[key]
    with open(dir+'stations.json', 'w') as f:
        json.dump(stationsDict, f)        

stationsToJSON()