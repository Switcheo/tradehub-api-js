// declare module 'sha.js'

declare module 'ledger-cosmos-js' {
  interface CommunicationMethod {}

  export class CosmosLedgerJS {
    constructor(communicationMethod: CommunicationMethod)

    getVersion: () => {
      major: Number
      minor: Number
      patch: Number
      test_mode: Boolean
      error_message: string
      device_locked: Boolean
    }
    publicKey: (
      hdPath: Array<Number>
    ) => {
      compressed_pk: Buffer
      error_message: string
    }
    showAddressAndPubKey: (
      bech32Prefix: string,
      hdPath: Array<Number>
    ) => {
      compressed_pk: Buffer
      address: string
      error_message: string
    }
    appInfo: () => {
      appName: string
      error_message: string
    }
    sign: (
      hdPath: Array<Number>,
      signMessage: string
    ) => {
      signature: Buffer
      error_message: string
    }
  }
}
