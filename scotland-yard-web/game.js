document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");

    if (gameId) {
        await fetchGameDetails(gameId);
        setupRealTimeLocationUpdates(gameId);
    } else {
        document.getElementById("game-title").textContent = "Game not found.";
    }
});

async function fetchGameDetails(gameId) {
    try {
        const response = await fetch(`http://www.trinity-developments.co.uk/games/${gameId}`);
        const game = await response.json();
        console.log("✅ Game Data:", game); // Debugging log

        document.getElementById("game-title").textContent = game.gameName;
        document.getElementById("map-name").textContent = `Map: ${game.mapName}`;

        // ✅ Use the correct map URL
        document.getElementById("map-image").src = `http://www.trinity-developments.co.uk/images/Map_1.png`;

        updatePlayerLocations(game.players);
    } catch (error) {
        console.error("❌ Error fetching game details:", error);
    }
}

function updatePlayerLocations(players) {
    const playersList = document.getElementById("players-list");
    playersList.innerHTML = "";
    
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = `<img id="map-image" src="http://www.trinity-developments.co.uk/images/Map_1.png" alt="Map" style="width: 100%; height: 100%; position: relative;" />`;

    players.forEach(player => {
        // Add player marker to map
        const playerMarker = document.createElement("div");
        playerMarker.classList.add("player-marker");
        playerMarker.style.position = "absolute";
        playerMarker.style.left = `${player.xPos}px`;
        playerMarker.style.top = `${player.yPos}px`;
        playerMarker.style.width = "10px";
        playerMarker.style.height = "10px";
        playerMarker.style.backgroundColor = "red";
        playerMarker.style.borderRadius = "50%";
        playerMarker.style.transform = "translate(-50%, -50%)";
        playerMarker.title = player.playerName;
        mapContainer.appendChild(playerMarker);

        // Add player location text
        const listItem = document.createElement("li");
        listItem.textContent = `${player.playerName} - Location: ${player.currentLocation}`;
        playersList.appendChild(listItem);
    });
}

async function fetchPlayerLocations(gameId) {
    try {
        const response = await fetch(`http://www.trinity-developments.co.uk/games/${gameId}/locations`);
        const locations = await response.json();
        updatePlayerLocations(locations);
    } catch (error) {
        console.error("❌ Error fetching player locations:", error);
    }
}

function setupRealTimeLocationUpdates(gameId) {
    setInterval(() => fetchPlayerLocations(gameId), 5000);
}

function goBack() {
    window.location.href = "index.html";
}