function createHtmlTableRow(taskToPrint) {
	let tableRow = '';
	tableRow += '<tr>';
	tableRow += '<td>' + taskToPrint.id + '</td>';
	tableRow += '<td>' + taskToPrint.type + '</td>';
	tableRow += '<td>' + taskToPrint.data.input + '</td>';
	tableRow += '<td>' + taskToPrint.data.output +'huhu'+ '</td>';
	tableRow += '</tr>';
	return tableRow;
}

var updateTaskTable = function(taskArray) {
	var table = document.querySelector('#tasks tbody');
	var taskTable = '';
	for (var index = 0; index < taskArray.length; index += 1) {
		taskTable += createHtmlTableRow(taskArray[index]);
	}
	table.innerHTML = taskTable;
};

function getTasks() {
	var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
	task.open('GET', 'http://localhost:3000/api/Tasks');
	task.responseType = 'json';
	task.setRequestHeader('Token', 'Team_Mystic_FMF');
	task.onload = function() {
		var newTaskArray = task.response;
		if (newTaskArray !== null) {
			updateTaskTable(newTaskArray);
		}
	};
	task.send(null);
}

getTasks();
setInterval(getTasks, 20000);

function doSend() {
	var sende = new XMLHttpRequest();
	let daten = {
		data: {input: inputText.value},
		type: select.value
	};
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks', true);
	sende.open('POST', 'http://localhost:3000/api/Tasks', true);
	sende.responseType = 'json';
	sende.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
	sende.setRequestHeader('Token', 'Team_Mystic_FMF');
	sende.send(JSON.stringify(daten));
	setTimeout(getTasks, 1000);
}
