import { RpcRequest } from "../../utils/rpc";
import SignTypedData from "./SignTypedData";
import SignBytesData from "./SignBytesData";
import SendTransaction from "./SendTransaction";
import { Flex, Heading, Text, ButtonGroup, Button } from "@chakra-ui/react";

const SignRequest = ({
  request,
  onApprove,
  onReject,
}: {
  request: RpcRequest;
  onApprove: () => void;
  onReject: () => void;
}) => {
  let content: React.ReactNode;
  switch (request.method) {
    case "eth_signTypedData":
    case "eth_signTypedData_v4":
      content = <SignTypedData request={request} />;
      break;
    case "eth_sign":
    case "personal_sign":
      content = <SignBytesData request={request} />;
      break;
    case "eth_sendTransaction":
      content = <SendTransaction request={request} />;
      break;
    default:
      content = <Text>Unsupported request</Text>;
      break;
  }

  return (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      overflow="scroll"
      maxW="100%"
    >
      <Heading mb={4}>🔏 Pending {request.method} request:</Heading>
      {content}
      <ButtonGroup mt={8} w="100%">
        <Button colorScheme="green" mr="auto" onClick={onApprove}>
          Approve
        </Button>
        <Button onClick={onReject}>Reject</Button>
      </ButtonGroup>
    </Flex>
  );
};

export default SignRequest;
