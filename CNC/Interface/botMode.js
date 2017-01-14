const bot_data = function(data) {
    var table = document.querySelector('#botMode tbody');
    var taskArr = data;
    var taskTable = '';
    let sync = '';
    for (var index = 0; index < data.length; index += 1) {
        console.log(taskArr[index].id + ' : ' + taskArr[index].data.output);
        console.log(typeof taskArr[index].type);
        if (taskArr[index].data.output === null) {
            sync = 'OK';
        } else {
            sync = 'NOT OK';
        }
        taskTable += '<tr>';
        taskTable += '<td>' + taskArr[index].id + '</td>';
        taskTable += '<td>' + taskArr[index].type + '</td>';
        taskTable += '<td>' + taskArr[index].data.input + '</td>';
        taskTable += '<td>' + taskArr[index].data.output + '</td>';
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
    task.setRequestHeader('Token', 'Team_Mystic_FMF');
    task.onload = function() {
        var data = task.response;
        if (data !== null) {
            console.log(data);
            if (document.querySelector('#botMode tbody').rows.length < data.length) {
                bot_data(data);
            }
        }
    };
    task.send(null);
}
getTasks();
setInterval(getBotTasks, 20000);
