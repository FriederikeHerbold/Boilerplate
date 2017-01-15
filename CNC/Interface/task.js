var updateTaskTable = function(taskArray) {
    var table = document.querySelector('#tasks tbody');
    var taskTable = '';
    for (var index = 0; index < taskArray.length; index += 1) {
        taskTable += '<tr>';
        taskTable += '<td>' + taskArray[index].id + '</td>';
        taskTable += '<td>' + taskArray[index].type + '</td>';
        taskTable += '<td>' + taskArray[index].data.input + '</td>';
        taskTable += '<td>' + taskArray[index].data.output + '</td>';
        taskTable += '</tr>';
    }
    table.innerHTML = taskTable;
}

function getTasks() {
    console.log('GET tasks in Task');
    var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
    task.open('GET', 'http://localhost:3000/api/Tasks');
    task.responseType = 'json';
    task.setRequestHeader('Token', 'Team_Mystic_FMF');
    task.onload = function() {
        var newTaskArray = task.response;
        if (newTaskArray !== null) {
            //if (document.querySelector('#tasks tbody').rows.length < newTaskArray.length) {
            updateTaskTable(newTaskArray);
            //}
        }
    };
    task.send(null);
}

getTasks();
setInterval(getTasks, 20000)

function doSend() {
    var sende = new XMLHttpRequest();
    let daten = {
        data: {
            input: inputText.value
        },
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
