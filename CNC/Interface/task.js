let createHtmlTaskTableRow = function(taskToPrint) {
	let tableRow = '';
	tableRow += '<tr>';
	tableRow += '<td>' + taskToPrint.id + '</td>';
	tableRow += '<td>' + taskToPrint.type + '</td>';
	tableRow += '<td>' + taskToPrint.data.input + '</td>';
	tableRow += '<td>' + taskToPrint.data.output + '</td>';
	tableRow += '</tr>';
	return tableRow;
};

let updateTaskTable = function(taskArray) {
	let table = document.querySelector('#tasks tbody');
	let taskTable = '';
	for (let index = 0; index < taskArray.length; index += 1) {
		taskTable += createHtmlTaskTableRow(taskArray[index]);
	}
	table.innerHTML = taskTable;
};

let getTasks = function() {
	let task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
	task.open('GET', 'http://localhost:3000/api/Tasks');
	task.responseType = 'json';
	task.setRequestHeader('Token', 'Team_Mystic_FMF');
	task.onload = function() {
		let newTaskArray = task.response;
		if (newTaskArray !== null) {
			updateTaskTable(newTaskArray);
		}
	};
	task.send(null);
};

getTasks();
setInterval(getTasks, 20000);

let doSend = function() {
	let sende = new XMLHttpRequest();
	let daten = {
		data: { input: inputText.value },
		type: select.value
	};
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks', true);
	sende.open('POST', 'http://localhost:3000/api/Tasks', true);
	sende.responseType = 'json';
	sende.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
	sende.setRequestHeader('Token', 'Team_Mystic_FMF');
	sende.send(JSON.stringify(daten));
	setTimeout(getTasks, 1000);
};
