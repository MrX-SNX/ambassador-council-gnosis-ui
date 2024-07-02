import { useConnectWallet } from "@web3-onboard/react";
import { useWalletConnect } from "./hooks/useWalletConnect";

const App = () => {
  const [{ wallet }, connect] = useConnectWallet();
  const { wcConnect, wcSession } = useWalletConnect();

  if (!wallet) return <button onClick={() => connect()}>Connect Wallet</button>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>Hey {wallet.accounts[0].address}</div>
      <div>
        {wcSession ? (
          <p>
            Session going to expire:{" "}
            {new Date(wcSession.expiry * 1000).toLocaleDateString("en-Us", {
              minute: "2-digit",
              hour: "2-digit",
            })}
            <br />
            Leave window open. Signature request will pop up here
          </p>
        ) : (
          <input
            style={{ width: "500px" }}
            placeholder="Put WC connection link here"
            onChange={(e) => {
              wcConnect(e.target.value);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
