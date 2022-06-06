var amqp = require('amqplib');

exports.handler = function (context, event) {

    var hbVal = String(Math.round(Math.random() * (140 - 50)) + 50);

    amqp.connect('amqp://guest:guest@172.19.128.54:5672').then(function (con) {
        return con.createChannel().then(function (chnl) {
            var title = 'iot/heartbeat_sensor';
            var sub = chnl.assertQueue(title, {durable: false});
            return sub.then(function () {
                chnl.sendToQueue(title, Buffer.from(hbVal));
                return chnl.close();
            });
        }).finally(function () {
            con.close();
        })
    }).catch(console.log);
    context.callback('Message has been Sent');
};