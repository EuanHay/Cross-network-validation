import React from 'react';
import {initCounter} from '../../counter'
import {Address, sleep, Log, Progress} from "../utils";
import {GsnStatus} from "../GSNStatus";


class Counter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    async readContractInfo() {
        const counter = await initCounter()

        const [current, events, account] = await Promise.all([
            counter.getCount(),
            counter.getPastEvents(),
            counter.getSigner()
        ])
        this.setState({
            count: current.toNumber(),
            account,
            current,
            contractAddress: counter.address,
            events: this.prependEvents(null, events),
        })

        counter.listenToEvents(event => {
            this.log(event)
        }, ({event, step, total}) => {
            this.progress({event,step,total})
        })

        this.counter = counter
    }

    progress({event, step, total, error}) {
        this.setState({status: event, step, total, error})
    }

    prependEvents(currentEvents, newEvents) {
        return [...newEvents.reverse(), ...(currentEvents || [])].slice(0, 5)
    }

    log(event) {
        this.setState({events: this.prependEvents(this.state.events, [event])})
    }

    async componentDidMount() {
        await this.readContractInfo()
            .catch(e => {
                console.log('ex=', e);
                this.setState({error: e.message})
            })
    }

    componentWillUnmount() {
        this.counter.stopListenToEvents()
    }

    async simSend() {
        for (let i = 1; i <= 8; i++) {
            this.setState({step: i, total: 8, status: null})
            await sleep(500)
        }
        this.setState({status: 'Mining'})
        await sleep(300)
        this.setState({status: 'done'})
    }

    async changeCount() {
        this.setState({status: 'sending'})
        const res = await this.counter.increment()
        this.setState({status: "txhash=" + res.hash.slice(0, 20) + ' waiting for mining'})
        const res2 = await res.wait()
        this.setState({total: null, step: null, status: 'Mined in block: ' + res2.blockNumber})
        const current = await Promise.all([
            this.counter.getCount()])
        this.setState({
            count: current[0].toNumber()
        })
    }

    render() {
        return (
            <div>
                <h1>Standard Blockchain Transactions</h1>
                <button onClick={() => {this.changeCount()}}>Increment Counter</button>
                <h3>Your account:<Address addr={this.state.account}/> <br/></h3>
                <h3>Counter Contract: <Address addr={this.state.contractAddress}/><br/></h3>
                <h3>Current Count: {this.state.count}</h3>

                {this.state.error ?
                    <font color="red">Error: {this.state.error}</font>
                    :
                    <Progress step={this.state.step} total={this.state.total} status={this.state.status}/>
                }

                <div style={{textAlign:"left"}} >
                    <Log events={this.state.events}/>
                </div>
            </div>
        )
    }
}

export default Counter
