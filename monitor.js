const express = require('express');
const path = require('path');
const { status, statusBedrock } = require('minecraft-server-util');
const { version } = require('os');
const app = express();
const PORT = 3000;

const publicIP = '36.78.116.84';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Max Player
app.get('/status', async (req, res) => {
    let response = {
        java: {
            online: false,
            players: 0,
            version: ""
        },
        bedrock: {
            online: false,
            players: 0,
            version: ""
        },
        max_player: 0
    };

    try {
        const resultJava = await status(publicIP, 25565, { timeout: 500 });
        response.java.online = true;
        response.java.players = resultJava.players.online;
        response.java.version = resultJava.version.name.split(" ")[1];
        response.max_player = resultJava.players.max;
    } catch (err) {
        console.error('Java status error:', err.message);
    }

    try {
        const resultBedrock = await statusBedrock(publicIP, 19132, { timeout: 500 });
        response.bedrock.online = true;
        response.bedrock.version = resultBedrock.version.name;
    } catch (err) {
        console.error('Bedrock status error:', err.message);
    }

    res.json(response);
});

//
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Status checker running at http://localhost:${PORT}`);
});
