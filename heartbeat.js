var mqtt = require('mqtt')
var amqp = require('amqplib')
var request = require('request')


const IP = '172.19.128.54';
const KEY = 'd85qQVQOTA4VX6ToA1vTW9';
const topic = 'iot/heartbeat_sensor';

var options = {
    host: 'mqtt://' + IP,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'guest',
    password: 'guest',
};

function sendMail() {
    request({
        url: 'https://maker.ifttt.com/trigger/heartbeat_sensor/json/with/key/'+KEY,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
}

amqp.connect('amqp://guest:guest@172.19.128.54:5672').then(function(con) {
    process.once('SIGINT', function() { con.close(); });
    return con.createChannel().then(function(chnl) {

        var ok = chnl.assertQueue('iot/heartbeat_sensor', {durable: false});

        ok = ok.then(function(_qok) {
            return chnl.consume('iot/heartbeat_sensor', function(msg) {


                    var hb = msg.content.toString();

                    topicData = "Heart Beat Value : " + hb;
                    send_to_one_topic_mqtt(topic, topicData);

                console.log("Heart Beat received from iot/heartbeat_sensor: " + msg.content);

                if (Number(msg.content) > 120) {
                    console.log('iot/heartbeat_sensor');
                    sendMail();
                }


            }, {noAck: true});
        });

        return ok.then(function(_consumeOk) {
            console.log('[expecting for messages : iot/heartbeat_sensor');
        });
    });
}).catch(console.warn);

async function send_to_one_topic_mqtt(topic, data) {
    var client = mqtt.connect("mqtt://" + IP, options);
    client.on('connect', function () {
        client.publish(topic, data, function () {
            client.end();
        });
    });
}