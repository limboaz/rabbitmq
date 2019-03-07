#!/usr/bin/env node
var express = require('express');
var router = express.Router();

var amqp = require('amqplib/callback_api');

router.post('/', function (req, res) {

    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'hw3';

            ch.assertExchange(ex, 'direct', {durable: false});

            ch.assertQueue('', {exclusive: true}, function(err, q) {
                console.log(' [*] Waiting for logs. To exit press CTRL+C');

                req.body.keys.forEach(function(severity) {
                    ch.bindQueue(q.queue, ex, severity);
                });

                ch.consume(q.queue, function(msg) {
                    res.send(msg);
                }, {noAck: true});
            });
        });
    });

});

module.exports = router;