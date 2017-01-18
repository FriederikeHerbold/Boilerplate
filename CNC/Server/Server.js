const parser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use('/api', router);

const serverToken = 'Team_Mystic_FMF';

//getter von Datei
let getTasks = function() {
	fs.readFile(__dirname + '/' + 'TaskData.json', 'UTF-8', (err, textInTaskData) => {
		if (err) {
			throw err;
		}
		tasks = JSON.parse(textInTaskData);
	});
};

let getBot = function() {
	fs.readFile(__dirname + '/' + 'BotData.json', 'UTF-8', (err, textInBotData) => {
		if (err) {
			throw err;
		}
		bot = JSON.parse(textInBotData);
	});
};

let getReports = function() {
	fs.readFile(__dirname + '/' + 'ReportData.json', 'UTF-8', (err, textInReportData) => {
		if (err) {
			throw err;
		}
		reports = JSON.parse(textInReportData);
	});
};

//setter für Datei
let saveTasks = function() {
	fs.writeFile('TaskData.json', JSON.stringify(tasks), (err) => {
		if (err) {
			throw err;
		}
	});
};

let saveBot = function() {
	fs.writeFile('BotData.json', JSON.stringify(bot), (err) => {
		if (err) {
			throw err;
		}
	});
};

let saveReports = function() {
	fs.writeFile('ReportData.json', JSON.stringify(reports), (err) => {
		if (err) {
			throw err;
		}
	});
};
let tasks = getTasks();
let bot = getBot();
let reports = getReports();
setInterval(saveTasks, 100000);
setInterval(saveReports, 100000);
setInterval(saveBot, 100000);


//ist dieser Block wirklich nötig?
app.get('/', (req, res) => {
	res.send('Die Funktion get mit dem Pfad ""/" wird nicht unterstützt');
});


router.get('/', (req, res) => {
	res.send('Die Funktion get mit dem Pfad ""/" wird nicht unterstützt');
});
router.get('/Status', (req, res) => {
	res.json(bot);
});
router.get('/Status/:id', (req, res) => {
	let index = bot.map((oneBotInBotArray) => oneBotInBotArray.id).indexOf(parseInt(req.params.id));
	if (index !== -1) {
		res.json(bot[index]);
	} else {
		res.send('Bot nicht gefunden');
	}
});
router.post('/Status', (req, res) => {
	let workload;
	let index = bot.map((oneBotInBotArray) => oneBotInBotArray.id).indexOf(req.body.id);
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
router.post('/Status/:id', (req, res) => {
	let index = tasks.map((oneTaskInTasks) => oneTaskInTasks.id).indexOf(parseInt('OK'));

	if (index !== -1) {
		res.json({ message: 'OK' });
	} else {
		res.json({ message: 'NOT OK' });
	}
});

router.get('/Tasks', (req, res) => {
	res.json(tasks);
});

router.get('/Tasks/:id', (req, res) => {
	let index = tasks.map((oneTaskInTasks) => oneTaskInTasks.id).indexOf(parseInt(req.params.id));

	if (index !== -1) {
		res.json(tasks[index]);
	} else {
		res.send('Task nicht gefunden');
	}
});
router.get('/Reports', (req, res) => {
	res.json(reports);
});
router.post('/Reports/:id', (req, res) => {
	if (checkToken(req.get('token'))) {
		let index = tasks.map((oneTaskInTasks) => oneTaskInTasks.id).indexOf(parseInt(req.params.id));
		if (index !== -1) {
			tasks[index].type = req.body.type;
			tasks[index].data.input = req.body.data.input;
			tasks[index].data.output = req.body.data.output;
			saveTasks();
			if (tasks[index].data.output !== null) {
				reports[index].sync = 'NOT OK';
			} else {
				reports[index].sync = 'OK';
			}
			saveReports();
		} else {
			res.send('Fehler');
		}
		res.send('OK');
	} else {
		res.send('NOT OK');
	}
});
router.post('/Tasks', (req, res) => {
	if (checkToken(req.get('token'))) {
		let neu = {
			id: makeNewTaskID(),
			type: req.body.type,
			data: {
				input: req.body.data.input,
				output: null
			}
		};
		let report = {
			id: neu.id,
			sync: 'OK'
		};
		tasks.push(neu);
		reports.push(report);
		saveTasks();
		saveReports();
		res.send(reports.sync);
	} else {
		res.send('NOT OK');
	}

});
router.post('/Tasks/:id', (req, res) => {
	if (checkToken(req.get('token'))) {
		let index = tasks.map((oneTaskInTasks) => oneTaskInTasks.id).indexOf(parseInt(req.params.id));
		if (index !== -1) {
			tasks[index].type = req.body.type;
			tasks[index].data.input = req.body.data.input;
			tasks[index].data.output = req.body.data.output;
			saveTasks();
			if (tasks[index].data.output !== null) {
				reports[index].sync = 'NOT OK';
			} else {
				reports[index].sync = 'OK';
			}
			saveReports();
		} else {
			res.send('Fehler');
		}
		res.send('OK');
	} else {
		res.send('NOT OK');
	}
});

const checkToken = function(token) {
	return serverToken === token;
};

let makeNewTaskID = function() {
	let erg;
	if (tasks.length === 0) {
		erg = 1;
	} else {
		erg = tasks[tasks.length - 1].id + 1;
	}
	return erg;
};

//server Starten
app.listen(3000, () => {
	console.log('Server started\nlistening on http://localhost:3000\n\n');
});
