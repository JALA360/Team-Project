document.addEventListener("DOMContentLoaded", async () => {
    await fetchGames();
});

async function fetchGames() {
    try {
        const response = await fetch('http://www.trinity-developments.co.uk/games');
        const data = await response.json();
        console.log("✅ Games Data:", data); // Debugging log

        if (Array.isArray(data)) {
            renderGames(data);
        } else if (data.games && Array.isArray(data.games)) {
            renderGames(data.games);
        } else {
            console.error("❌ Expected an array of games, but received:", data);
        }
    } catch (error) {
        console.error("❌ Error fetching games data:", error);
    }
}

function renderGames(games) {
    const gamesTableBody = document.getElementById("games-table").getElementsByTagName("tbody")[0];
    gamesTableBody.innerHTML = '';

    games.forEach(game => {
        const row = document.createElement("tr");

        const gameNameCell = document.createElement("td");
        gameNameCell.textContent = game.gameName;
        row.appendChild(gameNameCell);

        const mapCell = document.createElement("td");
        mapCell.textContent = game.mapName;
        row.appendChild(mapCell);

        const playersCell = document.createElement("td");
        playersCell.textContent = game.players.map(player => player.playerName).join(", ");
        row.appendChild(playersCell);

        const actionCell = document.createElement("td");
        const joinButton = document.createElement("button");
        joinButton.textContent = "Join";
        joinButton.onclick = () => joinGame(game.gameId);
        actionCell.appendChild(joinButton);
        row.appendChild(actionCell);

        gamesTableBody.appendChild(row);
    });
}

function joinGame(gameId) {
    window.location.href = `game.html?gameId=${gameId}`;
}