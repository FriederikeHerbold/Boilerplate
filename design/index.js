var xhrStatusTable = new XMLHttpRequest();
var xhrSend = new XMLHttpRequest();
var xhrGetTasks = new XMLHttpRequest();
var xhrInputData = new XMLHttpRequest();
var timer = setInterval(getInformationFromServer, 1000);

var dataArchive = {
	dataStatus: null,
	dataTasks: null,
	sortMode: ""
};

xhrSend.onload = function() {
	var data = xhrSend.response;
	if (data !== null)
		console.log(data);
}

xhrStatusTable.onload = function() {

    var data = xhrStatusTable.response;
    if (data !== null) {
		dataArchive.dataStatus = data;
		tableSort(dataArchive.sortMode);
		setTableStatus();
    }

};

xhrGetTasks.onload = function() {
	
	var data = xhrGetTasks.response;
	if (data != null) {
		dataArchive.dataTasks = JSON.parse(data);
		setTaskTable();
	}
}

xhrInputData.onload = function() {
	
	var data = xhrInputData.response;
	if (data !== null) {
		console.log(data);
		getTasks();
	}
}

var getInformationFromServer = function() {
	xhrStatusTable.open('GET', 'http://botnet.artificial.engineering/api/Status');
	xhrStatusTable.responseType = 'json';
	xhrStatusTable.setRequestHeader('Content-Type', 'application/json');
	xhrStatusTable.send(null);
}

var setTableStatus = function() {
	var table = document.querySelector("#tableBodyStatus");
	if (table.rows.length > 0) {
		for (var i = table.rows.length - 1; i >= 0; i--)
			table.deleteRow(i);
	}
	for (var i = 0; i < dataArchive.dataStatus.length; i++) {
		var row = table.insertRow(table.rows.length);
		row.align = "center";
		row.insertCell(0).innerHTML = dataArchive.dataStatus[i].id;
		row.insertCell(1).innerHTML = dataArchive.dataStatus[i].ip;
		row.insertCell(2).innerHTML = dataArchive.dataStatus[i].task;
		row.insertCell(3).innerHTML = dataArchive.dataStatus[i].workload;
		row.insertCell(4).innerHTML = '<button id="activeBtn"' + i + '" onclick="javascript:sendData(' + i + ')">' + ((dataArchive.dataStatus[i].workload === 0) ? 'Start' : 'Stop') + '</button>';
	}
}

var tableSort = function(sortMode) {
	if (dataArchive.sortMode != sortMode)
		dataArchive.sortMode = sortMode;
	else if (dataArchive.sortMode == "")
		return;
	var tableBodyStatus = document.querySelector("#tableBodyStatus");
	if (sortMode == "I")
		dataArchive.dataStatus.sort(function (a, b) {
			return a.id - b.id;
		});
	else if (sortMode == "W")
		dataArchive.dataStatus.sort(function (a, b) {
			return a.workload - b.workload;
		});
	else if (sortMode == "IP")
		dataArchive.dataStatus.sort(function (a, b) {
			var c = a.ip, d = b.ip;
			var aIP6 = a.ip.indexOf(":"),
				bIP6 = b.ip.indexOf(":");
			if (aIP6 == -1 && bIP6 == -1) { // IP4
				for (var i = 0; i < 4; i++) {
					var strASep = c.indexOf("."), strBSep = d.indexOf("."), valStrA, valStrB;
					valStrA = (strASep != -1) ? parseInt(c.substr(0,strASep)) : parseInt(c);
					valStrB = (strBSep != -1) ? parseInt(d.substr(0,strBSep)) : parseInt(d);
					if (valStrA < valStrB)
						return -1;
					else if (valStrA > valStrB)
						return 1;
					else {
						c = c.substr(strASep + 1, c.length);
						d = d.substr(strBSep + 1, d.length);
					}
				}
			} else if (aIP6 > 0 && bIP6 > 0) { // IP6
				for (var i = 0; i < 4; i++) {
					var strASep = c.indexOf(":"), strBSep = d.indexOf(":"), valStrA, valStrB;
					valStrA = (strASep != -1) ? parseInt(c.substr(0,strASep)) : parseInt(c);
					valStrB = (strBSep != -1) ? parseInt(d.substr(0,strBSep)) : parseInt(d);
					if (valStrA < valStrB)
						return -1;
					else if (valStrA > valStrB)
						return 1;
					else {
						c = c.substr(strASep + 1, c.length);
						d = d.substr(strBSep + 1, d.length);
					}
				}
			} else
				return (aIP6 == -1) ? -1 : 1;
		});
	else if (sortMode == "T")
		dataArchive.dataStatus.sort(function (a, b) {
			return a.task - b.task;
		});
	else if (sortMode == "AI")
		dataArchive.dataStatus.sort(function (a, b) {
			return a.workload - b.workload;
		});
	setTableStatus();
}

var sendData = function(idx) {
	var data = {
		id: dataArchive.dataStatus[idx].id,
		status: (dataArchive.dataStatus[idx].workload === 0) ? true : false
	};
	xhrSend.open('POST', 'http://botnet.artificial.engineering:80/api/Status');
	xhrSend.setRequestHeader('Content-Type', 'application/json');
	xhrSend.send(JSON.stringify(data));
	getInformationFromServer();
}

var getTasks = function() {
	xhrGetTasks.open('GET', 'http://botnet.artificial.engineering/api/Tasks');
	xhrGetTasks.setRequestHeader('Content-Type', 'application/json');
	xhrGetTasks.send(null);
}

var setTaskTable = function() {
	var tableBody = document.querySelector("#tableBodyTasks");
	if (tableBody.rows.length > 0) {
		for (var i = tableBody.rows.length - 1; i >= 0; i--)
			tableBody.deleteRow(i);
	}
	for (var i = 0; i < dataArchive.dataTasks.length; i++) {
		var row = tableBody.insertRow(tableBody.rows.length);
		row.align = "center";
		row.insertCell(0).innerHTML = dataArchive.dataTasks[i].id;
		row.insertCell(1).innerHTML = dataArchive.dataTasks[i].type;
		row.insertCell(2).innerHTML = dataArchive.dataTasks[i].data.input;
		row.insertCell(3).innerHTML = dataArchive.dataTasks[i].data.output;
	}	
}


var sendInputData = function() {
	var data = {
		type: document.querySelector("#typeInput").value,
		data: {
			input: document.querySelector("#textInput").value
		}
	}
	xhrInputData.open('POST', 'http://botnet.artificial.engineering/api/Tasks');
	xhrInputData.setRequestHeader('Content-Type', 'application/json');
	xhrInputData.send(JSON.stringify(data));
	getTasks();
}

var init = function () {
	var links = [].slice.call(document.querySelectorAll("menu a"));
	var sections = [].slice.call(document.querySelectorAll("main section"));
	links.forEach(function (links) {
		var mytarget = document.querySelectorAll("link.href");
		sections.forEach(function (other) {
			other.className = other === mytarget ? "active" : "";
		});
	});
}

getInformationFromServer();