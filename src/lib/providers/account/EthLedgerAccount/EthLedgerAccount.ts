import EthApp from '@ledgerhq/hw-app-eth';
import Transport from "@ledgerhq/hw-transport";
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { ethers } from 'ethers';

import { AddressOptions, ETHAddress } from "../../../utils";
import { AccountProvider } from "../AccountProvider";

const CONNECT_POLL_INTERVAL = 3000 // ms
const CONNECT_POLL_ATTEMPTS = 10 // attempts

const COIN_TYPE = ETHAddress.coinType()

export class EthLedgerAccount extends AccountProvider {

  public readonly ethApp: typeof EthApp
  public readonly publicKey: string
  public readonly scriptHash: string
  public readonly displayAddress: string

  private static _connectPolling = false

  private constructor(ethApp: typeof EthApp, publicKey: string, address: string) {
    super()
    this.ethApp = ethApp
    this.publicKey = publicKey
    this.scriptHash = ETHAddress.publicKeyToScriptHash(publicKey)
    this.displayAddress = address
  }

  static async connect() {
    const usbDevices = await this.getUSBDevices()

    if (!usbDevices.length) {
      throw new Error('Could not connect to USB Ledger')
    }

    const usbDevice = usbDevices[0]
    let connectResult: [typeof EthApp, string, string] | null = null
    let connectionAttempts = 0

    EthLedgerAccount._connectPolling = true

    while (connectionAttempts < CONNECT_POLL_ATTEMPTS) {
      connectionAttempts++

      // external signal to stop polling (e.g. timeout)
      // exit loop
      if (!EthLedgerAccount._connectPolling) {
        break
      }

      // attempt ccnnect
      connectResult = await new Promise((resolve, reject) => {
        let timedOut = false

        // start timeout to kill connection when interval duration
        // is reached. Kills connection by resolving 
        let timeoutId = setTimeout(() => {
          // set timeout to true so that if connection is successful
          // after timeout, it can be ignored.
          timedOut = true

          // returns null result to indicate connection failure
          resolve(null)
        }, CONNECT_POLL_INTERVAL)

        EthLedgerAccount.tryConnect(usbDevice).then(result => {
          // check for timeout signal, abandon result if timed out
          if (timedOut) return

          // clear timeout timer, so it doesn't trigger timeout action
          clearTimeout(timeoutId)

          // return positive connection result
          resolve(result)
        }).catch(reject)
      })

      // connection successful, exit loop
      if (connectResult) {
        break
      }
    }

    // failed to connect after specified timeout
    if (!connectResult) {
      throw new Error('Failed to connect with USB device, please try again.')
    }

    const [ledger, publicKey, address] = connectResult
    return new EthLedgerAccount(ledger, publicKey, address)
  }

  /**
   * Used to try connecting with ledger, executes a public key request
   * on USB device to detect ETH app connection
   */
  private static async tryConnect(usbDevice: string): Promise<[typeof EthApp, string, string]> {
    try {
      const bipString = EthLedgerAccount.getETHBIP44String()
      const ledger = await TransportWebUSB.open(usbDevice)

      // get public key to assert that NEO app is open
      const ethApp = new EthApp(ledger)
      const { publicKey, address } = await ethApp.getAddress(bipString)

      return [ethApp, publicKey, address]
    } catch (err) {
      if (err.statusCode) {
        throw new Error('ETH app is not open')
      }

      throw err
    }
  }

  configureAddress(options: AddressOptions) {
    this.options = options
  }

  private static getETHBIP44String(address = 0, change = COIN_TYPE, account = 44): string {
    return `${account}'/${change}'/${address}'/0/0`
  }

  async privateKey(): Promise<string> {
    throw new Error('Cannot retrieve private key from Ledger')
  }

  async sign(msg: string) {
    const bipString = EthLedgerAccount.getETHBIP44String()
    const ethApp = this.useEthApp()
    const result = await ethApp.signPersonalMessage(bipString, msg)
    const signature = ethers.utils.joinSignature({
      v: result.v,
      r: `0x${result.r}`,
      s: `0x${result.s}`,
    })
    return signature
  }

  async signTransaction(msg: string) {
    const bipString = EthLedgerAccount.getETHBIP44String()
    const ethApp = this.useEthApp()
    const result = await ethApp.signTransaction(bipString, msg)
    const signature = ethers.utils.joinSignature({
      v: parseInt(result.v, 16),
      r: `0x${result.r}`,
      s: `0x${result.s}`,
    })
    return signature
  }

  private static async getUSBDevices() {
    const devices = await this.getDevicePaths(TransportWebUSB as any)

    return devices
  }

  private useEthApp() {
    if (!this.ethApp) {
      throw new Error('Ledger is not initialized')
    }

    return this.ethApp
  }

  private static async getDevicePaths(
    ledgerLibrary: typeof Transport
  ): Promise<ReadonlyArray<string>> {
    const supported = await ledgerLibrary.isSupported();
    if (!supported) {
      throw new Error(`Your computer does not support the ledger!`);
    }
    return await ledgerLibrary.list();
  }
}
