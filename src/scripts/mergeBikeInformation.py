import csv
import json
import datetime
from os import listdir
from os.path import isfile, join
dir = '../../data/publibike/'

blacklist=['Zugangsmedium Typ','Kunden Gruppe', 'Tarif','Ende - Stunde','Fahrt: Name']

durationStringToMinutes = {
    'bis 5 min':3,
    '5 bis 10 min': 7,
    '10 bis 30 min':20,
    '30 bis 60 min': 45,
    '60 bis 120 min':90,
    'mehr als 120 min':120,
}

weekDays = {
    '1 Montag': 'monday',
    '2 Dienstag': 'tuesday',
    '3 Mittwoch': 'wednesday',
    '4 Donnerstag': 'thursday',
    '5 Freitag': 'friday',
    '6 Samstag': 'saturday',
    '7 Sonntag':'sunday',
}

bikeTypes = {
    'Velo': 'bicycle',
    'E-Bike': 'e-bike',
}

ridesInformation = {}

def collectData():
    for file in listdir(dir):
        with open(dir+file, newline='') as csvfile:
         rides = csv.DictReader(csvfile)
         for ride in rides:
             rideId = ride['Fahrt: Name']
             columns=ride.keys()
             for column in columns:
                 if column not in blacklist:
                     if rideId not in ridesInformation:
                         innerDict={}
                     else:
                        innerDict = ridesInformation[rideId]
                     innerDict[column]=ride[column]
                     ridesInformation[rideId]=innerDict

# We remove entries which have less than 6 fields, as they can not have all the information we need
def cleanData(ride):
    if len(ridesInformation[ride].keys())<6:
        del ridesInformation[ride]

def cleanKey(ride, key):
    del ridesInformation[ride][key]

def subTime(time, difference):
    format = '%d.%m.%Y %H:%M'
    newTime = datetime.datetime.strptime(time, format) - datetime.timedelta(minutes=difference)
    return newTime.strftime(format)

def extractStartAndEndDate(ride):
    endDate = ridesInformation[ride]['Ende']
    rideDurationString = ridesInformation[ride]['Ausleihdauer']
    rideDurationinMinutes = durationStringToMinutes[rideDurationString]
    startDate = subTime(endDate, rideDurationinMinutes)
    startDayAndTime = startDate.split(' ')
    startDay = startDayAndTime[0]
    startTime = startDayAndTime[1]
    ridesInformation[ride]['startDate'] = startDay
    ridesInformation[ride]['startTime'] = startTime
    endDayAndTime = endDate.split(' ')
    endDay = endDayAndTime[0]
    endTime = endDayAndTime[1]
    ridesInformation[ride]['endDate'] = endDay
    ridesInformation[ride]['endTime'] = endTime
    # clean up useless keys
    del ridesInformation[ride]['Ende']
    del ridesInformation[ride]['Ausleihdauer']


def extractStartAndEndStation(ride):
    startStation = ridesInformation[ride]['Station - VON']
    endStation = ridesInformation[ride]['Station - BIS']
    ridesInformation[ride]['startStation'] = startStation
    ridesInformation[ride]['endStation'] = endStation
    del ridesInformation[ride]['Station - VON']
    del ridesInformation[ride]['Station - BIS']

def extractWeekDay(ride):
    weekDay = ridesInformation[ride]['Ende Wochentag']
    ridesInformation[ride]['weekDay'] = weekDays[weekDay]
    del ridesInformation[ride]['Ende Wochentag']

def extractBikeType(ride):
    bikeType = ridesInformation[ride]['Typ']
    ridesInformation[ride]['bikeType'] = bikeTypes[bikeType]
    del ridesInformation[ride]['Typ']

collectData()
for ride in ridesInformation.copy().keys():
    cleanData(ride)
    if ride in ridesInformation:
        extractStartAndEndDate(ride)
        extractStartAndEndStation(ride)
        extractWeekDay(ride)
        extractBikeType(ride)

with open('rides.json', 'w') as f:
    json.dump(ridesInformation, f)
