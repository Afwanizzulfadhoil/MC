const express = require('express');
const path = require('path');
const { status, statusBedrock } = require('minecraft-server-util');
const app = express();
const PORT = 3000;

const publicIP = '36.78.116.84';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status/java', async (req, res) => {
    try {
        const result = await status(publicIP, 25565, { timeout: 500 });
        res.json({ online: true, players: result.players.online });
    } catch (error) {
        res.json({ online: false });
    }
});

app.get('/status/bedrock', async (req, res) => {
    try {
        const result = await statusBedrock(publicIP, 19132, { timeout: 500 });
        res.json({ online: true, players: result.players.online });
    } catch (error) {
        res.json({ online: false });
    }
});


// Testing
app.get('/status', async (req, res) => {
    let status = {};

    try {
        const result = await status(publicIP, 25565, { timeout: 500 });
        res.json(result);
    } catch (error) {
        res.json({ online: false });
    }
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Status checker running at http://localhost:${PORT}`);
});
