let dataArchive = {
	dataStatus: null,
	dataTasks: null,
	dataReports: null
};

let serverURL = "http://localhost:3000/";
let serverToken = document.querySelector('#serverTokenInput').value;
let botMode = false;
const crypto = require('crypto');

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
				cell.style.align = 'center';
				cell.innerHTML = values[idx];
				row.appendChild(cell);
			}
		});
		cell = document.createElement('td');
		cell.style.align = 'center';
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
				cell.style.align = 'center';
				cell.innerHTML = values[idx];
				row.appendChild(cell);
			}
		});
		cell = document.createElement('td');
		cell.style.align = 'center';
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
		runBotMode();
	}
};

const getReports = () => {
	fetch(serverURL + 'api/Reports').then((response) => {
		return response.json();
	}).then((response) => {
		updateTasksStatusTable(response);
	});
};

const runBotMode = () => {
	let backlog = null;
	fetch(serverURL + 'api/Tasks/new').then((response) => {
		return response.json();
	}).then((response) => {
		backlog = response;
		processBotBackLog(backlog);
	});
};

const processBotBackLog = (backlog) => {
	if (backlog) {
		backlog.forEach((element) => {
			element.data.output = hash(element.type, element.data.input);
			postTaskOnServer(element);
			postReportOnServer(element);
		});
		triggerBotMode();
	}
};

const hash = (type, string) => {
	if (type !== null && string !== null) {
		if (type === 'hash-md5') {
			let md5sum = crypto.createHash('md5');
			md5sum.update(string);
			return md5sum.digest('hex');
		} else if (type === 'hash-sha256') {
			let sha256sum = crypto.createHash('sha256');
			sha256sum.update(string);
			return sha256sum.digest('hex');
		}
	}
	return null;
};

const postTaskOnServer = (task) => {
	fetch(serverURL + 'api/Tasks/' + task.id, {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(task)
	}).then((response) => {
		return response.json();
	}).then((response) => {
		console.log('POST TASK:' + response.message);
		getTaskTable();
	});
};

const postReportOnServer = (report) => {
	console.log('send report');
	let sendReport = {
		id: report.id,
		data: {
			input: report.data.input,
			output: report.data.output
		}
	};
	fetch(serverURL + 'api/Reports', {
		headers: {
			'token': serverToken,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(sendReport)
	}).then((response) => {
		return response.json();
	}).then((response) => {
		console.log('POST Report: ' + response.message);
		getReports();
	});
};
