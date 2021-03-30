import { IMethodOrEventCall, EventFilter, ProviderInstance, CementoProviderType } from '@decent-bet/cemento';
import { Web3Settings } from './Web3Settings';
import { CementoProvider } from '@decent-bet/cemento';
import { CementoContract, CementoSigner } from '@decent-bet/cemento';
export declare class Web3Plugin extends CementoProvider implements CementoContract {
    private web3;
    network: string;
    private instance;
    defaultAccount: string;
    address: string;
    private privateKey;
    getProviderType(): CementoProviderType;
    onReady<T>(settings: T & Web3Settings): void;
    connect(): void;
    setInstanceOptions(settings: ProviderInstance): void;
    prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]): Promise<CementoSigner>;
    getAbiMethod(name: string): object;
    callMethod(name: string, args: any[]): any;
    getMethod(name: string): any;
    getEvent(name: string): any;
    getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P)[]>;
}
