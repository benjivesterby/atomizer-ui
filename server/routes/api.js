const express = require('express');
const AMQPStats = require('amqp-stats');
const router = express.Router();
const atomizerAMQP = require('../controllers/atomizer-amqp');
const uuidV1 = require('uuid/v1');

var appid = uuidV1();

//Use Docker variable [should be some-rabbit] if available else,
//Use Localhost if connecting outside of a container, 
var rabbitHost = (process.env.RABBIT_NAME) ? process.env.RABBIT_NAME + ':15672' : 'localhost:8080';

//Start Atomizer AMQP instance
atomizerAMQP.start();

var stats = new AMQPStats({
    username: "guest", // default: guest
    password: "guest", // default: guest
    hostname: rabbitHost,
    protocol: "http"  // default: http
});


/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works!');
});

/* GET api listing. */
router.get('/appid', (req, res) => {
    res.send(JSON.stringify(appid));
});


/* GET RabbitMQ Aliveness. */
router.get('/alive', (req, response) => {
    stats.alive("/", function (err, res, data) {
        if (err) {
            response.send(err);
            throw err;
        }
        console.log('[AMQP] Alive: ', data);
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


/* GET test amqp-conn. */
router.get('/test-amqp', (req, res) => {

    //const atomizerAMQP = require('../controllers/atomizer-amqp');
    //atomizerAMQP.start();

    //test montecarlo
    var msgMontecarlo = {
        id: uuidV1(),
        atomid: 'montecarlo',
        payload: {
            tosses: 10000
        }
    };

    //test toss
    var msgToss = {
        id: uuidV1(),
        atomid: 'toss',
        payload: {}
    };


    atomizerAMQP.publish(msgMontecarlo, function (result) {
        res.send(result);
    })
});


/* Export Router */
module.exports = router;
