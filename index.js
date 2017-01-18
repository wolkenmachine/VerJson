var Hapi = require('hapi');
var server = new Hapi.Server();

var storage = require('./storage');
var uuid = require('uuid');
var jsondiffpatch = require('jsondiffpatch');

server.connection({ port: 3000, host: 'localhost' });

server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply('Hello, world!');
	}
});

server.route({
	method: 'POST',
	path: '/document',
	handler: function (request, reply) {
		var document = {
			head: request.payload,
			backdifs: []
		};

		var id = uuid.v4();

		storage.save(id, document, function(){
			reply({id: id});
		});
	}
});

//returns the head of the document
server.route({
	method: 'GET',
	path: '/document/{id}',
	handler: function (request, reply) {
		var id = request.params.id;
		storage.get(id, function(document){
			reply(document);
		});
	}
});

server.route({
	method: 'GET',
	path: '/document/{id}/meta',
	handler: function (request, reply) {
		var id = request.params.id;
		storage.get(id, function(document){
			reply({
				revisions: document.backdifs.length
			});
		});
	}
});

//updates the head
server.route({
	method: 'POST',
	path: '/document/{id}',
	handler: function (request, reply) {
		var id = request.params.id;
		var update = request.payload;

		storage.get(id, function(document){
			document.backdifs.push(jsondiffpatch.diff(document.head, update));
			document.head = update;
			storage.save(id, document, function(){
				reply({version: document.backdifs.length});
			});
		});
	}
});

//returns a specific version
server.route({
	method: 'GET',
	path: '/document/{id}/{version}',
	handler: function (request, reply) {
		var id = request.params.id;
		var version = request.params.version;

		storage.get(id, function(document){
			var oldVersion = document.head;
			for(var i=0; i<=document.backdifs.length-version; i++){
				oldVersion = jsondiffpatch.unpatch(oldVersion, document.backdifs[document.backdifs.length-i]);
				console.log(oldVersion);
			}
			reply(oldVersion);
		});
	}
});

server.start(function(err){
	if (err) {throw err;}
	console.log("Server running at: " + server.info.uri);
});
