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

let tasks = getTasks();
let bot = getBot();
let reports = getReports();

const serverToken = 'Team_Mystic_FMF';

const getTasks = function() {
	fs.readFile(__dirname + '/' + 'TaskData.json', 'UTF-8', function(err, data) {
		if (err) throw err;
		tasks = JSON.parse(data);
	});
};

const getBot = function() {
	fs.readFile(__dirname + '/' + 'BotData.json', 'UTF-8', function(err, data) {
		if (err) throw err;
		bot = JSON.parse(data);
	});
};

const getReports = function() {
	fs.readFile(__dirname + '/' + 'ReportdData.json', 'UTF-8', function(err, data) {
		if (err) throw err;
		reports = JSON.parse(data);
	});
};

const saveTasks = function() {
	fs.writeFile('TaskData.json', JSON.stringify(tasks), function(err) {
		if (err) throw err;
	});
};

const saveBot = function() {
	fs.writeFile('BotData.json', JSON.stringify(bot), function(err) {
		if (err) throw err;
	});
};

const saveReports = function() {
	fs.writeFile('ReportsData.json', JSON.stringify(reports), function(err) {
		if (err) throw err;
	});
};

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
	if (index !== -1) {
		res.json(bot[index]);
	} else {
		res.send('Bot nicht gefunden');
	}
});
router.post('/Status', function(req, res) {
	let wl;
	let index = bot.map(function(d) {
		return d["id"];
	}).indexOf(req.body.id);
	if (index !== -1) {
		if (req.body.status) {
			wl = 0.1;
		} else {
			wl = 0.0;
		}
		bot[index].workload = wl;
	} else {
		console.log('fehler');
	}
	saveBot();
	res.send('OK');
});
router.post('/Status/:id', function(req, res) {
	let index = tasks.map(function(d) {
		return d["id"];
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
});
router.get('/Tasks/:id', function(req, res) {
	getTasks();
	let index = tasks.map(function(d) {
		return d["id"];
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
	let index = reports.map(function(d) {
		return d["id"];
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
			id: tasks.length + 1,
			type: req.body.type,
			data: {
				input: req.body.data.input,
				output: null
			}
		};
		tasks.push(neu);
		saveTasks();
		let report = {
			id: req.body.id,
			report: 'OK'
		};
		reports.push();
		saveReports();
		res.send(report.params.report);
	} else {
		res.send("NOT OK");
	}

});
router.post('/Tasks/:id', function(req, res) {
	if (checkToken(req.get("token"))) {
		getTasks();

		let index = tasks.map(function(d) {
			return d["id"];
		}).indexOf(parseInt(req.params.id));
		if (index !== -1) {
			tasks[index].id = parseInt(req.params.id);
			tasks[index].type = req.body.type;
			tasks[index].data.input = req.body.data.input;
			tasks[index].data.output = req.body.data.output;
			saveTasks();
		} else {
			res.send("Fehler");
		}
		saveTasks();
		let report = {
			id: req.body.id,
			report: 'OK'
		};
		reports.push();
		saveReports();
		res.send(report.params.report);
	} else {
		res.send("NOT OK");
	}
});

const checkToken = function(token) {
	return serverToken === token;
};

app.listen(3000, () => {
	console.log('Example listening on http://localhost:3000');
});
