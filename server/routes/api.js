const express = require('express');
const AMQPStats = require('amqp-stats');
const router = express.Router();
const { Docker } = require('node-docker-api');
const docker = new Docker();

//Set APPID
var appid = process.env.APPID || '0f7827a0-0baa-11ea-a738-a707993eaee1';

//Use Docker variable [should be some-rabbit] if available else,
//Use Localhost if connecting outside of a container, 
var rabbitHost = (process.env.RABBIT_NAME) ? process.env.RABBIT_NAME + ':15672' : 'localhost:8080';

var stats = new AMQPStats({
    username: "guest", // default: guest
    password: "guest", // default: guest
    hostname: rabbitHost,  // default: localhost:55672
    protocol: "http"  // default: http
});


/* GET api listing. */
router.get('/appid', (req, res) => {
    console.log('[API] App ID: ', appid);
    res.send(JSON.stringify(appid));
});

/* GET api listing. */
router.get('/atomizer-alive', (req, respose) => {

    var data = { status: 'ok' };

    // List
    docker.container.list()
        // Inspect
        .then(containers => containers[0].status())
        .then(container => console.log('Name: ', container.id))
        .catch(error => console.log(error));

    console.log('[API] Atomizer Alive: ', data);
    respose.send(data);
});


/* GET RabbitMQ Aliveness. */
router.get('/alive', (req, response) => {
    stats.alive("/", function (err, res, data) {
        if (err) {
            response.send(err);
            throw err;
        }
        console.log('[API] Rabbit Alive: ', data);
        response.send(data);
    });
});

/* GET RabbitMQ Overview. */
router.get('/overview', (req, response) => {
    stats.overview(function (err, res, data) {
        if (err) {
            response.send(err);
            throw err;
        }
        console.log('data: ', data);
        response.send(data);
    });
});


/* Export Router */
module.exports = router;
