const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);


const flat = require(enduro.enduro_path + '/libs/flat_db/flat')
const logger = require(enduro.enduro_path + '/libs/logger')
//const oracledb = require('./upgradeadvisory_helper/oracledb');
const upgradeAdvisory = require('./upgradeadvisory_helper/upgradeAdvisory');

const docProcessing = require('./upgradeadvisory_helper/docProcessing');
const socketio = require('./upgradeadvisory_helper/socketio');
const mylog = require('./upgradeadvisory_helper/logger');
const html = require('./upgradeadvisory_helper/html/html');
var url = require('url');
const validator = require('./upgradeadvisory_helper/utils/validateimpl');

const local_app = function () { }

const dbwrapper = require('./upgradeadvisory_helper/dbms/dbwrapper');
const postprocessor = require('./upgradeadvisory_helper/utils/postprocessor');
const LinkHTML = require('./upgradeadvisory_helper/html/linkhtml');

const couchdb = require('./upgradeadvisory_helper/dbms/queries/query_couchdb');

const requesthandlers = require('./upgradeadvisory_helper/requestHandlers');
// * ———————————————————————————————————————————————————————— * //
// * 	init
// *
// *	gets called upon starting enduro.js production server
// *	@param {express app} app - express app
// *	@return {nothing}
// * ———————————————————————————————————————————————————————— * //

var temper = enduro.api.temper



local_app.prototype.init = function (app) {

	var mylogger = new mylog();
	console.log('Start app init');

	enduro.io.of('/prepareadvisory')
		.on('connection', function (socket) {
			var clientlogger = new mylog(socket);

			socket.emit('connected', { id: socket.id });

			//populate table of executed tasks
			socket.on('tasks', async function (args) {

				try {
					var res = await couchdb.query(socket, 'documents/_all', { include_docs: true }, 'uahelper');

					socket.emit('tasks', prepareTasksList(res));

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				}

			});

			//populate drop down list of solutions
			socket.on('get_solutions', async function (args) {

				try {
					var res = await couchdb.query(socket, 'test/solutions_by_components', { group: true, reduce: true, inclusive_end: true }, 'genesys_releases');

					socket.emit('solutions', res);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				}

			});

			//populate drop down list of solutions
			socket.on('get_components', async function (args) {

				try {
					var res = await couchdb.query(socket, 'test/components', { startkey:[args,""], endkey:[args,{}],group: true, reduce: true, inclusive_end: true }, 'genesys_releases');

					socket.emit('components', res);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				}

			});

			// prepare UA document based on customer database
			socket.on('my other event', function (args) {
				mylogger.log(args);

				if (isValidated(args, socket)) {

					// do we need to generate report?
					if (args.genfile)
						var genfile = args.genfile;

					try {
						logger.timestamp('custom parsing starts', 'nice_dev_init');
						//var db=new dbwrapper();
						var p = dbwrapper.getInstance(args.args).logger(clientlogger).init(socket);
						/*
						.catch((e) => {
							console.log('Emit 1:', e.message);
							socket.emit('errors', { error: e.message })
						});
*/
						p.then(async (result, e) => { /// this is the result of interaction with config database
							if (e) {
								console.log('Emit 2');
								socket.emit('errors', { error: e.message });
								return;
							}

							try {
								socket.emit('console', 'Retrieved data succesfully');
								var content = await docProcessing.start(socket, result, genfile, 'false');

								postProcessing(content, args.args, socket);


							} catch (e) {
								console.log('local.app.init:', e.message);
								console.log('Emit 3:', e.stack);
								socket.emit('errors', { error: e.message });
							} finally {
								console.log('Emit Done');
								socket.emit('done', {});
							}
						}).catch((e) => {
							console.log('Emit 4:', e.stack);
							//throw e;
							socket.emit('errors', { error: e.message });
							socket.emit('done', {});
						});
					} catch (e) {
						console.log('Emit 5', e.stack);
						socket.emit('errors', { error: e.message })
						socket.emit('done', {});
					}
				}
			});

			socket.on('search', async function (args) {
				// todo validation check for component form
				if (isValidated(args, socket)) {
					var a = args.args;
					var genfile = a.genfile;

					var component = [{
						APPLICATION_TYPE: (null !== a.apptype) ? a.apptype : "SIP Server",
						OS_TYPE: (null !== a.ostype) ? a.ostype : 'linux',
						RELEASE: (null !== a.release) ? a.release : "8.1.102.95"
					}]
					try {
						var content = await docProcessing.start(socket, component, genfile);
						//content.input=;

						postProcessing(content, args.args, socket);

					} catch (e) {
						console.log('Emit 6:', e.stack);
						socket.emit('errors', { error: e.message })


					} finally {
						socket.emit('done', {});
					}
				}
			})

			socket.on('components', async function (args) {
				// todo validation check for component form
				if (isValidated(args, socket)) {
					var components = args.components;
					var genfile = args.genfile;

					
					try {
						var content = await docProcessing.start(socket, components, genfile);
						//content.input=;

						postProcessing(content, args.args, socket);

					} catch (e) {
						console.log('Emit 6:', e.stack);
						socket.emit('errors', { error: e.message })


					} finally {
						socket.emit('done', {});
					}
				}
			})
			socket.on('deleteresults', async function (args) {
				try {
					var arr = Object.keys(args);
					for (var i = 0; i < arr.length; i++) {
						var index = arr[i];

						var res = await couchdb.remove(socket, args[index], null, 'uahelper');
						console.log('deleted', args[index]);
						socket.emit('deleted', { id: args[index] });


					}
				} catch (e) {
					console.log('Emit 7:', e.stack);
					socket.emit('errors', { error: e.message })
				} finally {
					socket.emit('done', {});
				}
			});

			socket.on('getresults', async function (args) {
				try {


					var res = await couchdb.query(socket, 'documents/_all', { key: args.id, include_docs: true }, 'uahelper');
					console.log('console', 'Retrieved data succesfully');
					socket.emit('result', prepareResults(res[0].doc));



				} catch (e) {
					console.log('GetResults:', e.stack);
					socket.emit('errors', { error: e.message })
				} finally {
					socket.emit('done', {});
				}
			});

			socket.on('recreate_view', async function (args) {
				try {


					if (args.databases) {
						await couchdb.init(args.databases, socket);

						socket.emit('errors', { error: "Views succesfully recreated" })
					} else {
						socket.emit('errors', { error: "Arguments missing" })
					}




				} catch (e) {
					console.log('recreate_view:', e.stack);
					socket.emit('errors', { error: e.message })
				} finally {
					socket.emit('done', {});
				}
			});

		})


	app.get('/prepareadvisory', function (request, response) {




		try {
			var pathname = url.parse(request.url).pathname;
			var args = url.parse(request.url, true).query;
			logger.timestamp("Request for " + pathname + " received.", 'nice_dev_init');

			// loading context file with hardcoded string values and convert it into object
			var context = flat.load('prepareadvisory');

			// set args to null if empty
			args = (!args || Object.keys(args).length === 0) ? null : args;

			//Check for DB arguments
			logger.timestamp('custom parsing starts', 'nice_dev_init');

			//logger.log(args);

			// getting the list of applications and generating the resulting docx file



			temper.render('prepareadvisory', context)
				.then((output) => {
					response.send(output)
				}, (reason) => {
					console.log(reason);
				})
		} catch (err) {
			logger.timestamp(err.stack, 'nice_dev_init');
		}
	})


	app.get('/getFile', async function (request, response) {




		try {
			var pathname = url.parse(request.url).pathname;
			var args = url.parse(request.url, true).query;
			logger.timestamp("Request for " + pathname + " received.", 'nice_dev_init');

			// loading context file with hardcoded string values and convert it into object
			//var context = flat.load('getfile');

			// set args to null if empty
			args = (!args || Object.keys(args).length === 0) ? null : args;

			//Check for DB arguments
			logger.timestamp('custom parsing starts', 'nice_dev_init');


			await requesthandlers.getFile(response, args);

			//logger.log(args);

			// getting the list of applications and generating the resulting docx file


			/*
						temper.render('getfile', context)
							.then((output) => {
								response.send(output)
							}, (reason) => {
								console.log(reason);
								
							})
							*/
		} catch (err) {
			logger.timestamp(err.stack, 'nice_dev_init');
		}
	})




}



