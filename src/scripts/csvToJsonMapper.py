import csv
import json
import datetime
import sys

from os import listdir
from stationToJson import constructStationsDict, mapStationNameToId

dir = sys.argv[1]

blacklist = ['Zugangsmedium Typ', 'Kunden Gruppe',
             'Tarif', 'Ende - Stunde', 'Fahrt: Name']

durationStringToMinutes = {
    'bis 5 min': 3,
    '5 bis 10 min': 7,
    '10 bis 30 min': 20,
    '30 bis 60 min': 45,
    '60 bis 120 min': 90,
    'mehr als 120 min': 120,
}

weekDays = {
    '1 Montag': 'monday',
    '2 Dienstag': 'tuesday',
    '3 Mittwoch': 'wednesday',
    '4 Donnerstag': 'thursday',
    '5 Freitag': 'friday',
    '6 Samstag': 'saturday',
    '7 Sonntag': 'sunday',
}

bikeTypes = {
    'Velo': 'bicycle',
    'E-Bike': 'e-bike',
}

ridesInformation = {}

nameToId = mapStationNameToId(dir)


def collect_data():
    ridesDir = dir + '/rides/'
    for file in listdir(ridesDir):
        if file.endswith('.csv'):
            with open(ridesDir + file, newline='') as csvfile:
                rides = csv.DictReader(csvfile)
                for ride in rides:
                    rideId = ride['Fahrt: Name']
                    columns = ride.keys()
                    for column in columns:
                        if column not in blacklist:
                            if rideId not in ridesInformation:
                                innerDict = {}
                            else:
                                innerDict = ridesInformation[rideId]
                            innerDict[column] = ride[column]
                            ridesInformation[rideId] = innerDict


# We remove entries which have less than 6 fields, as they can not have all the information we need
def clean_data(ride):
    if len(ridesInformation[ride].keys()) < 6:
        del ridesInformation[ride]


def clean_key(ride, key):
    del ridesInformation[ride][key]


def sub_time(time, difference):
    format = '%d.%m.%Y %H:%M'
    newTime = datetime.datetime.strptime(
        time, format) - datetime.timedelta(minutes=difference)
    return newTime.strftime(format)


def get_time_range(time):
    hoursAndMins = time.split(':')
    hours = hoursAndMins[0]
    return hours


def extract_start_and_end_date(ride):
    endDate = ridesInformation[ride]['Ende']
    rideDurationString = ridesInformation[ride]['Ausleihdauer']
    rideDurationinMinutes = durationStringToMinutes[rideDurationString]
    startDate = sub_time(endDate, rideDurationinMinutes)
    startDayAndTime = startDate.split(' ')
    startDay = startDayAndTime[0]
    startTime = startDayAndTime[1]
    ridesInformation[ride]['startDate'] = startDay
    ridesInformation[ride]['startTime'] = get_time_range(startTime)
    endDayAndTime = endDate.split(' ')
    endDay = endDayAndTime[0]
    endTime = endDayAndTime[1]
    ridesInformation[ride]['endDate'] = endDay
    ridesInformation[ride]['endTime'] = get_time_range(endTime)
    # clean up useless keys
    del ridesInformation[ride]['Ende']
    del ridesInformation[ride]['Ausleihdauer']


def extract_start_and_end_station(ride):
    startStation = ridesInformation[ride]['Station - VON']
    endStation = ridesInformation[ride]['Station - BIS']
    ridesInformation[ride]['startStation'] = startStation
    ridesInformation[ride]['endStation'] = endStation
    del ridesInformation[ride]['Station - VON']
    del ridesInformation[ride]['Station - BIS']


def extract_week_day(ride):
    weekDay = ridesInformation[ride]['Ende Wochentag']
    ridesInformation[ride]['weekDay'] = weekDays[weekDay]
    del ridesInformation[ride]['Ende Wochentag']


def extractBikeType(ride):
    bikeType = ridesInformation[ride]['Typ']
    ridesInformation[ride]['bikeType'] = bikeTypes[bikeType]
    del ridesInformation[ride]['Typ']


def createHeatMap(dir):
    constructStationsDict(dir)


def collectRidesByStation(startOrEnd):
    stationDict = {}
    for rideId in ridesInformation.keys():
        ride = ridesInformation[rideId]
        if ride[startOrEnd + 'Station'] in nameToId:
            stationId = nameToId[ride[startOrEnd + 'Station']]
            if stationId not in stationDict:
                weekDayDict = {}
            else:
                weekDayDict = stationDict[stationId]
                collectRidesByWeekDay(startOrEnd, ride, weekDayDict)
            stationDict[stationId] = weekDayDict
    return stationDict


def collectRidesByWeekDay(startOrEnd, ride, dayDict):
    if ride['weekDay'] not in dayDict:
        hourDict = {}
    else:
        hourDict = dayDict[ride['weekDay']]
    countRidesByHours(startOrEnd, ride, hourDict)
    dayDict[ride['weekDay']] = hourDict


def countRidesByHours(startOrEnd, ride, hourDict):
    if ride[startOrEnd + 'Time'] not in hourDict:
        hourDict[ride[startOrEnd + 'Time']] = 1
    else:
        hourDict[ride[startOrEnd + 'Time']] += 1


def getHourDict(rideId, dateDict):
    ride = ridesInformation[rideId]
    startDate = ride['startDate']
    if startDate not in dateDict:
        hourDict = {}
    else:
        hourDict = dateDict[startDate]
    hourDict[ride['startTime']] = rideId
    return hourDict


def getRidesDataToStationsValue():
    startDict = divide_numbers_occurences(collectRidesByStation('start'))
    endDict = divide_numbers_occurences(collectRidesByStation('end'))
    stationsDict = constructStationsDict(dir)
    for stationId in stationsDict:
        station = stationsDict[stationId]
        station['loan'] = startDict[stationId]
        station['returns'] = endDict[stationId]

    return stationsDict


def divide_numbers_occurences(weekDayDictionary):
    for weekDay in weekDayDictionary:
        hoursDict = weekDayDictionary[weekDay]
        for hour in hoursDict:
            counters = hoursDict[hour]
            for counter in counters:
                counters[counter] = round(counters[counter] / 13,2)
    return weekDayDictionary

collect_data()
for ride in ridesInformation.copy().keys():
    clean_data(ride)
    if ride in ridesInformation:
        extract_start_and_end_date(ride)
        extract_start_and_end_station(ride)
        extract_week_day(ride)
        extractBikeType(ride)

with open(dir + '/rides.json', 'w') as f:
    json.dump(getRidesDataToStationsValue(), f)
