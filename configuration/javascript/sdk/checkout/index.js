import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';

const DAPR_HOST = process.env.DAPR_HOST || "127.0.0.1";
const DAPR_GRPC_PORT = process.env.DAPR_GRPC_PORT || "50002";
const CONFIG_NAME = "configurer";

async function main() {
  const client = new DaprClient(DAPR_HOST, DAPR_GRPC_PORT, CommunicationProtocolEnum.GRPC);

  const fetchedConfig = await client.configuration.get(CONFIG_NAME);
  for(let config in fetchedConfig.items) {        
    console.log("Configuration received initially for key:", fetchedConfig.items[config].key,":", fetchedConfig.items[config].value.trim());
  }

    await client.configuration.subscribe(CONFIG_NAME, (configMap) => {
      for(let config in configMap.items) {        
        console.log("Configuration updated for key:", configMap.items[config].key,":", configMap.items[config].value.trim());
      }
    })
}
main().catch(e => console.error(e))