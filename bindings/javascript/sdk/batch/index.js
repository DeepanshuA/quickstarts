/*
Copyright 2021 The Dapr Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { DaprClient, DaprServer, CommunicationProtocolEnum } from "@dapr/dapr";

const kafkaBindingName = "kafkabind";

const daprHost = process.env.DAPR_HOST || 'http://localhost';
const daprPort =  '3500';
const serverHost = "127.0.0.1";
const serverPort = '3000';

const client = new DaprClient(daprHost, daprPort);

const server = new DaprServer(serverHost, serverPort, daprHost, daprPort);

start().catch((e) => {
    console.error(e);
    process.exit(1);
});

async function start() {
    console.log("server port: ", serverPort)
    console.log("dapr port: ", daprPort)
    const server = new DaprServer({
        serverHost,
        serverPort,
        communicationProtocol: CommunicationProtocolEnum.HTTP,
        clientOptions: {
            daprHost,
            daprPort, 
        }
    });
    await server.binding.receive(kafkaBindingName, async (orderId) => console.log(`Received Message: ${JSON.stringify(orderId)}`));
    await server.start();

}