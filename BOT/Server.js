const parser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const fs = require("fs");

app.use(cors());
app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());
app.use('/api', router);

var tasks = getTasks();
var bot = getBot();

function getTasks() {
    fs.readFile(__dirname + '/' + 'TaskData.json', 'UTF-8', function(err, data) {
        tasks = JSON.parse(data);
    });
}

function getBot() {
    fs.readFile(__dirname + '/' + 'BotData.json', 'UTF-8', function(err, data) {
        bot = JSON.parse(data);
    });
}

function saveTasks() {
    fs.writeFile('TaskData.json', JSON.stringify(tasks), function(err) {
        if (err) throw error;
    });
}

function saveBot() {
    fs.writeFile('BotData.json', JSON.stringify(bot), function(err) {
        if (err) throw error;
    });
}

app.get('/', function(req, res) {
    res.send('fehler');
});
router.get('/', function(req, res) {
    res.send('fehler');
});
router.get('/Status', function(req, res) {
    getBot();
    res.json(bot);
});
router.get('/Status/:id', function(req, res) {
    let index = bot.map(function(d) {
        return d["id"];
    }).indexOf(parseInt(req.params.id));
    if (index != -1) {
        res.json(bot[index]);
    } else {
        res.send('Bot nicht gefunden');
    }
});
app.post('/', function(req, res) {
    res.send('fehler');
});
router.post('/Status', function(req, res) {
    let wl;
    var index = bot.map(function(d) {
        return d["id"];
    }).indexOf(req.body.id);
    if (index != -1) {
        if (req.body.status) {
            wl = 0.1
        } else {
            wl = 0.0
        }
        bot[index].workload = wl;
    } else {
        console.log('fehler');
    }
    saveBot();
    res.send('OK');
});
router.post('/Status/:id', function(req, res) {
    var index = tasks.map(function(d) {
        return d["id"];
    }).indexOf(parseInt(req.params.id));

    if (index != -1) {
        res.json({
            message: 'OK'
        });
    } else {
        res.json({
            message: 'NOT OK'
        });
    }
});

router.get('/Tasks', function(req, res) {
    getTasks();
    res.json(tasks);
});
router.get('/Tasks/:id', function(req, res) {
    getTasks();
    let index = tasks.map(function(d) {
        return d["id"];
    }).indexOf(parseInt(req.params.id));

    if (index != -1) {
        res.json(tasks[index]);
    } else {
        res.send("Task nicht gefunden");
    }
});
router.post('/Tasks', function(req, res) {
    // hier nich token abfragen
    let neu = {
        id: tasks.length + 1,
        type: req.body.type,
        data: {
            input: req.body.data.input,
            output: null
        }
    };
    tasks.push(neu);
    saveTasks();
    res.send(tasks);
});
router.post('/Tasks/:id', function(req, res) {
    // hier nich token abfragen
    getTasks();

    let index = tasks.map(function(d) {
        return d["id"];
    }).indexOf(parseInt(req.params.id));
    if (index != -1) {
        tasks[index].id = parseInt(req.params.id);
        tasks[index].type = req.body.type;
        tasks[index].data.input = req.body.data.input;
        tasks[index].data.output = req.body.data.output;
        saveTasks();
    } else {
        res.send("Fehler");
    };

    tasks.push(neu);
    saveTasks();
    res.send(tasks);
});

app.listen(3000, () => {
    console.log('Example listening on http://localhost:3000');
});
