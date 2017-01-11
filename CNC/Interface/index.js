let dataArchive = {
	dataStatus: null,
	dataTasks: null,
	dataReports: null
};

let serverURL = "http://localhost:3000/";
let serverToken = document.querySelector('#serverTokenInput').value;
let botMode = false;

const setTableStatus = () => {
	const table = document.querySelector("#tableBodyStatus");
	if (table.rows.length > 0) {
		for (let i = table.rows.length - 1; i >= 0; i--) {
			table.deleteRow(i);
		}
	}
	buildTableStatus(table, dataArchive.dataStatus);
};

const getStatusTable = () => {
	fetch(serverURL + 'api/Status').then(function(response) {
		return response.json();
	}).then(function(response) {
		dataArchive.dataStatus = response;
		setTableStatus();
	});
};

const getTaskTable = () => {
	fetch(serverURL + 'api/Tasks').then(function(response) {
		return response.json();
	}).then(function(response) {
		dataArchive.dataTasks = response;
		setTaskTable();
	});
};

const setTaskTable = () => {
	const tableBody = document.querySelector("#tableBodyTasks");
	if (tableBody.rows.length > 0) {
		for (let i = tableBody.rows.length - 1; i >= 0; i--)
			tableBody.deleteRow(i);
	}
	buildTableTasks(tableBody, dataArchive.dataTasks);
};

const buildTableStatus = (targetBody, data) => {
	data.forEach((ele, index) => {
		let row = document.createElement('tr');
		let cell;
		let values = Object.values(ele);
		let keys = Object.keys(ele);
		keys.forEach((key, idx) => {
			if (values[idx] instanceof Object) {
				buildTableAddObject(row, values[idx]);
			} else {
				cell = document.createElement('td');
				cell.innerHTML = values[idx];
				row.appendChild(cell);
			}
		});
		cell = document.createElement('td');
		cell.innerHTML = '<button id="activeBtn"' + index + '" onclick="javascript:statusTableSendData(' + index + ')">' + ((ele.workload === 0) ? 'Start' : 'Stop') + '</button>';
		row.appendChild(cell);
		targetBody.appendChild(row);
	});
};

const buildTableTasks = (targetBody, data) => {
	data.forEach((ele) => {
		let row = document.createElement('tr');
		let cell;
		let values = Object.values(ele);
		let keys = Object.keys(ele);
		keys.forEach((key, idx) => {
			if (values[idx] instanceof Object) {
				buildTableAddObject(row, values[idx]);
			} else {
				cell = document.createElement('td');
				cell.innerHTML = values[idx];
				row.appendChild(cell);
			}
		});
		cell = document.createElement('td');
		cell.innerHTML = '<button onclick="javascript:taskTableDelete(' + ele.id + ')">Remove</button>';
		row.appendChild(cell);
		targetBody.appendChild(row);
	});
};

const buildTableAddObject = (targetrow, obj) => {
	let cell;
	let values = Object.values(obj);
	let keys = Object.keys(obj);
	keys.forEach((key, idx) => {
		cell = document.createElement('td');
		cell.innerHTML = values[idx];
		targetrow.appendChild(cell);
	});
};

const statusTableSendData = (idx) => {
	const data = {
		id: dataArchive.dataStatus[idx].id,
		status: (dataArchive.dataStatus[idx].workload === 0) ? true : false
	};
	// http://botnet.artificial.engineering:80/api/Status
	let serverPath = ('http://botnet.artificial.engineering/' === serverURL) ? serverURL.substr(0, serverURL.length - 1) + ':80/' : serverURL;
	fetch(serverPath + 'api/Status', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify(data)
	}).then((response) => {
		return response.json();
	}).then((response) => {
		console.log(response.message);
		getStatusTable();
	});
};

const timer = new Promise((resolve, reject) => {
	getStatusTable();
	setInterval(getStatusTable, 1000);
});

const sendTaskInputData = () => {
	let data = {
		type: document.querySelector("#typeInput").value,
		data: {
			input: document.querySelector("#textInput").value
		}
	};
	fetch(serverURL + 'api/Tasks', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(data)
	}).then (function (response) {
		return response.json();
	}).then((response) => {
		console.log(response.message);
		getTaskTable();
	});
};

const serverUpdate = () => {
	const server = document.querySelector("#serverPath").value;
	console.log('serverURL changed');
	serverURL = server;
	serverToken = document.querySelector('#serverTokenInput').value;
	dataArchive.dataStatus = null;
	dataArchive.dataTasks = null;
	getStatusTable();
	getTaskTable();
};

const taskTableDelete = (idx) => {
	fetch(serverURL + 'api/Tasks', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: 'DELETE',
		body: JSON.stringify({ id: idx })
	}).then((response) => {
		return response.json();
	}).then((response) => {
		console.log(response.message);
		getTaskTable();
	});
};

const updateTasksStatusTable = (reports) => {
	const table = document.querySelector('#tableTaskStatusBody');
	if (table.rows.length > 0) {
		for (let i = table.rows.length - 1; i >= 0; i--)
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

const triggerBotMode = () => {
	const button = document.querySelector('#botModeTriggerBtn');
	botMode = !botMode;
	if (botMode) {
		button.innerHTML = 'Pause';
	} else {
		button.innerHTML = 'Resume';
	}
	if (botMode) {
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
