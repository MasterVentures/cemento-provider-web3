import 'jasmine';
import { CementoContract, CementoProvider, CementoModule, IMethodOrEventCall, Read, Write, EventFilterOptions, GetEvents } from '@paid-network/cemento';
import { Web3Plugin, Web3Settings, Web3CementoTopic } from '../src';
const Web3 = require('web3');
const CocoTokenImport = require('./CocoToken.json')

describe('Web3Provider', () => {
    console.log("Web3Provider");
    describe('#Web3Plugin', () => {
        console.log("#Web3Plugin");
        let web3;
        let tokenContract;
        beforeEach(async () => {
            const privateKey = '';
            const network = 'development';
            const defaultAccount = '0xae5ba923447cb11f2a94b66dff878b0d7cfdd13c';
            const node = 'http://localhost:8545';
            web3 = {
                eth: {
                    Contract: function() {},
                    accounts: {
                        wallet: {
                            add: jasmine.createSpy()
                        },
                        signTransaction: jasmine.createSpy('signTransaction')
                    }
                }
            } as any;
            // Create Cemento Module
            console.log("#################################");
            console.log("web3.spec.ts -> Create Cemento Module");
            const module = new CementoModule({
                'Paid': {
                    connections: [{
                        provider: Web3Plugin,
                        defaultAccount,
                        chainId: '4',
                        name: 'web3'
                    }],
                    contracts: [{
                        name: 'CocoToken',
                        abi: CocoTokenImport.abi,
                        address: '0xa729a3a5f65C9aF4934bfd0F4dfCE3898cE0ddA3',
                        connectionName: ['web3'],
                    }],
                },
            });
            console.log("web3.spec.ts -> bindContracts");
            const contracts = module.bindContracts();
            console.log("web3.spec.ts -> getDynamicContract");
            expect(contracts).not.toBe(null);
            expect(Array.isArray(contracts)).toBe(true);
            const token = contracts[0] as CementoContract & CementoProvider;
            tokenContract = token;
            token.onReady<Web3Settings>({
                privateKey,
                network,
                web3
            });
            
            console.log("web3.spec.ts -> expect:",token.address);
            expect(token.address).toBeDefined();
        });
        console.log("web3.spec.ts -> should generate topics for Connex");
        it('should generate topics for Connex', async () => {
            console.log("O*******************");
            const topics = new Web3CementoTopic();

            const seq = topics
                .topic('0xc')
                .and('0xb')
                .or('0xa')
                .get();

            expect(seq[0].length).toBe(2);
        });
        console.log("web3.spec.ts -> should create a Read(), execute it and return a response");
        it('should create a Read(), execute it and return a response', async () => {
            console.log("1*******************");
            // Mock
            const obj = {
                callMethod: jasmine.createSpy('callMethod')
            };
            const options: IMethodOrEventCall = {};
            const thunk = Read(options);
            thunk(obj, 'balanceOf');
            expect((obj as any).balanceOf).toBeDefined();
            (obj as any).balanceOf();
            expect(obj.callMethod.calls.count()).toBe(1);
        });
        console.log("web3.spec.ts -> should create a Write() and return a Promise");
        it('should create a Write() and return a Promise', async () => {
            console.log("2*******************");
            const signerMock: any = {
                requestSigning: jasmine.createSpy('requestSigning')
            };
            // Mock
            const obj = {
                prepareSigning: jasmine
                    .createSpy('prepareSigning')
                    .and.returnValue(Promise.resolve(signerMock)),
                getMethod: jasmine.createSpy('getMethod')
            };
            const thunk = Write();
            thunk(obj, 'transfer');
            expect((obj as any).transfer).toBeDefined();
            (obj as any).transfer([]);
            //expect(obj.getMethod.calls.count()).toBe(1);
            //expect(obj.prepareSigning.calls.count()).toBe(1);
        });
        console.log("web3.spec.ts -> should prepare signing and call signTransaction");
        it('should prepare signing and call signTransaction', async () => {
            console.log("3*******************");
            const methodCall =  jasmine.createSpy()
                .and.returnValue({
                    call: () => Promise.resolve(true),
                    encodeABI: () => '0x6fc82f0b3531353536323337303235000000000000000000000000000000000000000000000000000000000000000000bdca9e6d4d9c7dc7774e84c98617b40869d354680000000000000000000000000000000000000000000000000000000000000003'
                })
            const values = [0, 1, 2];
            tokenContract.prepareSigning(methodCall, {}, values)
            expect(methodCall).toHaveBeenCalled();
        });
        console.log("web3.spec.ts -> should create a GetEvents(), execute it and return a response");
        it('should create a GetEvents(), execute it and return a response', async () => {
            console.log("4*******************");
            // Mock
            const obj = {
                getEvents: jasmine.createSpy('getEvents')
            };
            const options: EventFilterOptions<any> = {};
            const thunk = GetEvents(options);
            thunk(obj, 'logNewTransfer');
            expect((obj as any).logNewTransfer).toBeDefined();
            (obj as any).logNewTransfer();
            expect(obj.getEvents.calls.count()).toBe(1);
        });
    });
});
