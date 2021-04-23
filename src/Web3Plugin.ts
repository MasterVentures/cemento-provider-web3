// eslint-disable-next-line spaced-comment
import Web3 from 'web3';
import {
  IMethodOrEventCall,
  EventFilter,
  CementoProviderType,
  CementoProvider,
  CementoContract,
  CementoSigner,
  CementoTopic,
  ProviderInstance
} from '@paid-network/cemento';
import { Web3Signer } from './Web3Signer';
import { Web3Settings } from './Web3Settings';
/**
 * Web3Plugin provider for Cemento
 */
export class Web3Plugin extends CementoProvider implements CementoContract {

  private web3: Web3;
  public network: string;
  private instance: any;
  public defaultAccount: string;
  public address: string;
  public chainId: string;
  private privateKey: string;

  public getProviderType(): CementoProviderType {
    return CementoProviderType.Web3;
  }
  describe(): string {
    throw new Error('Method not implemented.');
  }
  onReady<T>(settings: T & Web3Settings) {
    console.log("Web3Plugin->onReady");
    const { privateKey, web3, network } = settings;
    this.privateKey = privateKey;
    this.web3 = web3;
    this.network = network;
    this.connect();
  }
  public connect() {
    console.log("Web3Plugin->connect");
    if (this.web3 && this.network && this.defaultAccount) {
        this.instance = new this.web3.eth.Contract(
            this.bindContract.abi as any,
            this.bindContract.address
          );
          this.address = this.bindContract.address;
          if (this.privateKey) {
            this.web3.eth.accounts.wallet.add(this.privateKey);
          }
          console.log("Web3Plugin->connect this.address::",this.address);
    } else {
      throw new Error('Missing onReady settings');
    }
  }

  public setInstanceOptions(settings: ProviderInstance) {
    this.web3 = settings.provider;
    if (settings.options.network) {
      this.network = settings.options.network;
    }
    if (settings.options.defaultAccount) {
      this.defaultAccount = settings.options.defaultAccount;
    }
    if (settings.options.privateKey) {
      this.privateKey = settings.options.privateKey;
    }
  }

  async prepareSigning(
    methodCall: any,
    options: IMethodOrEventCall,
    args: any[]
  ): Promise<CementoSigner> {
    let gas = options.gas;

    if (!options.gas) gas = 1000000;

    // get method instance with args
    const fn = methodCall(...args);

    return new Web3Signer(this.web3, fn, this.defaultAccount, {
      gas
    });
  }

  getAbiMethod(name: string): object {
    return this.abi.filter(i => i.name === name)[0];
  }

  callMethod(name: string, args: any[]): any {
    let addr;
    addr = this.bindContract.address;
    return this.instance.methods[name](...args).call({
      from: addr
    });
  }
  /**
   * Gets a Web3 Method object
   * @param name method name
   */
  getMethod(name: string): any {
    return this.instance.methods[name];
  }

  /**
   * Gets a Connex Event object
   * @param address contract address
   * @param eventAbi event ABI
   */
  getEvent(name: string): any {
    return this.instance.events[name];
  }

  public async getEvents<P, T>(
    name: string,
    eventFilter?: EventFilter<T & any>
  ): Promise<(P)[]> {
    const options: any = {};
    if (eventFilter) {
      const { range, filter, topics, order, pageOptions, blocks } = eventFilter;
      if (filter) {
        options.filter = filter;
      }

      if (blocks) {
        const { fromBlock, toBlock } = blocks;
        options.toBlock = toBlock;
        options.fromBlock = fromBlock;
      }

      if (range) {
        options.range = range;
      }

      if (topics) {
        options.topics = (topics as CementoTopic).get();
      }

      options.order = order || 'desc';

      if (pageOptions) {
        options.options = pageOptions;
      }
    }

    return await this.instance.getPastEvents(name, options);
  }
}
