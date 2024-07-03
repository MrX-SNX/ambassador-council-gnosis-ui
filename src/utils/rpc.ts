type RpcRequest = {
  id: number;
  method: string;
  params: any[];
  jsonrpc: string;
};

export type { RpcRequest };
