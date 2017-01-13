var task_data = function(data) {
	var table = document.querySelector('#tasks tbody');
	var taskArr = data;
	var taskTable = '';
	for (var index = 0; index < data.length; index += 1) {
		taskTable += '<tr>';
		taskTable += '<td>' + taskArr[index].id + '</td>';
		taskTable += '<td>' + taskArr[index].type + '</td>';
		taskTable += '<td>' + taskArr[index].data.input + '</td>';
		taskTable += '<td>' + taskArr[index].data.output + '</td>';
		taskTable += '</tr>';
	}
	table.innerHTML = taskTable;
}

function getTasks() {
	var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
	task.open('GET', 'http://localhost:3000/api/Tasks');
	task.responseType = 'json';
	task.setRequestHeader('Token', 'Team_Mystic_FMF');
	task.onload = function() {
		var data = task.response;
		if (data !== null) {
			console.log(data);
			if (document.querySelector('#tasks tbody').rows.length < data.length) {
				task_data(data);
			}
		}
	};
	task.send(null);
}
getTasks();
setInterval(getTasks, 20000)

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
	setTimeout(getTasks, 1000)
}
