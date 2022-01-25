import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { NodeHelper } from "./NodeHelper";
import { NetworkId, NETWORKS } from "../constants";

interface IGetCurrentNetwork {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const initNetworkFunc = async ({ provider }: IGetCurrentNetwork) => {
  try {
    let networkName: string;
    const supported = true;

    const id: number = await provider.getNetwork().then(network => network.chainId);
    const uri = NodeHelper.getURI(id);
    switch (id) {
      case NetworkId.FANTOM:
        networkName = "Fantom mainnet";
        break;
      case NetworkId.FANTOM_TESTNET:
        networkName = "Fantom testnet";
        break;
      // case NetworkId.BSC:
      //   networkName = "BSC mainnet";
      //   break;
      // case NetworkId.BSC_TESTNET:
      //   networkName = "BSC testnet";
      //   break;
      default:
        // supported = false;
        // networkName = "Unsupported Network";
        // uri = "";

        // break;
        // TODO: Set default here to avoid errors (FTM mainnet for production).
        return {
          networkId: NetworkId.FANTOM_TESTNET,
          networkName: "Fantom testnet",
          uri: NodeHelper.getURI(NetworkId.FANTOM_TESTNET),
          initialized: true,
        };
    }

    return {
      networkId: id,
      networkName: networkName,
      uri: uri,
      initialized: supported,
    };
  } catch (e) {
    console.log(e);
    return {
      networkId: -1,
      networkName: "",
      uri: "",
      initialized: false,
    };
  }
};

interface ISwitchNetwork {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkId: number;
}

export const switchNetwork = async ({ provider, networkId }: ISwitchNetwork) => {
  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId: idToHexString(networkId) }]);
  } catch (e) {
    // If the chain has not been added to the user's wallet
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (e.code === 4902) {
      const network = NETWORKS[networkId];
      const params = [
        {
          chainId: idToHexString(networkId),
          chainName: network["chainName"],
          nativeCurrency: network["nativeCurrency"],
          rpcUrls: network["rpcUrls"],
          blockExplorerUrls: network["blockExplorerUrls"],
        },
      ];

      try {
        await provider.send("wallet_addEthereumChain", params);
      } catch (e) {
        console.log(e);
        // dispatch(error("Error switching network!"));
      }
    }
    // }
  }
};

const idToHexString = (id: number) => {
  return "0x" + id.toString(16);
};

export const idFromHexString = (hexString: string) => {
  return parseInt(hexString, 16);
};
