const express = require('express');
const router = express.Router();


/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works!');
});

/* GET RabbitMQ Satus. */
router.get('/rabbit', (req, res) => {

    var messageResponse = {
        success: null,
        error: null,
        message: null
    }

    var amqp = require('amqplib/callback_api');

    //Use Localhost if connecting outside of a container, 
    //else use the container name [some-rabbit] for container to container communication 
    amqp.connect('amqp://some-rabbit', function (error0, connection) {
        if (error0) {
            messageResponse.success = false;
            messageResponse.error = error0;
            res.json(status);
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'hello';
            var msg = 'Hello World!';

            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(msg));

            console.log(" [x] Sent %s", msg);
            messageResponse.success = true;
            messageResponse.message = msg;
            res.json(messageResponse);
        });
        setTimeout(function () {
            connection.close();
            //process.exit(0);
        }, 500);
    });


});






/* Export Router */
module.exports = router;