import express from 'express';
import bodyParser from 'body-parser';

const APP_PORT = process.env.APP_PORT ?? '5001';

const app = express();
app.use(bodyParser.json({ type: 'application/*+json' }));

app.get('/dapr/subscribe', (_req, res) => {
    res.json([
        {
            pubsubname: "orderpubsub",
            topic: "orders",
            route: "orders",
            metadata: { 
                // rawPayload: "true",
                // maxBulkCount: "4", 
                // maxBulkLatencyMilliSeconds: "100000",
            //     // maxBatchSizeInBytes: "",
                // bulkSubscribe: "true",
            }, 
            // routes:{
            //     // "default":"event/pubsub/TestTIntegrationEvent/v1",
            //     "rules":[
            //         {
            //             // match:'event.type == "com.dapr.event.sent"',
            //             match: 'event == "hellozzzzzz worldieeeeee"',
            //             path:"orders"
            //         }
            //     ]
            // },
            deadLetterTopic: "TestdeadLetterTEvent"
    
        },
        // {
        //     pubsubname: "orderpubsub",
        //     topic: "ordersAgain",
        //     route: "ordersAgain",
        //     metadata: { 
        //         rawPayload: "true",
        //         maxBatchSize: "10", 
        //         bulkSubscribe: "true",
        //     } 
          
        // }
    ]);
});

// Dapr subscription routes orders topic to this route
app.post('/orders', (req, res) => {
    console.log("============================New batch received==================Size: ", req.body.data.length);
    let output = [];
    let tmp;
    for(let event in req.body.data) {        
        console.log("Subscriber received:", req.body.data[event].event);
        tmp = {"status" : "SUCCESS", "entryID": req.body.data[event].entryID};
        output.push(tmp);
    }
    res.status(200).json({"statuses": output})
});

app.listen(APP_PORT);
  
