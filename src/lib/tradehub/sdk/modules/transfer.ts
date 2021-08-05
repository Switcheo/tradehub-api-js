import { RestModels } from "@lib/tradehub/models";
import BaseModule from "./module";

class ModTransfer extends BaseModule {
  public async getFee(denom: string): Promise<RestModels.FeeResult> {
    const config = this.sdkProvider.networkConfig;
    const request = await fetch(`${config.FeeURL}/fees?denom=${denom}`);
    const response = await request.json() as RestModels.FeeResult
    return response;
  }
}

export default ModTransfer;
