var amqp = require('amqplib/callback_api');
var amqpConn = null;
var atomizerChannel = null;
var publishQueue = process.env.QUEUE || 'atomizer';
var appid = process.env.APPID || '0f7827a0-0baa-11ea-a738-a707993eaee1';

//Use Docker variable [should be some-rabbit] if available else,
//Use Localhost if connecting outside of a container, 
var rabbitHost = (process.env.RABBIT_NAME) ? 'amqp://' + process.env.RABBIT_NAME : 'amqp://localhost';

//Setup Event Emmiter
var events = require('events');
var em = new events.EventEmitter();


exports.start = function () {

    //Create Connection
    amqp.connect(rabbitHost, function (error0, connection) {
        if (error0) {
            console.error("[AMQP]", error0.message);
            throw error0;
        }

        console.log("[AMQP] connected");
        amqpConn = connection;

        //Create Channel
        amqpConn.createChannel(function (error1, channel) {
            if (error1) {
                console.error("[AMQP]", error1.message);
                throw error1;
            }

            atomizerChannel = channel;

            console.log("[AMQP] Atomizer Channel Created");

            //Setup Queues if they don't already exist in RabbitMQ
            atomizerChannel.assertQueue(publishQueue, {
                durable: true
            });

            atomizerChannel.assertQueue(appid, {
                durable: true
            });

            console.log("[AMAP] Atomizer Queues Created");


            //Start Consumer
            channel.consume(appid, function (msg) {
                console.log("[AMAP] Received %s", msg.content.toString());
                //emit event so that server.js can listen to new messages coming in
                em.emit('atomizer-response', msg.content.toString())
            }, {
                noAck: true
            });

            console.log("[AMAP] Consumer started");
            console.log("[AMQP] Waiting for messages in queue %s. ", appid);

        });
    });
}


//Publish a message to Atomizer Channel
exports.publish = function (msg, callback) {
    try {
        atomizerChannel.sendToQueue(publishQueue, Buffer.from(JSON.stringify(msg)));

        //atomizerChannel.publish(exchange, topic, Buffer.from(JSON.stringify(msg)));
        console.log("[AMQP] Published %j", msg);
        callback('success');
    } catch (e) {
        console.error("[AMQP] publish error:", e.message);
        callback('error');
    }
}

exports.emmiter = em;