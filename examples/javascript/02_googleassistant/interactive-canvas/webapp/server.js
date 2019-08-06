"use strict";
const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'webapp/public/canvas.html'));
});
app.listen(3001, () => {
    console.info(`Local server started`);
});
