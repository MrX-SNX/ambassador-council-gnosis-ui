import { Code, Text, Box } from "@chakra-ui/react";
import { RpcRequest } from "../../utils/rpc";
import { getEIP712MessageHash } from "../../utils/eip712";

const SignTypedData = ({ request }: { request: RpcRequest }) => {
  return (
    <Box>
      <Code textAlign="left" maxHeight="500px" overflow="scroll">
        <pre>
          {JSON.stringify(JSON.parse(request.params[1] as string), null, 2)}
        </pre>
      </Code>
      <Text>Below request will appear in Metamask:</Text>
      <Code textAlign="left" maxHeight="500px" overflow="scroll">
        <pre>
          {JSON.stringify(
            { message: getEIP712MessageHash(request.params[1]) },
            null,
            2,
          )}
        </pre>
      </Code>
    </Box>
  );
};

export default SignTypedData;
