var task_data = function(data) {
    var table = document.querySelector('#tasks tbody');
    var taskArr = data;
    var taskTable = '';
    for (var i = 0; i < data.length; i++) {
        taskTable += '<tr>';
        taskTable += '<td>' + taskArr[i].id + '</td>';
        taskTable += '<td>' + taskArr[i].type + '</td>';
        taskTable += '<td>' + taskArr[i].data.input + '</td>';
        taskTable += '<td>' + taskArr[i].data.output + '</td>';
        taskTable += '</tr>';
    }
    table.innerHTML = taskTable;
}

function getTasks() {
    var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
    task.open('GET', 'http://localhost:3000/api/Tasks');
    task.responseType = 'json';
    task.setRequestHeader('Token', 'meins-1337');
    task.onload = function() {
        var data = task.response;
        if (data !== null) {
            console.log(data);
            if (document.querySelector('#tasks tbody').rows.length < data.length); {
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
        type: select.value,
        data: {
            input: inputText.value
        }
    };
    //sende.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks', true);
    sende.open('POST', 'http://localhost:3000/api/Tasks', true);
    sende.responseType = 'json';
    sende.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    sende.setRequestHeader('Token', 'meins-1337');
    sende.onload = function() {

    };
    sende.send(JSON.stringify(daten));
    setTimeout(getTasks, 1000)
}
