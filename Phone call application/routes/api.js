const router = require('express').Router();
var plivo = require('plivo');
var client = new plivo.Client(process.env.PLIVO_AUTH_ID, process.env.PLIVO_AUTH_TOKEN);

let AWS = require('aws-sdk');

let dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.DB_REGION,
    endpoint: process.env.DB_ENDPOINT
});

let docClient = new AWS.DynamoDB.DocumentClient({
    region: dynamodb.config.region,
    endpoint: dynamodb.config.endpoint,
    convertEmptyValues: true
});

router.post('/initiate_call', async (req, res) => {
    (function main() {
        client.calls.create(
            req.body.fromNumber, // from +918884655316
            req.body.toNumber, // to  +918088355401
            "http://7279c40f2445.ngrok.io/api/answer_url?&schedule=" + req.body.duration + "&callId=" + req.body.callId, // answer url
            {
                hangup_url: "http://7279c40f2445.ngrok.io/api/hangup_url?callId=" + req.body.callId // hangup url
            },
        ).then(function (response) {

            var params = {
                TableName: "call_records",
                Item: {
                    callId: req.body.callId,
                    call_status: "ringing",
                    fromName: req.body.fromName,
                    toName: req.body.toName,
                    fromNumber: req.body.fromNumber,
                    toNumber: req.body.toNumber,
                    duration: req.body.duration
                }
            };

            docClient.put(params, function (err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                }
            });
            res.json(response);
        }, function (err) {
            console.error(err);
            res.json({ msg: "error: cannot initiate call" });
        });
    })();
});

router.get('/call_status', async (req, res) => {
    var params = {
        TableName: "call_records",
        Key: {
            "callId": req.query.callId,
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            res.json(data)
        }
    });
});

module.exports = router;