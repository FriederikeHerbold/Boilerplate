const app = Express();
const crypto = require('crypto');

app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());

let reports;

function getReport() {
    var rep = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Reports');
    rep.open('GET', 'http://localhost:3000/api/Reports');
    rep.responseType = 'json';
    rep.setRequestHeader('Token', 'Team_Mystic_FMF');
    rep.onload = function() {
        var data = rep.response;
        if (data !== null) {
            console.log(data);
            let task = getTask(id);
            postAwnser(task, crypte(task));
        }
    };
    rep.send(null);
}

function getTasks(id) {
    var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Reports/' + id);
    task.open('GET', 'http://localhost:3000/api/Reports/' + id);
    task.responseType = 'json';
    task.setRequestHeader('Token', 'Team_Mystic_FMF');
    task.onload = function() {
        var daten = task.response;
        if (data !== null) {
            console.log(daten);
        }
    };
    task.send(null);
    return daten;
}

function paostAwnser(data, output) {
    var sende = new XMLHttpRequest();
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks', true);
    sende.open('POST', 'http://localhost:3000/api/Tasks', true);
    sende.responseType = 'json';
    sende.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    sende.setRequestHeader('Token', 'Team_Mystic_FMF');
    let awnser = {
        id: data.body.id,
        type: data.body.type,
        data: {
            input: data.body.input,
            output: output
        }
    }
    sende.send(JSON.stringify(awnser));
}

var crypte = function(task) {
    let output = null;
    if (task.body.type === 'hash-md5') {
        let hash_md5 = crypto.createHash('md5');
        output hash_md5.update(task.body.input);
    } else if (task.body.type 'hash-sha256') {
        let hash_sha256 = crypto.createHash('sha256');
        output hash_sha256.update(task.body.input);
    }
    return output;
}
