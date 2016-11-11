/*data.forEach((element,i)=>{

  var table = document.querySelector("table");
  var body = table.createTBody();
  var row = body.insertRow(0);
  var cell = row.insertCell(0);
  cell.innerHTML= element.workload;
  var cell = row.insertCell(1);
  cell.innerHTML= element.ip;
  var cell = row.insertCell(2);
  cell.innerHTML= element.id;


  console.log(element.id);
  console.log(element.ip);
  console.log(element.task);
  console.log(element.workload);
});
};*/

var status_data=function(data){
  var code = data.map((val,index) => {
    var button;
    if(val.workload === 0){
      button = '<label class="switch">' +
      '<input type="checkbox">' +
      '<div class="slider round"></div>' +
      '</label>'
    }
    else{
      button = '<label class="switch">' +
      '<input type="checkbox" checked>' +
      '<div class="slider round"></div>' +
      '</label>'
    }
    return '<tr><td>' + Object.values(val).join('</td><td>') +'</td><td>'+ button + '</td></tr>';
  }).join('\n');
  return code;
};

var stat = new XMLHttpRequest();
stat.open('GET', 'http://botnet.artificial.engineering:80/api/Status');
stat.responseType = 'json';
stat.setRequestHeader('Token', 'my-token-1337');
stat.onload = function() {
  var data = stat.response;
  if (data !== null) {
    console.log(data); // Parsed JSON object
    var element = document.querySelector('#status tbody');
    element.innerHTML = status_data(data);
  }
};
stat.send(null);
