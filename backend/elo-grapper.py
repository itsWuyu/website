import requests 
from bs4 import BeautifulSoup
import json
import time
import os
from datetime import datetime, timedelta


def levelChecker(elo):
    if(elo < 500):
        return 1
    elif (elo >= 500 and elo <= 750):
        return 2
    elif (elo >= 751 and elo <= 900):
        return 3
    elif (elo >= 901 and elo <= 1050):
        return 4
    elif (elo >= 1051 and elo <= 1200):
        return 5
    elif (elo >= 1201 and elo <= 1350):
        return 6
    elif (elo >= 1351 and elo <= 1530):
        return 7
    elif (elo >= 1531 and elo <= 1750):
        return 8
    elif (elo >= 1751 and elo <= 2000):
        return 9
    elif (elo >= 2001):
        return 10
        

def grabscher(name):
    try:
        API_KEY = os.environ["API_KEY"]
    except KeyError:
        API_KEY = "API Key nicht erreichbar"
    r = requests.get("https://faceitanalyser.com/api/names/" + name + "?key=" + API_KEY)
    data = r.json()
    if data is not None:
        last_occurrence_str = data["segments"][0]["last_occurrence"]
        last_occurrence_date = datetime.strptime(last_occurrence_str, "%Y-%m-%d")
        days_difference = (datetime.now() - last_occurrence_date).days
        if days_difference <= 30:
            elo = int(data['segments'][0]['current_elo'])
        else:
            elo = -1
    else:
        elo = -1
    
    print(str(name) + ' : ' + str(elo))
    return elo


Username = {"itsWuyu", "_Rubyi", "-ProToX", "_DyeknoM", 's1mpMeister', 'rabemd', 'MRxRED', 'Deu7', 'DannyDE', 'MadMat', 'ToggleToni', 'TstsLikeMeat',  'sefer1999', 'rayz', 'ron1N', 'rakoN', '-TobseN-', 'xRoxxon', 'pr0mise'}
#Username = {"itsWuyu", "_Rubyi"}
try:
    player = {}
    for user in Username:
        elo = grabscher(user)
        if elo != -1:
            player[user] = [{"Elo": elo , "Level":levelChecker(elo)}]
   
    if player:
        player = dict(sorted(player.items(), key=lambda item: item[1][0]["Elo"], reverse=True))
        with open('player.json', 'w') as fp:
            # Dump the sorted dictionary to the file
            json.dump(player, fp)
except Exception as e:
    print(e)