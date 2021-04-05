import { CementoSigner } from '@decent-bet/cemento';
export declare class Web3Signer implements CementoSigner {
    private web3;
    private fn;
    private from;
    gas: number;
    constructor(web3: any, fn: any, from: any, options: any);
    requestSigning(): Promise<any>;
}
