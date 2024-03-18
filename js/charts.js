// Function to fetch JSON data from file
let playerDataAll = null;

async function fetchPlayerData() {
    if (!playerDataAll) {
        const response = await fetch('/player.json');
        playerDataAll = await response.json();
    }
    return playerDataAll;
}
 // Function to determine bar color based on level
 function getBarColor(level) {
    switch (level) {
        case 10:
            return 'rgba(227, 35, 17, 0.8)';
        case 9:
            return 'rgba(255, 100, 7, 0.8)';
        case 8:
            return 'rgba(253, 99, 10, 0.8)'; 
        case 7: case 6: case 5: case 4:
            return 'rgba(252, 202, 9, 0.8)';
        case 3: case 2:
            return 'rgba(25, 227, 0, 0.8)';         
        default:
            return 'rgb(239, 239, 238, 0.8)';
    }
}

async function getMaxEloPlayer(){
    const playersData = await fetchPlayerData();
    const playerNames = playersData.map(player => player.Name);
    const eloValues = playersData.map(player => player.Elo);
    maxEloName.innerText = playerNames[0];
    maxElo.innerText = eloValues[0];
}

async function generateList(){
    const data = await fetchPlayerData();
    const usernames = data.map(player => player.Name);
    data.forEach((playerData, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${playerData.Name}: Elo ${playerData.Elo}, Level ${playerData.Level}`;
        if (index === 0) {
          listItem.classList.add("first-item");
        } else if (index === data.length - 1) {
          listItem.classList.add("last-item");
        }
        list.appendChild(listItem);
      });
}

let selectedPreyName; // Global variable to store the selected prey's ID
if(Cookies.get('Prey') != null){
    selectedPreyName = Cookies.get('Prey')
}

async function generatePreyOptions() {
    const selectElement = document.getElementById("prey-select");
    const data = await fetchPlayerData();
    const preyCookie = Cookies.get('Prey');
    let defaultSelected = false;

    data.forEach(player => {
        const option = document.createElement("option");
        option.value = player.Name;
        option.textContent = `${player.Name} (Elo: ${player.Elo})`;
        if (preyCookie && player.Name === preyCookie) {
            option.selected = true;
            defaultSelected = true; // Update the flag if an option is selected
        }
        selectElement.appendChild(option);
    });

    // If no option has been selected and preyCookie is set, select the first option by default
    if (!defaultSelected && preyCookie) {
        selectElement.options[0].selected = true;
    }
}

async function generateHunterAndPreyList(){
    const list = document.getElementById("player-list");
    list.innerHTML = ''; // Clear existing list
    
    const data = await fetchPlayerData();
    const hunters = []; // Array für die Jäger
    let prey; // Variable für den Gejagten

    // Auswahl des Gejagten basierend auf der globalen Variable
    prey = data.find(playerData => playerData.Name === selectedPreyName); 

    // Auswahl der Jäger
    data.forEach(playerData => {
        if (playerData.Name !== selectedPreyName) {
            hunters.push(playerData);
        }
    });

    // Anzeigen der Jäger
    hunters.forEach((hunter, index) => {
        const listItem = document.createElement("li");
        const eloDifference =  prey.Elo -hunter.Elo ; // Berechnung des Unterschieds in den Elo-Punkten
        if(eloDifference > 0){
            listItem.textContent = `${hunter.Name} braucht noch  ${eloDifference} bis er ${prey.Name} gepackt hat`;
            list.appendChild(listItem);
        }
    });
    Cookies.set('Hunter', '1', { expires: 365, sameSite: 'None', secure: true });
    
}


// Beim Laden der Seite die Dropdown-Optionen generieren
generatePreyOptions();

// Funktion, um die ausgewählte Beute-ID zu speichern
document.getElementById("prey-select").addEventListener("change", function() {
    selectedPreyName = this.value;
    Cookies.set('Prey', selectedPreyName, { expires: 365, sameSite: 'None', secure: true });
    console.log(selectedPreyName)
});


async function showAllPlayers() {
    Cookies.set('Only10', '0', { expires: 365, sameSite: 'None', secure: true });
    createChart(await fetchPlayerData());
}

async function showLevel10Players() {
    const allPlayers = await fetchPlayerData();
    const level10Players = allPlayers.filter(player => player.Level === 10);
    Cookies.set('Only10', '1', { expires: 365, sameSite: 'None', secure: true });
    createChart(level10Players);
}


// Function to create chart
async function createChart(playersData) {

    // Extracting player names and Elo values
    const playerNames = playersData.map(player => player.Name);
    const eloValues = playersData.map(player => player.Elo);
    const backgroundColors = playersData.map(player => getBarColor(player.Level));
    // Chart.js code to plot the data
   
    const ctx = document.getElementById('eloChart').getContext('2d');
    if (window.eloChartInstance) {
        window.eloChartInstance.destroy(); // Destroy the existing chart instance
    }
    window.eloChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: playerNames,
            datasets: [{
                label: '',
                data: eloValues,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.2', '1')), // Darker border color
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: eloValues[eloValues.length - 1] - 30,
                    max: eloValues[0],
                    type: 'logarithmic',
                    ticks: {
                        color: "#ffffff",  
                    }
                },
                x: { 
                    ticks: {
                        color: "#ffffff",
                        display: true                        
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    var clickedIndex = elements[0].index;
                    var data = window.eloChartInstance.data.datasets[0].data;
                    data.splice(clickedIndex, 1);
                     // Hide x-axis label for the clicked bar
                     window.eloChartInstance.data.labels.pop([clickedIndex]);
                     window.eloChartInstance.options.scales.y = {
                        min: eloValues[eloValues.length - 1] - 30,
                        max: eloValues[0],
                    };
                    window.eloChartInstance.update();
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });
}



// Call function to create chart
if(Cookies.get('Only10') == '0'){
    showAllPlayers();
}
else if(Cookies.get('Only10') == '1'){
    showLevel10Players();
}
else{
    showAllPlayers();
    Cookies.set('Only10', '0', { expires: 365, sameSite: 'None', secure: true });
}
getMaxEloPlayer();
generateList();

if(Cookies.get('Hunter') == 1 &&  Cookies.get('Prey') != null){
    generateHunterAndPreyList()
}