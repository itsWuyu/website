import requests 
from bs4 import BeautifulSoup
import json
import time


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
    r = requests.get("https://faceitanalyser.com/stats/" + name + "/cs2")
    elo = int((BeautifulSoup(r.content, "html.parser").find(class_="stats_profile_elo_span").get_text()).replace(" ELO", ''))
    return elo


Username = {"itsWuyu", "_Rubyi", "-ProToX", "_DyeknoM", 's1mpMeister', 'rabemd', 'MRxRED', 'Deu7', 'DannyDE', 'MadMat', 'ToggleToni', 'TstsLikeMeat',  'sefer1999', 'rayz', 'ron1N', 'rakoN', '-TobseN-', 'xRoxxon'}
#Username = {"itsWuyu", "_Rubyi"}
player = {}
for user in Username:
    elo = grabscher(user)
    player[user] = [{"Elo": elo , "Level":levelChecker(elo)}]
    time.sleep(1)

player = dict(sorted(player.items(), key=lambda item: item[1][0]["Elo"], reverse=True))

with open('player.json', 'w') as fp:
    # Dump the sorted dictionary to the file
    json.dump(player, fp)
