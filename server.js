/**
 * Module dependencies.
 */

var express = require('express')
	, io = require('socket.io')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var io = require('socket.io').listen(app);
var count = 0;

io.sockets.on('connection', function (socket) {
	count++
	io.sockets.emit('count', { number: count });

	setInterval(function() {
		io.sockets.emit('count', { number: count });
	}, 1000);

	socket.on('disconnect', function () {
		count--
		io.sockets.emit('count', { number: count });
	});
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'node.js express socket.io counter'
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(10709);
  console.log("Express server listening on port %d", app.address().port);
}
