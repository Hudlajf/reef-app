import React from 'react';
import {
  TokenWithAmount, utils as reefUtils, utils, appState, hooks, Token, ReefSigner,
} from '@reef-defi/react-lib';
import { Balance } from './Balance';
import { ActionButtons } from './ActionButtons';
import './Dashboard.css';
import { TokenBalances } from './TokenBalances';
import { TokenActivity } from './TokenActivity';
import { Nfts } from './Nfts';
import { Staking } from './Staking';

const {
  DataProgress, isDataSet,
} = reefUtils;

const Dashboard = (): JSX.Element => {
  const signerTokenBalances: TokenWithAmount[]|undefined = hooks.useObservableState(appState.tokenPrices$);
  const signerNfts: Token|undefined = hooks.useObservableState(appState.selectedSignerNFTs$);
  const selectedSigner: ReefSigner|undefined = hooks.useObservableState(appState.selectedSigner$);

  const totalBalance: reefUtils.DataWithProgress<number> = isDataSet(signerTokenBalances) && signerTokenBalances?.length ? (signerTokenBalances).reduce((state: reefUtils.DataWithProgress<number>, curr) => {
    if (Number.isNaN(curr.balance) || Number.isNaN(curr.price) || !isDataSet(curr.balance)) {
      return state;
    }
    const balVal = utils.calculateBalanceValue(curr);
    if (!Number.isNaN(balVal) && isDataSet(balVal)) {
      const stateNr = isDataSet(state) ? state as number : 0;
      return stateNr + (balVal as number);
    }
    return state;
  }, DataProgress.LOADING) : DataProgress.LOADING;

  return (
    <div className="w-100">
      <div className="mb-4 row">
        <Balance balance={totalBalance} />
        <ActionButtons />
      </div>
      <div className="row">
        <div className="col-lg-8 col-sm-12 col-md-6">
          <TokenBalances tokens={signerTokenBalances as utils.DataWithProgress<TokenWithAmount[]>} />
          {/*<Nfts />*/}
          <Staking />
        </div>
        <div className="col-lg-4 col-sm-12 col-md-6"><TokenActivity address={selectedSigner?.evmAddress} /></div>
      </div>
    </div>
  );
};

export default Dashboard;
