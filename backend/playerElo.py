import json
import requests

def get_json_from_url():
    try:
        response = requests.get('https://roemmling.it/player.json')
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to retrieve JSON data from {'https://roemmling.it/player.json'}. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None



def extract_player_info(json_data, player_name):
    try:
        player_info = json_data.get(player_name)
        if player_info:
            return player_info[0]['Elo']
        else:
            return f"Player '{player_name}' not found."
    except Exception as e:
        return f"An error occurred: {e}"

# Convert the JSON string to a Python dictionary
def getPlayerData(spieler, daten):    
    player_info = extract_player_info(daten, spieler)
    pfad = str('player/'+ spieler +'.txt')
    with open(pfad, 'w') as f:
        f.write(str(player_info))

data = get_json_from_url()


getPlayerData("_DyeknoM", data)
getPlayerData('itsWuyu', data)
