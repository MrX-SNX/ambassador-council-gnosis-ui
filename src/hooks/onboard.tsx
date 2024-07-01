import injectedModule from "@web3-onboard/injected-wallets";
import trezor from "@web3-onboard/trezor";
import initWalletConnect from "@web3-onboard/walletconnect";
import ledger from "@web3-onboard/ledger";
import Onboard from "@web3-onboard/core";
import {
  CHAIN_NAME,
  CHAIN_RPC_URL,
  CHAIN_TOKEN_SYMBOL,
  getHexChainId,
} from "../utils/configurations";
import { useConnectWallet } from "@web3-onboard/react";

const injected = injectedModule();
const wc = initWalletConnect({ projectId: "b8433306393b78ff75897e7f76f7d411" });
const t = trezor({ email: "max@cc.snxdao.io", appUrl: window.location.host });
const l = ledger({
  projectId: "b8433306393b78ff75897e7f76f7d411",
  walletConnectVersion: 2,
});

const onboard = Onboard({
  wallets: [injected, wc, t, l],
  chains: [
    {
      id: getHexChainId(),
      token: CHAIN_TOKEN_SYMBOL,
      label: CHAIN_NAME,
      rpcUrl: CHAIN_RPC_URL,
    },
  ],
});

const useOnbard = () => {
  const isConnected = useConnectWallet();
  return { isConnected };
};

export { useOnbard };
