import { useConnectWallet } from "@web3-onboard/react";
import { useWalletConnect } from "./hooks/useWalletConnect";
import { Button, Flex, Input, Text } from "@chakra-ui/react";

const App = () => {
  const [{ wallet }, connect] = useConnectWallet();
  const { wcConnect, wcSession } = useWalletConnect();

  if (!wallet)
    return (
      <Flex
        justifyContent="center"
        width="100%"
        flexDirection="column"
        alignItems="center"
      >
        <Button onClick={() => connect()}>Connect Wallet</Button>
      </Flex>
    );

  return (
    <Flex
      justifyContent="center"
      width="100%"
      flexDirection="column"
      alignItems="center"
    >
      <Text color="white">Hey {wallet.accounts[0].address}</Text>
      <Flex>
        {wcSession ? (
          <Text color="white">
            Session going to expire:{" "}
            {new Date(wcSession.expiry * 1000).toLocaleDateString("en-Us", {
              minute: "2-digit",
              hour: "2-digit",
            })}
            <br />
            Leave window open. Signature request will pop up here
          </Text>
        ) : (
          <Input
            w="500px"
            placeholder="Put WC connection link here"
            onChange={(e) => {
              wcConnect(e.target.value);
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default App;
