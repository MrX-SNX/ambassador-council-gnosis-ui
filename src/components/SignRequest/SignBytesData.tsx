import { Code } from "@chakra-ui/react";
import { RpcRequest } from "../../utils/rpc";
import { tryHexBytesToUtf8 } from "../../utils/strings";

const SignBytesData = ({ request }: { request: RpcRequest }) => {
  const message =
    request.method === "eth_sign" ? request.params[1] : request.params[0];
  const decodedMessage = tryHexBytesToUtf8(message);

  return (
    <Code textAlign="left" maxHeight="500px" overflow="scroll">
      <pre>{decodedMessage}</pre>
    </Code>
  );
};

export default SignBytesData;
