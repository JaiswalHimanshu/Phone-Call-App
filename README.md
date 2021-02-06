# Phone-call-application

This application is be used to make calls from one person to another person given the phone numbers

## Prerequisite

- In order to run this application you need following things
- `Nodejs` visit this [link](https://nodejs.org/en/download/) to download and install Nodejs
- `Java` to run dynamodb
- `Dynamodb` download [link](https://s3.ap-south-1.amazonaws.com/dynamodb-local-mumbai/dynamodb_local_latest.zip) after downloading and unzipping run the command

```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

- `ngrok` use this command **npm install ngrok -g** to install it globally on you system

## Note

- The repo consists of three folders named **Phone call application mid server**, **Phone call application** and **Phone call vue app**
- The first two are node applications where as the last one is a Vue app
- After staring all the application server and dynamodb
- Copy the **ngrok** generated http URL and replace it like shown below in **Phone call application** project _api.js_ file

```
            req.body.toNumber,
            "<ngrok url>/api/answer_url?&schedule=" + req.body.duration + "&callId=" + req.body.callId,
            {
                hangup_url: "<ngrok url>/api/hangup_url?callId=" + req.body.callId
            },
```

- Example(snippet of api.js file)

```
            req.body.toNumber,
            "http://7279c40f2445.ngrok.io/api/answer_url?&schedule=" + req.body.duration + "&callId=" + req.body.callId,
            {
                hangup_url: "http://7279c40f2445.ngrok.io/api/hangup_url?callId=" + req.body.callId
            },
```

- After the replacement dont forget to restart the **Phone call application**
