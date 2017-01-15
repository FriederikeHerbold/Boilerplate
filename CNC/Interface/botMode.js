const crypto = require('crypto');

let reports = [];
let taskToWorkWith = null;
let run = false;

const actualizeTable = function(taskArray) {
    var table = document.querySelector('#botMode tbody');
    var taskTable = '';
    let sync = '';
    for (var index = 0; index < taskArray.length; index += 1) {
        console.log(taskArray[index].id + ' : ' + taskArray[index].data.output);
        console.log(typeof taskArray[index].type);
        if (taskArray[index].data.output === null) {
            sync = 'OK';
        } else {
            sync = 'NOT OK';
        }
        taskTable += '<tr>';
        taskTable += '<td>' + taskArray[index].id + '</td>';
        taskTable += '<td>' + taskArray[index].type + '</td>';
        taskTable += '<td>' + taskArray[index].data.input + '</td>';
        taskTable += '<td>' + taskArray[index].data.output + '</td>';
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
            if (document.querySelector('#botMode tbody').rows.length < data.length) {//Ich bin mir ssicher, dass diese Zeile Probleme verursacht
                actualizeTable(data);
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
    while (run && indexOfActualReport < filteredReports.length) {//Ich vermute hier einen Fehler, der sich beheben lässt mit: while(run){ someFunctionToWait(); ... }
        console.log('vor Execute');
        executeTask(filteredReports[indexOfActualReport].id);
        console.log('nach Execute');
        indexOfActualReport += 1;
    }
    //stopBot();
}

async function executeTask(taskId) {
    console.log('in Execute');
    getTask(taskId);
    crypt();
    sendTask(taskId);
    getBotTasks();
    console.log(taskToWorkWith.data.output);
}

//module.exports = function() {
//  executeTask();
//  console.log("asdas");
//}

function crypt() {
    let erg;
    if (taskToWorkWith.type === "hash-md5") {
        let hash_md5 = crypto.createHash('md5');
        hash_md5.update(taskToWorkWith.data.input);
        taskToWorkWith.data.output = hash_md5.digest('hex');
    } else if (taskToWorkWith.type === "hash-sha256") {
        let hash_sha256 = crypto.createHash('sha256');
        hash_sha256.update(taskToWorkWith.data.input);
        taskToWorkWith.data.output = hash_sha256.digest('hex');
    } else if (taskToWorkWith.type === "crack-md5") {
        console.log('kein Support für crack-md5')
    } else {
        console.log('Typ Falsch');
    }
}

function getReports() {
    let reportsAnfrage = new XMLHttpRequest();
    //rep.open('GET', 'http://botnet.artificial.engineering:80/api/Reports');
    reportsAnfrage.open('GET', 'http://localhost:3000/api/Reports', false);
    //    rep.responseType = 'json';
    reportsAnfrage.setRequestHeader('Token', 'Team_Mystic_FMF');
    reportsAnfrage.onload = function() {
        reports = JSON.parse(rep.response);
    };
    reportsAnfrage.send(null);
}

function getTask(id) {
    let taskAnfrage = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks/'+id);
    taskAnfrage.open('GET', 'http://localhost:3000/api/Tasks/' + id, false);
    //  task.responseType = 'json';
    taskAnfrage.setRequestHeader('Token', 'Team_Mystic_FMF');
    taskAnfrage.onload = function() {
        taskToWorkWith = JSON.parse(task.response);
        console.log('in req: ' + taskToWorkWith.data.input);
    };
    taskAnfrage.send(null);
}

function sendTask(taskId) {
    let sende = new XMLHttpRequest();
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks/'+id, true);
    sende.open('POST', 'http://localhost:3000/api/Tasks/' + taskId, true);
    sende.responseType = 'json';
    sende.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    sende.setRequestHeader('Token', 'Team_Mystic_FMF');
    let daten = {
        data: {
            input: taskToWorkWith.data.input,
            output: taskToWorkWith.data.output
        },
        id: taskId,
        type: taskToWorkWith.type
    };
    console.log('in POST ' + JSON.stringify(daten));
    sende.send(JSON.stringify(daten));
}
