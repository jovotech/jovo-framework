"use strict";
const express = require("express");
const path = require("path");
const cors = require('cors');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(cors())
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'webapp/public/canvas.html'));
});
app.listen(3001, () => {
    console.info(`Local server started`);
});
