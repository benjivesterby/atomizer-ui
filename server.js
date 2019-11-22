var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
const atomizerAMQP = require('./server/controllers/atomizer-amqp');
var em = atomizerAMQP.emmiter;


//configure port
var port = process.env.PORT || 3000;


// Get our API routes
const api = require('./server/routes/api');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/atomizer-ui')));


/**
 * Define Socket.io connection and Events
 */
io.on('connection', function (socket) {
    console.log('[Socket.io] A user connected');

    //Watch for publish event, then publish message to RabbitMQ
    socket.on('publish', function (msg) {
        console.log('[Socket.io] Publish: %j', msg);
        atomizerAMQP.publish(msg, function (result) {
            //console.log('[Socket.io] Publish: %s', result);
        })
    });


});

//Subscribe to AMQP Consume Events, then emit with socket.io
em.on('AMQP-ConsumeEvent', function (msg) {
    console.log('[AMQP] Consumed: ' + msg);
    io.emit('atomizer-response', msg);
    //io.emit('atomizer-response', JSON.stringify(msg));
});

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/atomizer-ui/index.html'));
})


/**
 * Listen on provided port, on all network interfaces.
 */
http.listen(port, function () {
    console.log('[Express] Server running on localhost:' + port);
});