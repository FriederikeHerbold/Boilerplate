const express = require('express');
const app = express();
const crypto = require('crypto');

let hash_md5 = crypto.createHash('md5');
let hash_sha256 = crypto.createHash('sha256');

var reports;
var data;
let run = false;

function startBot() {
    run = true;
    bot();
}

function stopBot() {
    run = false;
}

function bot() {
    getReports();
    let filteredReports = reports.filter(function(parameter) {
        return (parameter.sync === 'OK')
    });
    let indexOfActualReport = 0;
    while (run && indexOfActualReport < filteredReports) {
        executeTask(filteredReports[indexOfActualReport].id);
        indexOfActualReport += 1;
    }
    stopBot();
}

function executeTask(taskId) {
    get(taskId);
    crypt();
    dosend(TaskId);
    console.log(data);
}
module.exports = function() {
    executeTask();
    console.log("asdas");
}

function crypt() {
    let erg;
    if (data.type === "hash-md5") {
        hash_md5.update(data.input);
        data.output = hash_md5.digest('hex');
    } else if (data.type === "hash-sha256") {
        hash_sha256.update(data.input);
        data.output = hash_sha256.digest('hex');
    } else if (data.type === "crack-md5") {
        data.output = null;
    } else {
        console.log('Typ Falsch');
    }
}

function getReports() {
    var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Reports');
    task.open('GET', 'http://localhost:3000/api/Reports');
    task.responseType = 'json';
    task.setRequestHeader('Token', 'meins-1337');
    task.onload = function() {
        reports = task.response;
    };
    task.send(null);
}

function getTask(id) {
    var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks/'+id);
    task.open('GET', 'http://localhost:3000/api/Tasks/' + id);
    task.responseType = 'json';
    task.setRequestHeader('Token', 'meins-1337');
    task.onload = function() {
        data = task.response;
    };
    task.send(null);
}

function sendTask(id) {
    var sende = new XMLHttpRequest();
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks/'+id, true);
    sende.open('POST', 'http://localhost:3000/api/Tasks/' + id, true);
    sende.responseType = 'json';
    sende.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    sende.setRequestHeader('Token', 'Bot-Token-1337');
    sende.onload = function() {

    };
    sende.send(JSON.stringify(data));
}

}
