import React, { useState, useEffect, useCallback } from 'react';
import { PublicAddress, Button } from 'rimble-ui';

export default function Web3Info(props) {
  const { context } = props;
  const { networkId, networkName, accounts, providerName, lib } = context;

  const [balance, setBalance] = useState(0);

  const getBalance = useCallback(async () => {
    let balance =
      accounts && accounts.length > 0 ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), 'ether') : 'Unknown';
    setBalance(balance);
  }, [accounts, lib.eth, lib.utils]);

  useEffect(() => {
    getBalance();
  }, [accounts, getBalance, networkId]);

  const requestAuth = async web3Context => {
    try {
      await web3Context.requestAuth();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h3> {props.title} </h3>
      <div>
        <div>Network:</div>
        <div>{networkId ? `${networkId} – ${networkName}` : 'No connection'}</div>
      </div>
      <div>
        <div>Your address:</div>
        <div>
          <PublicAddress label="" address={accounts && accounts.length ? accounts[0] : 'Unknown'} />
        </div>
      </div>
      <div>
        <div>Your ETH balance:</div>
        <div>{balance}</div>
      </div>
      <div>
        <div>Provider:</div>
        <div>{providerName}</div>
      </div>
      {accounts && accounts.length ? (
        <div>
          <div>Accounts & Signing Status</div>
          <div>Access Granted</div>
        </div>
      ) : !!networkId && providerName !== 'infura' ? (
        <div>
          <br />
          <Button onClick={() => requestAuth(context)}>Request Access</Button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
