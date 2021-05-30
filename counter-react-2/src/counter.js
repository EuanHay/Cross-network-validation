import CounterArtifact from './artifacts/Counter'
import {networks} from "./build/networks";
import {RelayProvider, resolveConfigurationGSN} from "@opengsn/gsn";
import Torus from "@toruslabs/torus-embed";
import Fortmatic from 'fortmatic';
import Authereum from 'authereum'
const ethers = require('ethers')



export async function initCounter() {
    const web3Provider = window.ethereum

    /*
    const torus = new Torus({});
    await torus.init({
        enableLogging: false,
    });
    await torus.login();
    await torus.setProvider({
        host: "rinkeby",
    });
    const web3Provider = torus.provider
     */

    /*
    const fm = new Fortmatic('pk_test_F102C7C5CFEAA086');
    const web3Provider = fm.getProvider()
     */


    /*
    const authereum = new Authereum('rinkeby')
    console.log(authereum)

    const web3Provider = authereum.getProvider()

     */

    if (!web3Provider)
        throw new Error( 'Do you have Metamask installed? https://metamask.io/')
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const network = await provider.getNetwork()


    let chainId = network.chainId;
    let net = networks[chainId]
    //for Address
    global.network = net
    const netid = await provider.send('net_version')
    console.log('chainid=',chainId, 'networkid=', netid)
    if (chainId !== parseInt(netid))
        console.warn(`Incompatible network-id ${netid} and ${chainId}: for Metamask to work, they should be the same`)
    if (!net) {
        if( chainId<1000 || ! window.location.href.match( /localhos1t|127.0.0.1/ ) )
            throw new Error( `Unsupported network (chainId=${chainId}) . please switch to one of: `+ Object.values(networks).map(n=>n.name).join(' / '))
        else
            throw new Error( 'To run locally, you must run "yarn evm" and then "yarn deploy" before "yarn react-start" ')
    }

    return new Counter(net.counter)
}

export class Counter {

    constructor(addr, signer, gsnProvider) {
        console.log("COSNTRUCTRO")
        console.log(addr)
        console.log(signer)
        console.log(gsnProvider)
        this.address = addr
        this.ethersProvider = signer.provider

        this.gsnProvider = gsnProvider
        this.theContract = new ethers.Contract(addr, CounterArtifact.abi, signer)
        this.blockDates = {}
    }


    async getCurrentFlagHolder() {
        return await this.theContract.currentHolder()
    }

    listenToEvents(onEvent, onProgress) {
        this.theContract.on('CountIncremented', async (form,to,event) => {
            const info = await this.getEventInfo(event)
            onEvent(info);
        })
        this.gsnProvider.registerEventListener(onProgress)
    }

    stopListenToEvents(onEvent, onProgress) {
        this.theContract.off(onEvent)
        this.gsnProvider.unregisterEventListener(onProgress)
    }

    async getBlockDate(blockNumber) {
        if ( ! this.blockDates[blockNumber]) {
            this.blockDates[blockNumber] = new Date(await this.ethersProvider.getBlock(blockNumber).then(b=> {
                return b.timestamp * 1000
            }))
        }
        return this.blockDates[blockNumber]
    }
    async getCount() {
        return await this.theContract.getCount()
    }

    async getEventInfo(e) {
        if ( !e.args ) {
            console.log('==not a valid event: ', e)
            return {
                previousHolder: 'notevent',
                currentHolder: JSON.stringify(e)
            }
        }
        return {
            date: await this.getBlockDate(e.blockNumber),
            previousHolder: e.args.previousHolder,
            currentHolder: e.args.currentHolder
        }
    }

    async getPastEvents(count = 5) {

        const logs = await this.theContract.queryFilter('CountIncremented', 1)
        const lastLogs = await Promise.all(logs.slice(-count).map(e=>this.getEventInfo(e)))
        return lastLogs
    }

    getSigner() {
        return this.theContract.signer.getAddress()
    }

    async increment() {
        return await this.theContract.incrementCounter()
    }
}
