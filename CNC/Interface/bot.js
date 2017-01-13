const express = require('express');
const app = express();
const crypto = require('crypto');

let hash_md5 = crypto.createHash('md5');
let hash_sha256 = crypto.createHash('sha256');

var data;
var id;

function tu() {
    id = 2;
    get();
    crypt();
    dosend();
    console.log(data);
}
module.exports = function() {
    tu();
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

function get() {
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

function doSend() {
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
