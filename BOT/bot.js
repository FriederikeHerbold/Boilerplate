(function () {
	
	const express = require('express');
	const app     = express();
	const router  = express.Router();
	const parser = require('body-parser');
	const cors = require('cors');
	const fetch = require('node-fetch');
	
	const crypto = require('crypto');
	
	app.use(cors());
	app.use(parser.json());
	app.use(parser.urlencoded({ extended: true }));
	app.use('/api', router);

	const bot = {
		ip: null,
		serverURL: 'http://localhost:3000/',
		serverToken: '123abc',
		active: false
	};
	
	const createBot = (serverURL, port) => {
		bot.serverURL = serverURL;
		bot.ip = '127.0.0.1:' + port;
		return bot;
	};
	
	const run = () => {
		fetch(bot.serverURL + 'api/Status', {
			headers: {
				'token': bot.serverToken,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({})
		}).then((response) => {
			return response.json();
		}).then((response) => {
			console.log('POST Status: ' + response.message);
		})
		fetch(bot.serverURL + 'api/Tasks/new', {
			headers: {
				'token': bot.serverToken,
				'Content-Type': 'application/json'
			},
			method: 'GET'
		}).then((response) => {
			return response.json();
		}).then((response) => {
			runTask(response);
		});
	};
	run();
	
	const runTask = (backlog) => {
		backlog.forEach((ele) => {
			ele.data.output = hash(ele.type, ele.data.input);
			postReportOnServer(ele);
			postTaskOnServer(ele);
		});
	};
	
	const postTaskOnServer = (task) => {
		fetch(bot.serverURL + 'api/Tasks/' + task.id, {
			headers: {
				'token': bot.serverToken,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(task)
		}).then((response) => {
			return response.json();
		}).then((response) => {
			console.log('POST TASK:' + response.message);
		});
	};
	
	const postReportOnServer = (report) => {
		fetch(bot.serverURL + 'api/Reports', {
			headers: {
				'token': bot.serverToken,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(report)
		}).then((response) => {
			return response.json();
		}).then((response) => {
			console.log('POST Report:' + response.message);
		});
	};
	
	const hash = (type, string) => {
		if (type != null && string != null) {
			if (type == 'hash-md5') {
				let md5sum = crypto.createHash('md5');
				md5sum.update(string);
				return md5sum.digest('hex');
			} else if (type == 'hash-sha256') {
				let sha256sum = crypto.createHash('sha256');
				sha256sum.update(string);
				return sha256sum.digest('hex');
			}
		}
		return null;
	};
	
	app.listen(3001);
})();