express = require('express')
io = require('socket.io')

app = module.exports = express.createServer() 

app.configure () -> 
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(require('stylus').middleware({ src: __dirname + '/public' }))
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))

app.configure 'development', () -> 
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })) 

app.configure 'production', () -> 
  app.use(express.errorHandler()) 

io = require('socket.io').listen(app)
count = 0

io.sockets.on 'connection', (socket) ->
  count++
  io.sockets.emit 'count', { number: count }

  setInterval(() ->
    io.sockets.emit 'count', { number: count }
  , 1200)

  socket.on 'disconnect', () ->
    count--
    io.sockets.emit 'count', { number: count }

app.get '/', (req, res) ->
  res.render 'index', {title: 'node.js express socket.io counter'}

if not module.parent
  app.listen 10927
  console.log "Express server listening on port %d", app.address().port

