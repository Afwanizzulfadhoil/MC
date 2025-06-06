const express = require('express');
const path = require('path');
const { status, statusBedrock } = require('minecraft-server-util');
const { version } = require('os');
const app = express();
const PORT = 3000;

const publicIP = 'mutusmp-regen.servegame.com';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/status', async (req, res) => {
    let response = {
        server_name: "",
        max_player: 0,
        player_online: 0,
        java: {
            online: false,
            version: ""
        },
        bedrock: {
            online: false,
            version: ""
        },
    };

    try {
        const resultJava = await status(publicIP, 25565, { timeout: 500 });
        response.java.online = true;
        response.java.version = resultJava.version.name.split(" ")[1];
        response.max_player = resultJava.players.max;
        response.player_online = resultJava.player_onlinee;
        response.server_name = resultJava.motd.clean;
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Status checker running at http://localhost:${PORT}`);
});
