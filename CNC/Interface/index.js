//(function (global){
let dataArchive = {
	dataStatus: null,
	dataTasks: null,
	dataReports: null,
	sortMode: ""
}


let serverURL = "http://localhost:3000/";
let serverToken = document.querySelector('#serverTokenInput').value;
let botMode = false;

const setTableStatus = function() {
	const table = document.querySelector("#tableBodyStatus");
	if (table.rows.length > 0) {
		for (var i = table.rows.length - 1; i >= 0; i--)
			table.deleteRow(i);
	}
	for (let i = 0; i < dataArchive.dataStatus.length; i++) {
		let row = table.insertRow(table.rows.length);
		row.align = "center";
		row.insertCell(0).innerHTML = dataArchive.dataStatus[i].id;
		row.insertCell(1).innerHTML = dataArchive.dataStatus[i].ip;
		row.insertCell(2).innerHTML = dataArchive.dataStatus[i].task;
		row.insertCell(3).innerHTML = dataArchive.dataStatus[i].workload;
		row.insertCell(4).innerHTML = '<button id="activeBtn"' + i + '" onclick="javascript:statusTableSendData(' + i + ')">' + ((dataArchive.dataStatus[i].workload === 0) ? 'Start' : 'Stop') + '</button>';
	}
}

const getStatusTable = function () {
	fetch(serverURL + 'api/Status').then(function(response) {
			return response.json();
	}).then(function(response) {
			dataArchive.dataStatus = response;
			setTableStatus();
	});
}

const getTaskTable = function() {
	fetch(serverURL + 'api/Tasks').then(function(response) {
		return response.json();
	}).then(function(response) {
		dataArchive.dataTasks = response;
		setTaskTable();
	});	
}

const setTaskTable = function() {
	const tableBody = document.querySelector("#tableBodyTasks");
	if (tableBody.rows.length > 0) {
		for (var i = tableBody.rows.length - 1; i >= 0; i--)
			tableBody.deleteRow(i);
	}
	for (let i = 0; i < dataArchive.dataTasks.length; i++) {
		let row = tableBody.insertRow(tableBody.rows.length);
		let cell;
		row.align = "center";
		row.width = "100px";
		cell = row.insertCell(0);
		cell.innerHTML = dataArchive.dataTasks[i].id;
		cell.style.width = "100px";
		cell = row.insertCell(1);
		cell.innerHTML = dataArchive.dataTasks[i].type;
		cell.style.width = "100px";
		cell = row.insertCell(2);
		cell.innerHTML = dataArchive.dataTasks[i].data.input;
		cell.style.width = "100px";
		cell = row.insertCell(3);
		cell.innerHTML = dataArchive.dataTasks[i].data.output;
		cell.style.width = "100px";
		cell = row.insertCell(4);
		cell.innerHTML = '<button onclick="javascript:taskTableDelete(' + dataArchive.dataTasks[i].id + ')">Remove</button>';
	}
}

const statusTableSendData = function (idx) {
	const data = {
		id: dataArchive.dataStatus[idx].id,
		status: (dataArchive.dataStatus[idx].workload === 0) ? true : false
	};
	// http://botnet.artificial.engineering:80/api/Status
	fetch(serverURL + 'api/Status', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify(data)
	}).then(function (response) {
		console.log(response);
		getStatusTable();
		setTableStatus();
	});
	
}

const timer = new Promise(function(resolve, reject) {
	getStatusTable();
    setInterval(getStatusTable, 1000);

});

const sendTaskInputData = function () {
	let data = {
		type: document.querySelector("#typeInput").value,
		data: {
			input: document.querySelector("#textInput").value
		}
	}
	fetch(serverURL + 'api/Tasks', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(data)
	}).then (function (response) {
		console.log(response);
		getTaskTable();
	});
}
//})(window);


const serverUpdate = () => {
	const server = document.querySelector("#serverPath").value;
	console.log('serverURL changed');
	serverURL = server;
	serverToken = document.querySelector('#serverTokenInput').value;
	dataArchive.dataStatus = null;
	dataArchive.dataTasks = null;
	getStatusTable();
	getTaskTable();
}

const taskTableDelete = (idx) => {
	fetch(serverURL + 'api/Tasks', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: 'DELETE',
		body: JSON.stringify({id: idx})
	}).then((response) => {
		console.log(response);
		getTaskTable();
	});
};

const updateTasksStatusTable = (reports) => {
	const table = document.querySelector('#tableTaskStatusBody');
	if (table.rows.length > 0) {
		for (var i = table.rows.length - 1; i >= 0; i--)
			table.deleteRow(i);
	}
	reports.forEach((ele) => {
		let row = table.insertRow(table.rows.length);
		row.insertCell(0).innerHTML = ele.id;
		row.insertCell(1).innerHTML = ele.data.input;
		row.insertCell(2).innerHTML = ele.data.output;
		row.insertCell(3).innerHTML = ele.answer;
	});
};

const botModeRun = () => {
	let tasksBackLog;
	fetch(serverURL + 'api/Tasks').then((response) => {
		return response.json();
	}).then((response) => {
		tasksBackLog = response;
		tasksBackLog.forEach((ele) => {
		ele.data.output = hash(ele.type, ele.data.input);
		fetch(serverURL + 'api/Reports', {
			headers: {
				'token': serverToken,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(ele)
		}).then((response) => {
			console.log(response);
			if (response.message == 'OK'){
				deleteTaskFromServer(ele.id);
				updateTasksStatusTable(ele, response.message);
			}
		});
	});
	});
};

const deleteTaskFromServer = (id) => {
	fetch(serverURL + 'api/Tasks', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: 'DELETE',
		body: JSON.stringify({id: id})
	}).then((response) => {
		console.log(response);
	});
};

const triggerBotMode = () => {
	const button = document.querySelector('#botModeTriggerBtn');
	botMode = !botMode;
	if (botMode) {
		button.innerHTML = 'Pause';
	} else {
		button.innerHTML = 'Resume';
	}
	if (botMode) {
	/*	botModeRun();	*/
	nw.Window.open('https://github.com/nwjs/nw.js', {}, function(new_win) {
		// do something with the newly created window
	});
	}
};

const getReports = () => {
	fetch(serverURL + 'api/Reports').then((response) => {
		return response.json();
	}).then((response) => {
			updateTasksStatusTable(response);
	});
};