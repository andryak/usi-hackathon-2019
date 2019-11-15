import csv
import json
from os import listdir
from os.path import isfile, join
dir = './data/publibike/'

blacklist=['Zugangsmedium Typ','Kunden Gruppe', 'Tarif','Ende - Stunde','Fahrt: Name']

ridesInformation = {}

def collectData():
    for file in listdir(dir):
        with open(dir+file, newline='') as csvfile:
         rides = csv.DictReader(csvfile)
         for ride in rides:
             rideId = ride['Fahrt: Name']
             information=ride.keys()
             for key in information:
                 if key not in blacklist:
                     if rideId not in ridesInformation:
                         innerDict={}
                         innerDict[key]=ride[key]
                         ridesInformation[rideId]=innerDict
                     else:
                        ridesInformation[rideId][key]=ride[key]

def splitEndDate(endDate):
    dateAndTime = endDate.split(' ')
    date = dateAndTime[0]
    time = dateAndTime[1]
    ridesInformation[ride]['endDate'] = date
    ridesInformation[ride]['endTime'] = time

# We remove entries which have less than 6 fields, as they can not have all the information we need
def cleanData(ride):
    if len(ridesInformation[ride].keys())<6:
        ridesInformation[ride]= None
    else
        splitEndDate(ridesInformation[ride]['Ende'])

def stripDates():


collectData()

for ride in ridesInformation.keys():
    cleanData(ride)



with open('result.json', 'w') as f:
    json.dump(ridesInformation, f)

#
#
# # First determine the field names from the top line of each input file
# # Comment 1 below
# fieldnames = []
# for filename in inputs:
#   with open(filename, "r", newline="") as f_in:
#     reader = csv.reader(f_in)
#     headers = next(reader)
#     for h in headers:
#       if h not in fieldnames:
#         fieldnames.append(h)
#
# # Then copy the data
# with open("out.csv", "w", newline="") as f_out:   # Comment 2 below
#   writer = csv.DictWriter(f_out, fieldnames=fieldnames)
#   for filename in inputs:
#     with open(filename, "r", newline="") as f_in:
#       reader = csv.DictReader(f_in)  # Uses the field names in this file
#       for line in reader:
#         # Comment 3 below
#         writer.writerow(line)
