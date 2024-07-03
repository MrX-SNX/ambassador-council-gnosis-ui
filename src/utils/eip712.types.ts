import { BigNumberish, BytesLike } from 'ethers';

export interface TypedDataDomain {
  name?: string;
  version?: string;
  chainId?: BigNumberish;
  verifyingContract?: string;
  salt?: BytesLike;
}

export interface TypedDataTypes {
  name: string;
  type: string;
}

export type TypedMessageTypes = { [key: string]: TypedDataTypes[] };

export type EIP712TypedData = {
  domain: TypedDataDomain;
  types: TypedMessageTypes;
  message: Record<string, any>;
};
