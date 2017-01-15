const express = require('express');
const app = express();
const fs = require("fs");
var text = 'huhu';

fs.readFile('Datei.txt', function(err, data) {
    if (err) throw err;
    text = data.toString();
});
app.get('/', function(req, res) {
    res.send(text);
});

app.listen(3000, function() {
    console.log('Example Hello_World listening on port 3000!');
});
