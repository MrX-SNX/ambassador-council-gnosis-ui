import { utils } from "ethers";
import { EIP712TypedData } from "./eip712.types";

const isObjectEIP712TypedData = (obj?: unknown): obj is EIP712TypedData => {
  return (
    typeof obj === "object" &&
    obj != null &&
    "domain" in obj &&
    "types" in obj &&
    "message" in obj
  );
};

const convertEIP712RpcPayloadToEthersEIP712Object = (
  typedDataString: string,
): EIP712TypedData => {
  const typedData = JSON.parse(typedDataString) as EIP712TypedData;
  const typesCopy = { ...typedData.types };
  // We need to remove the EIP712Domain type from the types object
  // Because it's a part of the JSON-RPC payload, but for the `.hash` in ethers.js
  // The types are not allowed to be recursive, so ever type must either be used by another type, or be
  // the primary type. And there must only be one type that is not used by any other type.
  delete typesCopy.EIP712Domain;

  return {
    types: typesCopy,
    domain: typedData.domain,
    message: typedData.message,
  };
};

const getEIP712MessageHash = (typedData: EIP712TypedData | string): string => {
  if (typeof typedData === "string") {
    typedData = convertEIP712RpcPayloadToEthersEIP712Object(typedData);
  }

  return utils._TypedDataEncoder.hash(
    typedData.domain,
    typedData.types,
    typedData.message,
  );
};

export {
  convertEIP712RpcPayloadToEthersEIP712Object,
  isObjectEIP712TypedData,
  getEIP712MessageHash,
};
