const fs = require("fs");
const endl = '\n';

fs.writeFile('Datei.txt', 'huhu' + endl + 'huhu' + endl + 'huhu', function(err) {
    if (err) throw error;
});
