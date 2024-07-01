const SAFE_ADDRESS =
  process.env.REACT_APP_SAFE_ADDRESS ||
  "0x46abFE1C972fCa43766d6aD70E1c1Df72F4Bb4d1";
const WALLETCONNECT_BRIDGE_URL = "https://bridge.walletconnect.org";

// Chain configuration
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || "10";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || "Optimism Mainnet";
const CHAIN_RPC_URL =
  process.env.REACT_APP_RPC_URL || "https://mainnet.optimism.io";
const CHAIN_TOKEN_SYMBOL = process.env.REACT_APP_CHAIN_TOKEN_SYMBOL || "ETH";

const getChainId = (): number => {
  return parseInt(CHAIN_ID);
};

const getHexChainId = (): string => {
  return "0x" + getChainId().toString(16);
};

export {
  CHAIN_ID,
  CHAIN_NAME,
  CHAIN_RPC_URL,
  CHAIN_TOKEN_SYMBOL,
  SAFE_ADDRESS,
  WALLETCONNECT_BRIDGE_URL,
  getHexChainId,
  getChainId,
};
