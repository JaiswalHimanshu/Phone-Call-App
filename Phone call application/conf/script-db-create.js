process.env.NODE_ENV = 'localhost';

let AWS = require('aws-sdk');

let dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: "us-east-1",
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient({
    region: dynamodb.config.region,
    endpoint: dynamodb.config.endpoint,
    convertEmptyValues: true
});

let tables = [
    {
        tableName: 'call_records',
        keySchema: {
            hash: 'callId',
            type: 'S'
        }
    }
];
//
tables = tables.map((element) => {
    let KeySchema = [],
        AttributeDefinitions = [];

    if (element.keySchema.hash) {
        KeySchema.push({
            AttributeName: element.keySchema.hash,
            KeyType: 'HASH'
        });

        AttributeDefinitions.push({
            AttributeName: element.keySchema.hash,
            AttributeType: element.keySchema.type
        });
    }
    if (element.keySchema.range) {
        KeySchema.push({
            AttributeName: element.keySchema.range,
            KeyType: 'RANGE'
        });

        AttributeDefinitions.push({
            AttributeName: element.keySchema.range,
            AttributeType: element.keySchema.rtype
        });
    }
    return {
        TableName: element.tableName,
        KeySchema,
        AttributeDefinitions,
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    };
});

tables.forEach(async (params) => {
    // try {
    //     await dynamodb
    //         .deleteTable({
    //             TableName: params.TableName
    //         })
    //         .promise();
    // } catch (error) {
    //     console.log('deleteTable ' + params.TableName + ' ', error);
    // }

    dynamodb.createTable(params, function (err, data) {
        if (err) console.log(err);
        else console.log('Created', data);
    });
});
