const crypto = require('crypto');

let reports = [];
let taskToWorkWith = null;
let run = false;
let botSetIntervalId = null;

let createHtmlTableRow = function(taskToPrint, sync) {
	let tableRow = '';
	tableRow += '<tr>';
	tableRow += '<td>' + taskToPrint.id + '</td>';
	tableRow += '<td>' + taskToPrint.type + '</td>';
	tableRow += '<td>' + taskToPrint.data.input + '</td>';
	tableRow += '<td>' + taskToPrint.data.output + '</td>';
	tableRow += '<td>' + sync + '</td>';
	tableRow += '</tr>';
	return tableRow;
};

const actualizeTable = function(taskArray) {
	let table = document.querySelector('#botMode tbody');
	let taskTable = '';
	let sync = '';
	for (let index = 0; index < taskArray.length; index += 1) {
		if (taskArray[index].data.output === null) {
			sync = 'OK';
		} else {
			sync = 'NOT OK';
		}
		taskTable += createHtmlTableRow(taskArray[index], sync);
	}
	table.innerHTML = taskTable;
};

let getBotTasks = function() {
	let task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
	task.open('GET', 'http://localhost:3000/api/Tasks');
	task.responseType = 'json';
	task.setRequestHeader('Token', 'Team_Mystic_FMF');
	task.onload = function() {
		let data = task.response;
		if (data !== null) {
			actualizeTable(data);
		}
	};
	task.send(null);
};

let crypt = function() {
	if (taskToWorkWith.type === 'hash-md5') {
		let hash_md5 = crypto.createHash('md5');
		hash_md5.update(taskToWorkWith.data.input);
		taskToWorkWith.data.output = hash_md5.digest('hex');
	} else if (taskToWorkWith.type === 'hash-sha256') {
		let hash_sha256 = crypto.createHash('sha256');
		hash_sha256.update(taskToWorkWith.data.input);
		taskToWorkWith.data.output = hash_sha256.digest('hex');
	} else if (taskToWorkWith.type === 'crack-md5') {
		console.log('kein Support für crack-md5');
	} else {
		console.log('Typ Falsch');
	}
};

let getReports = function() {
	let reportsAnfrage = new XMLHttpRequest();
    //rep.open('GET', 'http://botnet.artificial.engineering:80/api/Reports');
	reportsAnfrage.open('GET', 'http://localhost:3000/api/Reports', false);
	reportsAnfrage.setRequestHeader('Token', 'Team_Mystic_FMF');
	reportsAnfrage.onload = function() {
		reports = JSON.parse(reportsAnfrage.response);
	};
	reportsAnfrage.send(null);
};

let getTask = function(id) {
	let taskAnfrage = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks/'+id);
	taskAnfrage.open('GET', 'http://localhost:3000/api/Tasks/' + id, false);
	taskAnfrage.setRequestHeader('Token', 'Team_Mystic_FMF');
	taskAnfrage.onload = function() {
		taskToWorkWith = JSON.parse(taskAnfrage.response);
	};
	taskAnfrage.send(null);
};

let sendReport = function(taskId) {
	let sende = new XMLHttpRequest();
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Reports/'+id, true);
	sende.open('POST', 'http://localhost:3000/api/Reports/' + taskId, true);
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
	sende.send(JSON.stringify(daten));
};

let executeTask = function(taskId) {
	getTask(taskId);
	crypt();
	sendReport(taskId);
	getBotTasks();
};

let bot = function() {
	getReports();
	let filteredReports = reports.filter((parameter) => parameter.sync === 'OK');

	if (filteredReports.length !== 0 && filteredReports[0] !== null) {
		executeTask(filteredReports[0].id);

	}
};

let startBot = function() {
	run = true;
	getBotTasks();
	botSetIntervalId = setInterval(bot, 1000);
};

let stopBot = function() {
	run = false;
	clearInterval(botSetIntervalId);
};

let toggleBotMode = function() {

	let botModeButton = document.getElementById('starttoggle');
	if (run) {
		botModeButton.innerHTML = 'Start Botmode';
		stopBot();
	} else {
		botModeButton.innerHTML = 'Stop Botmode';
		startBot();
	}
};

getBotTasks();
setInterval(getBotTasks, 20000);
