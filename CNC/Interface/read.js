const fs = require("fs");

fs.readFile('Datei.txt', function(err, data) {
    if (err) throw console.error(err);
    console.log(data.toString());
});
