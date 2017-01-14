const crypto = require('crypto');

let reports = [];
let taskData = null;
let run = false;

const bot_data = function(data) {
    var table = document.querySelector('#botMode tbody');
    var taskArr = data;
    var taskTable = '';
    let sync = '';
    for (var index = 0; index < data.length; index += 1) {
        console.log(taskArr[index].id + ' : ' + taskArr[index].data.output);
        console.log(typeof taskArr[index].type);
        if (taskArr[index].data.output === null) {
            sync = 'OK';
        } else {
            sync = 'NOT OK';
        }
        taskTable += '<tr>';
        taskTable += '<td>' + taskArr[index].id + '</td>';
        taskTable += '<td>' + taskArr[index].type + '</td>';
        taskTable += '<td>' + taskArr[index].data.input + '</td>';
        taskTable += '<td>' + taskArr[index].data.output + '</td>';
        taskTable += '<td>' + sync + '</td>';
        taskTable += '</tr>';
    }
    table.innerHTML = taskTable;
}

function getBotTasks() {
    let task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
    task.open('GET', 'http://localhost:3000/api/Tasks');
    task.responseType = 'json';
    task.setRequestHeader('Token', 'Team_Mystic_FMF');
    task.onload = function() {
        data = task.response;
        if (data !== null) {
            //  console.log(data);
            if (document.querySelector('#botMode tbody').rows.length < data.length) {
                bot_data(data);
            }
        }
    };
    task.send(null);
}

var toggleBotMode = function() {

    let botModeButton = document.getElementById('starttoggle');
    console.log('Run:' + run);
    if (!run) {
        botModeButton.innerHTML = 'Stop Botmode';
        startBot();
    } else {
        botModeButton.innerHTML = 'Start Botmode';
        stopBot();
    }
};

function startBot() {
    run = true;
    getBotTasks();
    bot();
}

function stopBot() {
    run = false;
}

function bot() {
    getReports();
    let filteredReports = reports.filter(function(parameter) {
        return parameter.sync === 'OK';
    });
    let indexOfActualReport = 0;
    console.log('Rep: ' + filteredReports.length);
    while (run && indexOfActualReport < filteredReports.length) {
        console.log('vor Execute');
        executeTask(filteredReports[indexOfActualReport].id);
        console.log('nach Execute');
        indexOfActualReport += 1;
    }
    //stopBot();
}

async function executeTask(id) {
    console.log('in Execute');
    getTask(id);
    crypt();
    sendTask(id);
    getBotTasks();
    console.log(taskData.data.output);
}

//module.exports = function() {
//  executeTask();
//  console.log("asdas");
//}

function crypt() {
    let erg;
    if (taskData.type === "hash-md5") {
        let hash_md5 = crypto.createHash('md5');
        hash_md5.update(taskData.data.input);
        taskData.data.output = hash_md5.digest('hex');
    } else if (taskData.type === "hash-sha256") {
        let hash_sha256 = crypto.createHash('sha256');
        hash_sha256.update(taskData.data.input);
        taskData.data.output = hash_sha256.digest('hex');
    } else if (taskData.type === "crack-md5") {
        console.log('kein Support für crack-md5')
    } else {
        console.log('Typ Falsch');
    }
}

function getReports() {
    let rep = new XMLHttpRequest();
    //rep.open('GET', 'http://botnet.artificial.engineering:80/api/Reports');
    rep.open('GET', 'http://localhost:3000/api/Reports', false);
    //    rep.responseType = 'json';
    rep.setRequestHeader('Token', 'Team_Mystic_FMF');
    rep.onload = function() {
        reports = JSON.parse(rep.response);
    };
    rep.send(null);
}

function getTask(id) {
    let task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks/'+id);
    task.open('GET', 'http://localhost:3000/api/Tasks/' + id, false);
    //  task.responseType = 'json';
    task.setRequestHeader('Token', 'Team_Mystic_FMF');
    task.onload = function() {
        taskData = JSON.parse(task.response);
        console.log('in req: ' + taskData.data.input);
    };
    task.send(null);
}

function sendTask(id) {
    let sende = new XMLHttpRequest();
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks/'+id, true);
    sende.open('POST', 'http://localhost:3000/api/Tasks/' + id, true);
    sende.responseType = 'json';
    sende.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    sende.setRequestHeader('Token', 'Team_Mystic_FMF');
    let daten = {
        data: {
            input: taskData.data.input,
            output: taskData.data.output
        },
        id: id,
        type: taskData.type
    };
    console.log('in POST ' + JSON.stringify(daten));
    sende.send(JSON.stringify(daten));
}
