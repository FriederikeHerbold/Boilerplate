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

const serverToken = 'Team_Mystic_FMF';

// getter von Datei
var getTasks = function() {
    fs.readFile(__dirname + '/' + 'TaskData.json', 'UTF-8', function(err, textInTaskData) {
        if (err) throw err;
        console.log('tasks von Datei lesen' + textInTaskData);
        tasks = JSON.parse(textInTaskData);
    });
};

var getBot = function() {
    fs.readFile(__dirname + '/' + 'BotData.json', 'UTF-8', function(err, textInBotData) {
        if (err) throw err;
        bot = JSON.parse(textInBotData);
    });
};

var getReports = function() {
    fs.readFile(__dirname + '/' + 'ReportData.json', 'UTF-8', function(err, textInReportData) {
        if (err) throw err;
        console.log('Report vom Datei Lesen' + textInReportData);
        reports = JSON.parse(textInReportData);
    });
};

// setter für Datei
var saveTasks = function() {
    fs.writeFile('TaskData.json', JSON.stringify(tasks), function(err) {
        if (err) throw err;
    });
};

var saveBot = function() {
    fs.writeFile('BotData.json', JSON.stringify(bot), function(err) {
        if (err) throw err;
    });
};

var saveReports = function() {
    fs.writeFile('ReportData.json', JSON.stringify(reports), function(err) {
        if (err) throw err;
    });
};
var tasks = getTasks();
var bot = getBot();
var reports = getReports();


//Ist dieser Block wirklich nötig?
app.get('/', function(req, res) {
    res.send('Die Funktion get mit dem Pfad ""/" wird nicht unterstützt');
});


router.get('/', function(req, res) {
    res.send('Die Funktion get mit dem Pfad ""/" wird nicht unterstützt');
});
router.get('/Status', function(req, res) {
    getBot();
    res.json(bot);
});
router.get('/Status/:id', function(req, res) {
    let index = bot.map(function(oneBotInBotArray) {
        return oneBotInBotArray["id"];
    }).indexOf(parseInt(req.params.id));
    if (index !== -1) {
        res.json(bot[index]);
    } else {
        res.send('Bot nicht gefunden');
    }
});
router.post('/Status', function(req, res) {
    let workload;
    let index = bot.map(function(oneBotInBotArray) {
        return oneBotInBotArray["id"];
    }).indexOf(req.body.id);
    if (index !== -1) {
        if (req.body.status) {
            workload = 0.1;
        } else {
            workload = 0.0;
        }
        bot[index].workload = workload;
    } else {
        console.log('Der Bot mit der ID ' + req.body.id + 'wurde nicht gefunden');
    }
    saveBot();
    res.send('OK');
});
router.post('/Status/:id', function(req, res) {
    let index = tasks.map(function(oneTaskInTasks) {
        return oneTaskInTasks["id"];
    }).indexOf(parseInt('OK'));

    if (index !== -1) {
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
    console.log('GET und refresh:' + JSON.stringify(tasks));
});

router.get('/Tasks/:id', function(req, res) {
    getTasks();
    let index = tasks.map(function(oneTaskInTasks) {
        return oneTaskInTasks["id"];
    }).indexOf(parseInt(req.params.id));

    if (index !== -1) {
        res.json(tasks[index]);
    } else {
        res.send("Task nicht gefunden");
    }
});

router.get('/Reports', (req, res) => {
    getReports();
    res.json(reports);
});

router.post('/Reports/:id', (req, res) => {
    let index = reports.map(function(oneReportInReports) {
        return oneReportInReports["id"];
    });

    if (index.indexOf(req.params.id)) {

        reports[index].report = 'Not OK';

    } else {
        res.send('fehler');
    }
    saveReports();
    res.send('OK');
});
router.post('/Tasks', function(req, res) {
    if (checkToken(req.get("token"))) {
        let neu = {
            id: makeNewTaskID(),
            type: req.body.type,
            data: {
                input: req.body.data.input,
                output: null
            }
        };
        let reportOfNeu = {
            id: neu.id,
            sync: 'OK'
        };
        tasks.push(neu);
        reports.push(reportOfNeu);
        saveTasks();
        saveReports();
        res.send(reports.sync);
    } else {
        res.send("NOT OK");
    }

});

router.post('/Tasks/:id', function(req, res) {
    if (checkToken(req.get("token"))) {
        getTasks();
        getReports();

        let index = tasks.map(function(oneTaskInTasks) {
            return oneTaskInTasks["id"];
        }).indexOf(parseInt(req.params.id));
        if (index !== -1) {
            tasks[index].type = req.body.type;
            tasks[index].data.input = req.body.data.input;
            tasks[index].data.output = req.body.data.output;
            console.log('Tasks: ' + tasks);
            saveTasks();
            console.log('Output: ' + tasks[index].data.output);
            console.log('reports in GET:' + reports);
            if (tasks[index].data.output !== null) {
                reports[index].sync = 'NOT OK';
            } else {
                reports[index].sync = 'OK';
            }
            saveReports();
        } else {
            res.send("Fehler");
        }
        res.send("OK");
    } else {
        res.send("NOT OK");
    }
});

const checkToken = function(token) {
    return serverToken === token;
};

function makeNewTaskID() {
    let erg;
    if (tasks.length === 0) {
        erg = 1;
    } else {
        erg = tasks[tasks.length - 1].id + 1;
    }
    return erg;
}

// Server Starten
app.listen(3000, () => {
    console.log('Server started\nlistening on http://localhost:3000');
});
