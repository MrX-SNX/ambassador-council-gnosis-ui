import { useState, useEffect } from "react";
import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import { Web3Wallet as Web3WalletType } from "@walletconnect/web3wallet/dist/types/client";

const compatibleSafeMethods = [
  "eth_accounts",
  "net_version",
  "eth_chainId",
  "personal_sign",
  "eth_sign",
  "eth_signTypedData",
  "eth_signTypedData_v4",
  "eth_sendTransaction",
  "eth_blockNumber",
  "eth_getBalance",
  "eth_getCode",
  "eth_getTransactionCount",
  "eth_getStorageAt",
  "eth_getBlockByNumber",
  "eth_getBlockByHash",
  "eth_getTransactionByHash",
  "eth_getTransactionReceipt",
  "eth_estimateGas",
  "eth_call",
  "eth_getLogs",
  "eth_gasPrice",
  "wallet_getPermissions",
  "wallet_requestPermissions",
  "safe_setSettings",
];

const EVMBasedNamespaces = "eip155";

const core = new Core({
  projectId: "b8433306393b78ff75897e7f76f7d411",
});

export const useWalletConnect = () => {
  const [wallet, setWallet] = useState<Web3WalletType | undefined>(undefined);
  const [wcSession, setWcSession] = useState<{ expiry: number }>();
  const createWallet = async () => {
    const web3Wallet = await Web3Wallet.init({
      core,
      metadata: {
        name: "Ambassador Council",
        description: "Safe integration for Ambassador Council",
        url: "https://ambassador-council.web.app/",
        icons: [],
      },
    });
    console.info("wallet created");
    setWallet(web3Wallet);
  };

  useEffect(() => {
    if (wallet) {
      // we try to find a compatible active session
      const activeSessions = wallet.getActiveSessions();
      const compatibleSession = Object.keys(activeSessions)
        .map((topic) => activeSessions[topic])
        .find(
          (session) =>
            session?.namespaces[EVMBasedNamespaces]?.accounts[0] ===
            `${EVMBasedNamespaces}:10:0x46abFE1C972fCa43766d6aD70E1c1Df72F4Bb4d1`,
        );

      if (compatibleSession) {
        console.log("found session", compatibleSession);
        setWcSession(compatibleSession);
      }

      // events
      wallet.on("session_proposal", async (proposal) => {
        console.log(proposal);
        const { id, params } = proposal;
        const { requiredNamespaces } = params;
        const safeAccount = `${EVMBasedNamespaces}:${10}:0x46abFE1C972fCa43766d6aD70E1c1Df72F4Bb4d1`;
        const safeChain = `${EVMBasedNamespaces}:${10}`;
        const safeEvents = requiredNamespaces[EVMBasedNamespaces]?.events || [];

        try {
          const wcSession = await wallet.approveSession({
            id,
            namespaces: {
              eip155: {
                accounts: [safeAccount], // only the Safe account
                chains: [safeChain], // only the Safe chain
                methods: compatibleSafeMethods, // only the Safe methods
                events: safeEvents,
              },
            },
          });

          setWcSession(wcSession);
        } catch (error: any) {
          console.log("error: ", error);

          await wallet.rejectSession({
            id: proposal.id,
            reason: {
              code: 5100,
              message: "wrong chain",
            },
          });
          setWcSession(undefined);
        }
      });
    } else {
      createWallet();
    }
  }, [wallet]);

  const wcConnect = async (uri: string) => {
    if (uri && wallet) {
      try {
        await wallet.core.pairing.pair({
          uri,
        });
      } catch (error) {
        console.error("cant pair", JSON.stringify(error));
      }
    } else {
      console.error(
        "uri or wallet not defined",
        "uri: ",
        uri,
        "wallet: ",
        wallet,
      );
    }
  };

  return { wcConnect, wcSession };
};