function isValidated(args, socket) {
	// set args to null if empty
	args = (!args || Object.keys(args).length === 0) ? null : args;

	//VAlidate arguments
	var res = validator.validate(args);

	if (typeof res !== 'undefined') { // failed validation, returning res to dashboard
		socket.emit('validation', { submitted: false, reason: res });
		return false;
	}

	socket.emit('validation', { submitted: true, reason: 'Arguments validated' });
	return true;

}

async function postProcessing(content, args, socket) {
	content.input = new mylog().stringify(args);
	content.time = new Date().toString();
	var ps = new postprocessor();
	var res = await ps.init(content).save();

	content._id = res._id;
	var task = prepareTasksList(content);

	socket.emit('tasks', task);

	socket.emit('result', ps.format());

}

function prepareResults(content) {
	var ps = new postprocessor();
	ps.init(content);
	return ps.format();
}

function prepareTasksList(content) {
	var res = [];
	if (content instanceof Array) {
		content.forEach((item) => {

			res.push(prepareTask(item));
		})
	} else
		res.push(prepareTask(content));

	return res;
}

function prepareTask(item) {
	var task = {}
	task.time = item.time;
	task.input = item.input;
	task.id = item._id;
	task.link = new LinkHTML('Go to results', '#', '', 'getresult', item._id).toString();
	//.addOnClick('submitData(\'getresults\', { \'id\': '+item._id+' })').toString();
	return task;
}

module.exports = new local_app()

