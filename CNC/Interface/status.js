let getStatusTBody = function(statusArray) {
	let code = statusArray.map((val) => {
		let button;
		if (val.workload === 0) {
			button = '<label class="switch"><input type="checkbox" onchange= "POSTstat(' + val.id + ', ' + val.workload + ')"><div class="slider round"></div></label>';
		} else {
			button = '<label class="switch"><input type="checkbox" onchange= "POSTstat(' + val.id + ', ' + val.workload + ')" checked><div class="slider round"></div></label>';
		}
		return '<tr><td>' + Object.values(val).join('</td><td>') + '</td><td>' + button + '</td></tr>';
	}).join('\n');
	return code;
};

let getStatus = function() {
	let statusAnfrage = new XMLHttpRequest();
    //stat.open('GET', 'http://botnet.artificial.engineering:80/api/Status');
	statusAnfrage.open('GET', 'http://localhost:3000/api/Status');
	statusAnfrage.responseType = 'json';
	statusAnfrage.setRequestHeader('Token', 'Team_Mystic_FMF');
	statusAnfrage.onload = function() {
		let statusArray = statusAnfrage.response;
		if (statusArray !== null) {
			let element = document.querySelector('#status tbody');
			element.innerHTML = getStatusTBody(statusArray);
		}
	};
	statusAnfrage.send(null);
};
getStatus();
setInterval(getStatus, 20000);

let POSTstat = function(statusId, workload) {
	let statPOST = new XMLHttpRequest();
    //statPOST.open('POST', 'http://botnet.artificial.engineering:80/api/Status', true);
	statPOST.open('POST', 'http://localhost:3000/api/Status', true);
	statPOST.responseType = 'json';
	statPOST.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
	statPOST.setRequestHeader('Token', 'Team_Mystic_FMF');
	let postedStatus = {
		id: statusId,

		status: null
	};
	if (workload === 0) {
		postedStatus.status = true;
	} else {
		postedStatus.status = false;
	}
	statPOST.send(JSON.stringify(postedStatus));
};
