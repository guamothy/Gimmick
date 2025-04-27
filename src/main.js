import axios from 'axios';
import express from 'express';
import fs from 'node:fs';

import paths from './paths.js';

let script = await axios.get(`https://raw.githubusercontent.com/guamothy/-shrug-/refs/heads/main/bundle.js`);
fs.writeFileSync(import.meta.dirname + '/bundle.txt', script.data);

const app = express();

app.use(express.json());
app.disable('etag');

app.all(`/*`, async (req, res) => {
    let path = req.url.split('?')[0];

    let file = paths.find((pathData) => typeof pathData.match === 'string' ? path === pathData.match : pathData.match.test(path));
    if (!file) return console.log(`Unknown file for path "${path}"`);

    console.log(`forwarding ${path} to "${file.name}"`);

    file.handler(req, res, path);
});

app.listen(6060, () => console.log(`gimmick @ http://localhost:6060`));
