import { AddressOptions } from "../../utils";

export abstract class AccountProvider<T extends AddressOptions = AddressOptions> {
  public options: AddressOptions = {}
  public readonly publicKey: string
  public readonly scriptHash: string
  public readonly displayAddress: string

  protected constructor() {}

  static async connect(): Promise<any> {
    throw new Error('Connect initialization for this provider')
  }

  configureAddress(_options: T): void {
    throw new Error('Configure address not implemented for this provider')
  }

  abstract async privateKey(): Promise<string>
  abstract async sign(msg: string): Promise<string>
}
