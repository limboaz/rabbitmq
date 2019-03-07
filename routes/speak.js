#!/usr/bin/env node
var express = require('express');
var router = express.Router();

var amqp = require('amqplib/callback_api');

router.post('/', function (req, res) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'hw3';
            var msg = req.body.msg;
            var severity = req.body.key;

            ch.assertExchange(ex, 'direct', {durable: false});
            ch.publish(ex, severity, new Buffer(msg));
            console.log(" [x] Sent %s: '%s'", severity, msg);
        });

        setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
});
