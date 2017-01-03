var bot_data = function(data) {
    var table = document.querySelector('#botMode tbody');
    var taskArr = data;
    var taskTable = '';
    let sync = '';


    for (var i = 0; i < data.length; i++) {
        console.log(taskArr[i].id + " : " + taskArr[i].data.output);
        console.log(typeof taskArr[i].type);
        if (taskArr[i].data.output === null) {
            sync = 'OK';
        } else {
            sync = 'NOT OK';
        }

        taskTable += '<tr>';
        taskTable += '<td>' + taskArr[i].id + '</td>';
        taskTable += '<td>' + taskArr[i].type + '</td>';
        taskTable += '<td>' + taskArr[i].data.input + '</td>';
        taskTable += '<td>' + taskArr[i].data.output + '</td>';
        taskTable += '<td>' + sync + '</td>';
        taskTable += '</tr>';
    }

    table.innerHTML = taskTable;
}

function getBotTasks() {
    var task = new XMLHttpRequest();
    //task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
    task.open('GET', 'http://localhost:3000/api/Tasks');
    task.responseType = 'json';
    task.setRequestHeader('Token', 'meins-1337');
    task.onload = function() {
        var data = task.response;
        if (data !== null) {
            console.log(data);
            if (document.querySelector('#botMode tbody').rows.length < data.length); {
                bot_data(data);
            }
        }
    };
    task.send(null);
}
getBotTasks();
setInterval(getBotTasks, 20000)
