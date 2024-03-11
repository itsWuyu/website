// Function to fetch JSON data from file
async function fetchPlayerData() {
    const response = await fetch('https://roemmling.it/player.json');
    const data = await response.json();
    return data;
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
    const playerNames = Object.keys(playersData);
    const eloValues = playerNames.map(player => playersData[player][0].Elo);
    maxEloName.innerText = playerNames[0];
    maxElo.innerText = eloValues[0];
}

async function generateList(){
    const data = await fetchPlayerData();
    const usernames = Object.keys(data);
    usernames.forEach((username, index) => {
      const playerData = data[username][0]; // Assuming there's only one object per username
      const listItem = document.createElement("li");
      listItem.textContent = `${username}: Elo ${playerData.Elo}, Level ${playerData.Level}`;
      if (index === 0) {
        listItem.classList.add("first-item");
      } else if (index === usernames.length - 1) {
        listItem.classList.add("last-item");
      }
      list.appendChild(listItem);
    });
}


// Function to create chart
async function createChart() {
    const playersData = await fetchPlayerData();

    // Extracting player names and Elo values
    const playerNames = Object.keys(playersData);
    const eloValues = playerNames.map(player => playersData[player][0].Elo);
    const backgroundColors = playerNames.map(level => getBarColor(playersData[level][0].Level));
    // Chart.js code to plot the data
   
    const ctx = document.getElementById('eloChart').getContext('2d');
    const eloChart = new Chart(ctx, {
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
                    }
                }
            }
        }
    });
}



// Call function to create chart
createChart();
getMaxEloPlayer();
generateList()