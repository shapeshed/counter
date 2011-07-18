(function() {
  var app, count, express, io;
  express = require('express');
  io = require('socket.io');
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({
      src: __dirname + '/public'
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  io = require('socket.io').listen(app);
  count = 0;
  io.sockets.on('connection', function(socket) {
    count++;
    io.sockets.emit('count', {
      number: count
    });
    setInterval(function() {
      return io.sockets.emit('count', {
        number: count
      });
    }, 1200);
    return socket.on('disconnect', function() {
      count--;
      return io.sockets.emit('count', {
        number: count
      });
    });
  });
  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'node.js express socket.io counter'
    });
  });
  if (!module.parent) {
    app.listen(10927);
    console.log("Express server listening on port %d", app.address().port);
  }
}).call(this);
