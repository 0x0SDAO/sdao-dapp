/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IScholarDAOToken,
  IScholarDAOTokenInterface,
} from "../IScholarDAOToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IScholarDAOToken__factory {
  static readonly abi = _abi;
  static createInterface(): IScholarDAOTokenInterface {
    return new utils.Interface(_abi) as IScholarDAOTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IScholarDAOToken {
    return new Contract(address, _abi, signerOrProvider) as IScholarDAOToken;
  }
}
