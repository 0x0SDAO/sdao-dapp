/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { RedeemHelper, RedeemHelperInterface } from "../RedeemHelper";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipPulled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipPushed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_bond",
        type: "address",
      },
    ],
    name: "addBondContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "bonds",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pullManagement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner_",
        type: "address",
      },
    ],
    name: "pushManagement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_stake",
        type: "bool",
      },
    ],
    name: "redeemAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "removeBondContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceManagement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b03191633178082556040516001600160a01b039190911691907fea8258f2d9ddb679928cf34b78cf645b7feda9acc828e4dd82d014eaae270eba908290a3610712806100696000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806346f68ee91161005b57806346f68ee9146100e05780635a96ac0a146101065780635f1c17c01461010e578063b1e59ab7146101475761007d565b8063089208d8146100825780630a6d18601461008c57806346aed74e146100b2575b600080fd5b61008a610164565b005b61008a600480360360208110156100a257600080fd5b50356001600160a01b031661020d565b61008a600480360360408110156100c857600080fd5b506001600160a01b03813516906020013515156102d1565b61008a600480360360208110156100f657600080fd5b50356001600160a01b031661044b565b61008a61054a565b61012b6004803603602081101561012457600080fd5b50356105f4565b604080516001600160a01b039092168252519081900360200190f35b61008a6004803603602081101561015d57600080fd5b503561061e565b6000546001600160a01b031633146101c3576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907fea8258f2d9ddb679928cf34b78cf645b7feda9acc828e4dd82d014eaae270eba908390a3600080546001600160a01b0319169055565b6000546001600160a01b0316331461026c576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b03811661027f57600080fd5b600280546001810182556000919091527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace0180546001600160a01b0319166001600160a01b0392909216919091179055565b60005b6002548110156104465760006001600160a01b0316600282815481106102f657fe5b6000918252602090912001546001600160a01b03161461043e5760006002828154811061031f57fe5b6000918252602091829020015460408051623711dd60e31b81526001600160a01b038881166004830152915191909216926301b88ee89260248082019391829003018186803b15801561037157600080fd5b505afa158015610385573d6000803e3d6000fd5b505050506040513d602081101561039b57600080fd5b5051111561043e57600281815481106103b057fe5b600091825260208083209091015460408051631feed31f60e01b81526001600160a01b038881166004830152871515602483015291519190921693631feed31f93604480850194919392918390030190829087803b15801561041157600080fd5b505af1158015610425573d6000803e3d6000fd5b505050506040513d602081101561043b57600080fd5b50505b6001016102d4565b505050565b6000546001600160a01b031633146104aa576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b0381166104ef5760405162461bcd60e51b81526004018080602001828103825260268152602001806106be6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917fea8258f2d9ddb679928cf34b78cf645b7feda9acc828e4dd82d014eaae270eba91a3600180546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b031633146105935760405162461bcd60e51b81526004018080602001828103825260228152602001806106e46022913960400191505060405180910390fd5b600154600080546040516001600160a01b0393841693909116917faa151555690c956fc3ea32f106bb9f119b5237a061eaa8557cff3e51e3792c8d91a3600154600080546001600160a01b0319166001600160a01b03909216919091179055565b6002818154811061060457600080fd5b6000918252602090912001546001600160a01b0316905081565b6000546001600160a01b0316331461067d576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b60006002828154811061068c57fe5b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b031602179055505056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734f776e61626c653a206d757374206265206e6577206f776e657220746f2070756c6ca164736f6c6343000705000a";

export class RedeemHelper__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RedeemHelper> {
    return super.deploy(overrides || {}) as Promise<RedeemHelper>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RedeemHelper {
    return super.attach(address) as RedeemHelper;
  }
  connect(signer: Signer): RedeemHelper__factory {
    return super.connect(signer) as RedeemHelper__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RedeemHelperInterface {
    return new utils.Interface(_abi) as RedeemHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RedeemHelper {
    return new Contract(address, _abi, signerOrProvider) as RedeemHelper;
  }
}
