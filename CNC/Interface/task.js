
var task_data=function(data){
  var code = data.map((val,index) => {
    return '<tr><td>' + Object.values(val).join('</td><td>') + '</td></tr>';
  }).join('\n');
  return code;
};
var task = new XMLHttpRequest();
task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');
task.responseType = 'json';
task.setRequestHeader('Token', 'my-token-1337');
task.onload = function() {
  var data = task.response;
  if (data !== null) {
    console.log(data); // Parsed JSON object
    var element = document.querySelector('#tasks tbody');
    element.innerHTML = task_data(data);
  }
};
task.send(null);
/*task.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks');
task.responseType = 'json';
task.setRequestHeader('Token', 'my-token-1337');
task.onload = function() {
  var data = task.response;
  if (data !== null) {
    console.log(data); // Parsed JSON object
  }
};
task.send(null);*/
