var status_data = function(data) {
    var code = data.map((val, index) => {
        var button;
        console.log(val.id);
        console.log(val.workload);
        if (val.workload === 0) {
            button = '<label class="switch">' +
                '<input type="checkbox" onchange= "POSTstat(' + val.id + ', ' + val.workload + ')" >' +
                '<div class="slider round"></div>' +
                '</label>'
        } else {
            button = '<label class="switch">' +
                '<input type="checkbox" onchange= "POSTstat(' + val.id + ', ' + val.workload + ')" checked>' +
                '<div class="slider round"></div>' +
                '</label>'
        }
        return '<tr><td>' + Object.values(val).join('</td><td>') + '</td><td>' + button + '</td></tr>';
    }).join('\n');
    return code;
};

function getStatus() {
    var stat = new XMLHttpRequest();
    //stat.open('GET', 'http://botnet.artificial.engineering:80/api/Status');
    stat.open('GET', 'http://localhost:3000/api/Status');
    stat.responseType = 'json';
    stat.setRequestHeader('Token', 'meins-1337');
    stat.onload = function() {
        var data = stat.response;
        if (data !== null) {
            console.log(data);
            var element = document.querySelector('#status tbody');
            element.innerHTML = status_data(data);
        }
    };
    stat.send(null);
}
getStatus();
setInterval(getStatus, 20000);

function POSTstat(ids, workload) {
    var statPOST = new XMLHttpRequest();
    //statPOST.open('POST', 'http://botnet.artificial.engineering:80/api/Status', true);
    statPOST.open('POST', 'http://localhost:3000/api/Status', true);
    statPOST.responseType = 'json';
    statPOST.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    statPOST.setRequestHeader('Token', 'meins-1337');
    let datenS = {
        id: ids,
        status: null
    };
    if (workload === 0) {
        datenS.status = true;
    } else {
        datenS.status = false;
    }
    statPOST.send(JSON.stringify(datenS));
}
