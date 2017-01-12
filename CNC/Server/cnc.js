(function() {
	const express = require('express');
	const app = express();
	const router = express.Router();
	const parser = require('body-parser');
	const fs = require('fs');
	const cors = require('cors');

	app.use(cors());
	app.use(parser.json());
	app.use(parser.urlencoded({
		extended: true
	}));
	app.use('/api', router);

	const serverToken = '8a30f43349f4d206c3aa5b1b84c97a29'; /* token for POST */

	let archive = { /* data storage */
		tasks: null,
		stat: null,
		reports: null
	};

	const startUp = (arc) => { /* load data from file if exits */
		if (fs.existsSync('./tasks.json')) {
			arc.tasks = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
		} else {
			arc.tasks = [];
		}
		if (fs.existsSync('./status.json')) {
			arc.stat = JSON.parse(fs.readFileSync('status.json', 'utf8'));
		} else {
			arc.stat = [];
		}
		if (fs.existsSync('./reports.json')) {
			arc.reports = JSON.parse(fs.readFileSync('reports.json', 'utf8'));
		} else {
			arc.reports = [];
		}
	};
	startUp(archive);

	const saveTasks = function(target) {
		fs.writeFile('tasks.json', JSON.stringify(target), (err) => {
			if (err) {
				console.error(err);
				throw err;
			}
			console.log('Tasks saved!');
		});
	};

	const saveStatus = function(target) {
		fs.writeFile('status.json', JSON.stringify(target), (err) => {
			if (err) {
				console.error(err);
				throw err;
			}
			console.log('Status saved!');
		});
	};

	const saveReports = function(target) {
		fs.writeFile('reports.json', JSON.stringify(target), (err) => {
			if (err) {
				console.error(err);
				throw err;
			}
			console.log('Reports saved!');
		});
	};

	router.get('/Tasks/:id', (req, res) => {
		console.log('GET: /api/Tasks/' + req.params.id);
		let answer;
		if (req.params.id === 'new') {
			answer = getNewTasks();
		} else {
			answer = getTargetElement(archive.tasks, req.params.id);
			if (answer === null) {
				answer = {
					message: 'NOT OK'
				};
			}
		}
		res.json(answer);
	});

	router.get('/Tasks', (req, res) => {
		console.log('GET: /api/Tasks');
		res.json(archive.tasks);
	});

	router.get('/Status', (req, res) => {
		console.log('GET: /api/Status');
		res.json(archive.stat);
	});

	router.get('/Status/:id', (req, res) => {
		console.log('GET: /api/Tasks/' + req.params.id);
		let answer;
		let ele = getTargetElement(archive.stat, req.params.id);
		if (ele) {
			answer = ele;
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.get('/Reports', (req, res) => {
		console.log('GET: /api/Reports');
		res.json(archive.reports);
	});

	router.get('/Reports/:id', (req, res) => {
		console.log('GET: /api/Reports/' + req.params.id);
		let answer;
		let ele = getTargetElement(archive.reports, req.params.id);
		if (ele) {
			answer = ele;
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.post('/Status', (req, res) => {
		console.log('POST: /api/Status');
		let answer;
		const reqToken = req.get('token');
		if (tokenTest(reqToken)) {
			answer = postStatus(req.body, req.body.id, req.ip);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.post('/Tasks', (req, res) => {
		console.log('POST: /api/Tasks');
		let answer;
		const reqToken = req.get('token');
		if (tokenTest(reqToken)) {
			answer = postTasks(req.body, req.body.id);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.post('/Status/:id', (req, res) => {
		console.log('POST: /api/Status/' + req.params.id);
		let answer;
		const reqToken = req.get('token');
		if (tokenTest(reqToken)) {
			answer = postStatus(req.body, req.params.id);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.post('/Tasks/:id', (req, res) => {
		console.log('POST: /api/Tasks/' + req.params.id);
		const reqToken = req.get('token');
		let answer;
		if (tokenTest(reqToken)) {
			answer = postTasks(req.body, req.params.id);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.post('/Reports', (req, res) => {
		console.log('POST: /api/Reports');
		let answer;
		if (tokenTest(req.get('token'))) {
			answer = postReports(req.body, req.body.id);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.post('/Reports/:id', (req, res) => {
		console.log('POST: /api/Reports/' + req.params.id);
		let answer;
		if (tokenTest(req.get('token'))) {
			answer = postReports(req.body, req.params.id);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	router.delete('/Tasks', (req, res) => {
		console.log('DELETE: /api/Tasks');
		let answer;
		if (tokenTest(req.get('token'))) {
			answer = deleteTasks(req.body.id);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json({
			answer
		});
	});

	router.delete('/Tasks/:id', (req, res) => {
		let answer;
		if (tokenTest(req.get('token'))) {
			answer = deleteTasks(req.params.id);
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		res.json(answer);
	});

	const getFirstFreeID = (target) => {
		let idx = 0;
		for (let i = 0; i < target.length; i++, idx++) {
			if (idx !== i) {
				return idx;
			}
		}
		return idx + 1;
	};

	const getTargetElement = (array, targetID) => {
		const id = parseInt(targetID);
		let answer = array.find((element) => {
			return element.id === id;
		});
		console.log(answer + ' ' + typeof targetID);
		return answer;
	};

	const postStatus = (body, id, ip) => {
		let answer;
		if (id === null || typeof id === "undefined") {
			answer = {
				message: 'OK'
			};
			archive.stat.push({
				id: getFirstFreeID(archive.stat),
				ip: ip,  /* body.ip, */
				task: 0,
				workload: 0
			});
			archive.stat.sort(sortAfterIDAscending);
			saveStatus(archive.stat);
		} else {
			let ele = getTargetElement(archive.stat, id);
			if (ele) {
				answer = {
					message: 'OK'
				};
				if (body.status) {
					ele.workload = 1;
				} else {
					ele.workload = 0;
				}
				saveStatus(archive.stat);
			} else {
				answer = {
					message: 'NOT OK'
				};
			}
		}
		return answer;
	};

	const postTasks = (body, id) => {
		let answer;
		if (id === null || typeof id === "undefined") {
			answer = {
				message: 'OK'
			};
			archive.tasks.push({
				id: getFirstFreeID(archive.tasks),
				type: body.type,
				data: {
					input: body.data.input,
					output: null
				}
			});
			archive.tasks.sort(sortAfterIDAscending);
			saveTasks(archive.tasks);
		} else {
			let ele = getTargetElement(archive.tasks, id);
			console.log(ele);
			if (ele) {
				answer = {
					message: 'OK'
				};
				ele.type = body.type;
				ele.data.input = body.data.input;
				ele.data.output = body.data.output;
				saveTasks(archive.tasks);
			} else {
				answer = {
					message: 'NOT OK'
				};
			}
		}
		return answer;
	};

	const sortAfterIDAscending = (a, b) => {
		return a.id - b.id;
	};

	const tokenTest = (token) => {
		return token !== null && token === serverToken;
	};

	const postReports = (body, id) => {
		let answer;
		if (id !== null) {
			let ele =  archive.reports.find((element) => {
				return element.id === id && element.data.input === body.data.input;
			});
			if (typeof ele !== "undefined") {
				answer = {
					message: 'NOT OK'
				};
			} else {
				answer = {
					message: 'OK'
				};
				archive.reports.push({
					id: id,
					data: {
						input: body.data.input,
						output: body.data.output
					},
					answer: answer.message
				});
				archive.reports.sort(sortAfterIDAscending);
				saveReports(archive.reports);
			}
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		return answer;
	};

	const deleteTasks = (id) => {
		let answer;
		if (id !== null) {
			let found = false;
			for (let i = 0; i < archive.tasks.length && !found; i++) {
				if (archive.tasks[i].id === id) {
					found = true;
					archive.tasks.splice(i, 1);
					answer = {
						message: 'OK'
					};
					saveTasks(archive.tasks);
				}
			}
		} else {
			answer = {
				message: 'NOT OK'
			};
		}
		return answer;
	};

	const getNewTasks = () => {
		let answer = [];
		archive.tasks.forEach((ele) => {
			if (ele.data.output === null) {
				answer.push(ele);
			}
		});
		return answer;
	};
	app.listen(3000);
}());
