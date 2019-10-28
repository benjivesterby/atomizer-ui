// Access the callback-based API
var amqp = require('amqplib/callback_api');
var amqpConn = null;
var exchange = 'atomizer';
var atomizerChannel = null;
exports.KEY_PI_REQUEST = 'atomizer.montecarlopi.request';
const keys = [this.KEY_PI_REQUEST, 'atomizer.montecarlopi.result'];

exports.start = function () {
    //Create Connection
    //Use Localhost if connecting outside of a container, 
    //else use the container name [some-rabbit] for container to container communication 
    amqp.connect('amqp://some-rabbit', function (error1, conn) {
        if (error1) {
            console.error("[AMQP]", error1.message);
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

                console.log(' [AMQP] Waiting for atomizer messages.');

                keys.forEach(function (key) {
                    atomizerChannel.bindQueue(q.queue, exchange, key);
                });

                atomizerChannel.consume(q.queue, function (msg) {
                    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
                    //console.log(" [x] %s:'%s'", msg.fields.routingKey, JSON.parse(msg.content));
                }, {
                    noAck: true
                });

            });

        })

    });
}



//Publish a message to Atomizer Channel
exports.publish = function (msg, key, callback) {
    try {
        atomizerChannel.publish(exchange, key, Buffer.from(JSON.stringify(msg)));
        console.log("[AMQP] Sent %s", msg);
        callback('publish success: key ' + key);
    } catch (e) {
        console.error("[AMQP] publish error:", e.message);
        callback('publish error');
    }
}












