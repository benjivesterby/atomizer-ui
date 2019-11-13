// Access the callback-based API
var amqp = require('amqplib/callback_api');
var amqpConn = null;
var atomizerChannel = null;
var exchange = process.env.EXCHANGE || 'atomizer';
var topic = process.env.TOPIC || 'electrons';

//Setup Event Emmiter
var events = require('events');
var em = new events.EventEmitter();


exports.start = function () {
    //Create Connection
    //Use Localhost if connecting outside of a container, 
    //else use the container name [some-rabbit] for container to container communication 
    amqp.connect('amqp://localhost', function (error1, conn) {
        if (error1) {
            console.error("[AMQP2]", error1.message);
            return setTimeout(start, 1000);
        }
        conn.on("error", function (error1) {
            if (error1.message !== "Connection closing") {
                console.error("[AMQP] conn error", error1.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });
        console.log("[AMQP] connected");
        amqpConn = conn;

        //Create Channel
        amqpConn.createChannel(function (error2, channel) {
            if (error2) {
                throw error2;
            }

            channel.assertExchange(exchange, 'topic', {
                durable: false
            });

            atomizerChannel = channel;
            console.log("[AMQP] Atomizer Channel Created");

            //Start Consumer
            atomizerChannel.assertQueue('', {
                exclusive: true
            }, function (error, q) {
                if (error) {
                    throw error;
                }

                console.log('[AMQP] Waiting for atomizer messages.');

                //keys.forEach(function (key) {
                //  atomizerChannel.bindQueue(q.queue, exchange, key);
                //});

                //atomizerChannel.bindQueue(q.queue, exchange, topic); //Consume base topic
                atomizerChannel.bindQueue(q.queue, exchange, topic + ".*"); //Consume all keys off of base topic

                atomizerChannel.consume(q.queue, function (msg) {
                    console.log("[AMQP] Consume %s:'%s'", msg.fields.routingKey, msg.content.toString());
                    //emit event so that server.js can listen to new messages coming in
                    em.emit('AMQP-ConsumeEvent', msg.content.toString())
                }, {
                    noAck: true
                });

            });

        })

    });
}


/**
 * Exports
 */


//Publish a message to Atomizer Channel
exports.publish = function (msg, callback) {
    try {
        atomizerChannel.publish(exchange, topic, Buffer.from(JSON.stringify(msg)));
        console.log("[AMQP] Published %j", msg);
        callback('success');
    } catch (e) {
        console.error("[AMQP] publish error:", e.message);
        callback('error');
    }
}

exports.emmiter = em;











