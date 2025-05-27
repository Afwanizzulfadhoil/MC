const express = require('express');
const path = require('path'); // perbaiki typo di sini
const { status, statusBedrock } = require('minecraft-server-util');
const app = express();
const PORT = 3000;

// Ganti IP publik kamu di sini
const publicIP = '36.78.116.84'; // ganti ini
// const localIP = '192.168.1.31'; // ganti ini
// Middleware untuk parsing JSON dan mengirim file statis

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

// Listen on all network interfaces so it can be accessed locally and remotely
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Status checker running at http://localhost:${PORT}`);
});
