const router = require('express').Router();
var plivo = require('plivo');

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

router.post('/answer_url', async (req, res) => {

    var params = {
        TableName: "call_records",
        Key: {
            "callId": req.query.callId,
        },
        UpdateExpression: "set call_status = :call_status",
        ExpressionAttributeValues: {
            ":call_status": "in-progress",
        },
        ReturnValues: "UPDATED_NEW"
    };

    //updateing the call status to in progress
    docClient.update(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });

    var response = plivo.Response();

    var params = {
        'schedule': req.query.schedule,
        'reason': "rejected"
    };

    response.addHangup(params);

    var speak_params = {
        'loop': req.query.schedule
    };

    var speak_body = "Hello awesome World";
    response.addSpeak(speak_body, speak_params);

    res.set('Content-Type', 'text/xml');
    res.status(200).send(response.toXML());
});

router.post('/hangup_url', async (req, res) => {
    console.log("In hangup url " + req.query.callId);
    var params = {
        TableName: "call_records",
        Key: {
            "callId": req.query.callId,
        },
        UpdateExpression: "set call_status = :call_status",
        ExpressionAttributeValues: {
            ":call_status": "completed",
        },
        ReturnValues: "UPDATED_NEW"
    };
    //updateing the call status completed
    docClient.update(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
    console.log("Hey the call is hangedup");
    return res.status(201);
});

module.exports = router;