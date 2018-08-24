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
var datesorting = require('./upgradeadvisory_helper/utils/datesorting');

const validator = require('./upgradeadvisory_helper/utils/validateimpl');

const local_app = function () { }

const dbwrapper = require('./upgradeadvisory_helper/dbms/dbwrapper');
const postprocessor = require('./upgradeadvisory_helper/utils/postprocessor');
const LinkHTML = require('./upgradeadvisory_helper/html/linkhtml');

const couchdb = require('./upgradeadvisory_helper/dbms/queries/query_couchdb');

const requesthandlers = require('./upgradeadvisory_helper/requestHandlers');

const views = require('./upgradeadvisory_helper/dbms/queries/view_definitions')

const { CouchDBResult,SimpleObjectResult,SimpleKeyValueResult } = require('./upgradeadvisory_helper/result');

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
					var res = await couchdb.query(socket, views.views_names.solutions.path(), { group: true, reduce: true, inclusive_end: true }, views.views_names.solutions.db);

					socket.emit('solutions', res);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				}

			});

			//populate drop down list of components
			socket.on('get_components', async function (args) {

				try {
					var res = await couchdb.query(socket, views.views_names.components_by_solutions.path(), { startkey: [args, ""], endkey: [args, {}], group: true, reduce: true, inclusive_end: true }, views.views_names.components_by_solutions.db);

					socket.emit('components', res);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				}

			});

			//populate drop down list of configuration lists
			socket.on('get_all_configlists', async function (args) {

				try {
					var res = await couchdb.query(socket, 'documents/_all', { include_docs: true }, 'uahelper_configlists');

					socket.emit('all_configlists', res);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				}

			});

			//populate drop down list of configuration lists
			socket.on('get_configlist', async function (args) {

				try {
					var res = await couchdb.get('uahelper_configlists', args, socket);

					socket.emit('configlist', res);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				}

			});

			// get table of available release notes per solution, component, family, os
			socket.on('get_rn_statdata', async function (args) {

				try {
					var res = await couchdb.query(socket, views.views_names.components_by_solutions_detailed.path(), { group: true, reduce: true, inclusive_end: true }, views.views_names.components_by_solutions_detailed.db);

					var content = { components: new CouchDBResult(res), errors: null , names: {resulttableName: 'Release Notes Summary'} };

					(args.save) ? args.save = false : args;

					postProcessing(content, 'statdata', args, socket);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				} finally {
					socket.emit('done', {});
				}

			});

			// get table of available release notes per solution, component, family, os
			socket.on('get_dbinfo', async function (args) {

				try {
					var res = await couchdb.info(views.views_names.maindDBall.db, socket);

					var content = { components: new SimpleKeyValueResult(res), errors: null, names: {resulttableName: 'DB Info'} };

					


					postProcessing(content, 'dbinfo', args, socket);

				} catch (e) {
					console.log(e.stack);
					socket.emit('errors', { error: e.message });
				} finally {
					socket.emit('done', {});
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

								postProcessing(content, 'result', args.args, socket);


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
						SOLUTION: (null !== a.solution) ? a.solution : null,
						APPLICATION_TYPE: (null !== a.application_type) ? a.application_type : "SIP Server",
						OS_TYPE: (null !== a.os_type) ? a.os_type : 'linux',
						RELEASE: (null !== a.release) ? a.release : "8.1.102.95"
					}]
					try {
						var content = await docProcessing.start(socket, component, genfile);
						//content.input=;

						postProcessing(content, 'result', args.args, socket);

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

						postProcessing(content, 'result', args, socket);

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

			// configuration lists handling
			// channel to save configuration lists
			socket.on('save_configlist', async function (args) {
				try {

					var res = await couchdb.save(socket, args, 'uahelper_configlists');
					console.log('saved', args.cfglist_name);
					socket.emit('saved_configlist', { _id: res._id, _rev: res.rev, cfglist_name: args.cfglist_name, time: res.time });



				} catch (e) {
					console.log('Emit 7:', e.stack);
					socket.emit('errors', { error: e.message })
				} finally {
					socket.emit('done', {});
				}
			});

			// configuration lists handling
			// channel to save configuration lists
			socket.on('update_configlist', async function (args) {
				try {

					var res = await couchdb.update(socket, args._id, args, 'uahelper_configlists', args._rev);
					console.log('updated', args.cfglist_name);
					socket.emit('updated_configlist', { _id: args._id, _rev: args._rev, updated: res.updated });



				} catch (e) {
					console.log('Emit 7:', e.stack);
					socket.emit('errors', { error: e.message })
				} finally {
					socket.emit('done', {});
				}
			});

			// channel to get configuration lists
			socket.on('get_configlist', async function (args) {
				try {
					console.log(new Date().toString() + " [Socket " + socket.id + "][get_configlist] got new message, data: " + args);
					var res = await couchdb.get('uahelper_configlists', args, socket);
					console.log(new Date().toString() + ' Found', res._id);
					socket.emit('configlist', res);
					console.log(new Date().toString() + ' [Socket ' + socket.id + '][get_configlist] Sent result back ', res._id);



				} catch (e) {
					console.log('Emit 7:', e.stack);
					socket.emit('errors', { error: e.message })
				} finally {
					socket.emit('done', {});
				}
			});

			socket.on('delete_configlist', async function (args) {
				try {
					var id = args

					var res = await couchdb.remove(socket, id, null, 'uahelper_configlists');
					console.log('deleted', id);
					socket.emit('deleted_configlist', { id: id });



				} catch (e) {
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

async function postProcessing(content, channel, args, socket) {
	content.input = new mylog().stringify(args.args);
	content.time = new Date().toString();
	var ps = new postprocessor();
	var s = await ps.init(content);

	// if result needs to be saved to db
	if (args.save) {
		var res = await ps.save();

		content._id = res._id;
		var task = prepareTasksList(content);

		socket.emit('tasks', task);
	}
	socket.emit(channel, ps.format());

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

	res.sort(function (a, b) {
		return datesorting.compare(a.time, b.time);
	})

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

