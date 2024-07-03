import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeVersion } from "@gnosis.pm/safe-core-sdk-types";
import { CHAIN_ID, SAFE_ADDRESS } from "./configurations";
import { areStringsEqual } from "./strings";
import { ethers, providers, utils } from "ethers";
import { EIP712TypedData } from "./eip712.types";
import { getEIP712MessageHash } from "./eip712";

type SafeEIP712Domain = {
  chainId?: string;
  verifyingContract: string;
};

// https://docs.gnosis.io/safe/docs/contracts_signatures/#pre-validated-signatures
const getPreValidatedSignature = (signerAddress: string) =>
  "0x000000000000000000000000" +
  signerAddress.slice(2) +
  "000000000000000000000000000000000000000000000000000000000000000001";

const EIP712_SAFE_MESSAGE_TYPE = {
  // "SafeMessage(bytes message)"
  SafeMessage: [{ type: "bytes", name: "message" }],
};

const getSafe = async (signer: providers.JsonRpcSigner) =>
  await Safe.create({
    ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }),
    safeAddress: SAFE_ADDRESS,
    contractNetworks: {
      "10": {
        multiSendAddress: "0x998739BFdAAdde7C933B942a68053933098f9EDa",
        multiSendCallOnlyAddress: "0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B",
        safeProxyFactoryAddress: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
        safeMasterCopyAddress: "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA",
        createCallAddress: "0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d",
        signMessageLibAddress: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
        fallbackHandlerAddress: "0x017062a1dE2FE6b99BE3d9d37841FeD19F573804",
      },
    },
  });

type AdjustVOverload = {
  (signingMethod: "eth_signTypedData", signature: string): string;
  (
    signingMethod: "eth_sign",
    signature: string,
    safeTxHash: string,
    sender: string,
  ): string;
};

const isSignedWithEIP191Prefix = (
  hexMessage: string,
  signature: string,
  ownerAddress: string,
): boolean => {
  let hasPrefix;
  try {
    const recoveredAddress = utils.verifyMessage(hexMessage, signature);
    hasPrefix = !areStringsEqual(recoveredAddress, ownerAddress);
  } catch (e) {
    hasPrefix = true;
  }
  return hasPrefix;
};

const adjustSignatureVbyte: AdjustVOverload = (
  signingMethod: "eth_sign" | "eth_signTypedData",
  signature: string,
  safeTxHash?: string,
  signerAddress?: string,
): string => {
  const ETHEREUM_V_VALUES = [0, 1, 27, 28];
  const MIN_VALID_V_VALUE_FOR_SAFE_ECDSA = 27;
  let signatureV = parseInt(signature.slice(-2), 16);
  if (!ETHEREUM_V_VALUES.includes(signatureV)) {
    throw new Error("Invalid signature");
  }
  if (signingMethod === "eth_sign") {
    /*
      The Safe's expected V value for ECDSA signature is:
      - 27 or 28
      - 31 or 32 if the message was signed with a EIP-191 prefix. Should be calculated as ECDSA V value + 4
      Some wallets do that, some wallets don't, V > 30 is used by contracts to differentiate between
      prefixed and non-prefixed messages. The only way to know if the message was signed with a
      prefix is to check if the signer address is the same as the recovered address.
      More info:
      https://docs.gnosis-safe.io/contracts/signatures
    */
    if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
      signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA;
    }
    const adjustedSignature = signature.slice(0, -2) + signatureV.toString(16);
    const signatureHasPrefix = isSignedWithEIP191Prefix(
      safeTxHash as string,
      adjustedSignature,
      signerAddress as string,
    );
    if (signatureHasPrefix) {
      signatureV += 4;
    }
  }
  if (signingMethod === "eth_signTypedData") {
    // Metamask with ledger returns V=0/1 here too, we need to adjust it to be ethereum's valid value (27 or 28)
    if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
      signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA;
    }
  }
  signature = signature.slice(0, -2) + signatureV.toString(16);
  return signature;
};

const safeSignMessage = async (
  signer: providers.JsonRpcSigner,
  safeAddress: string,
  safeVersion: SafeVersion,
  message: string,
): Promise<string> => {
  const hashedMessage = utils.isHexString(message)
    ? message
    : utils.hashMessage(message);

  let domain: SafeEIP712Domain = {
    chainId: CHAIN_ID,
    verifyingContract: safeAddress,
  };
  if (safeVersion === "1.1.1") {
    domain = {
      verifyingContract: safeAddress,
    };
  }

  const signature = await signer._signTypedData(
    domain,
    EIP712_SAFE_MESSAGE_TYPE,
    {
      message: hashedMessage,
    },
  );

  return adjustSignatureVbyte("eth_signTypedData", signature);
};

const safeSignTypedMessage = async (
  signer: providers.JsonRpcSigner,
  safeAddress: string,
  safeVersion: SafeVersion,
  typedData: EIP712TypedData | string,
): Promise<string> => {
  const typedDataHash = getEIP712MessageHash(typedData);

  const signature = await safeSignMessage(
    signer,
    safeAddress,
    safeVersion,
    typedDataHash,
  );
  return signature;
};

export {
  EIP712_SAFE_MESSAGE_TYPE,
  adjustSignatureVbyte,
  getSafe,
  getPreValidatedSignature,
  safeSignMessage,
  safeSignTypedMessage,
};
