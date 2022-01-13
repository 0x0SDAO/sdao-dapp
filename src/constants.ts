import { NodeHelper } from "./helpers/NodeHelper";
import { EnvHelper } from "./helpers/Environment";
import ethereum from "./assets/tokens/wETH.svg";
import arbitrum from "./assets/arbitrum.png";
import ftm from "./assets/tokens/ftm32.svg";
import avalanche from "./assets/tokens/AVAX.svg";
import polygon from "./assets/tokens/matic.svg";

// TODO Check values below
export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-protocol-metrics";
export const EPOCH_INTERVAL = 28800;

// NOTE could get this from an outside source since it changes slightly over time
// BSC : 3.01
// ETH : 13.14
// FTM : 0.90
export const BLOCK_RATE_SECONDS = 3.01;

export const TOKEN_DECIMALS = 9;

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

// TODO: Set correct values below for mainnet / testnet
export enum NetworkId {
  MAINNET = 56,
  TESTNET = 97,
  BSC = 56,
  BSC_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 421611,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  POLYGON = 137,
  POLYGON_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
}

interface IAddresses {
  [key: number]: { [key: string]: string };
}

// TODO: Set correct values below for mainnet / testnet
export const urls = {
  bscMainnetRpcs: [
    'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/'
  ],
  bscTestnetRpcs: [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
    // 'https://data-seed-prebsc-2-s1.binance.org:8545/',
    // 'https://data-seed-prebsc-1-s2.binance.org:8545/'
  ],
  ftmMainnetRpcs: [
    'https://rpc.ftm.tools/'
  ],
  ftmTestnetRpcs: [
    'https://rpc.testnet.fantom.network/'
  ],
  mainnetRpcs: [
    'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/'
  ],
  testnetRpcs: [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
    // 'https://data-seed-prebsc-2-s1.binance.org:8545/',
    // 'https://data-seed-prebsc-1-s2.binance.org:8545/'
  ]
}

// TODO: Check below if nothing missing / remove unused
export const addresses: IAddresses = {
  [NetworkId.TESTNET]: {
    FACTORY_ADDRESS: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DEAD_ADDRESS: "0x000000000000000000000000000000000000dEaD",
    BUSD_ADDRESS: "0x24B7c96b73ea8f602bB2aD981d774C25B8F30A5E",
    SDOGE_BUSD_LP_ADDRESS: "0x72dEA7C26C3A69a34064775a08aAd83e0D438595",
    WBNB_ADDRESS: "0x837f5DC55a15bfa6B541F831Fad61EF5be0B2044",
    SDOGE_ADDRESS: "0xf28cfE390cB1Cc21d4B5BEa700B728638c23ebB4",
    STAKING_ADDRESS: "0x5BF599A3c8168298d9c8c4452131238AD338D3B1",
    STAKING_HELPER_ADDRESS: "",
    SSDOGE_ADDRESS: "0x4c7f33Bcc0f8fb31CA4059FA501e8aE34bc5Cf33",
    BUSD_BOND_ADDRESS: "0x9C086C0e5d5C059ec4feD8dD19B20EEB613bBC74",
    SDOGE_BUSD_BOND_ADDRESS: "0xacdd2c6d14753D87929a3C16D6729b0A4Da4F14B",
    WBNB_BOND_ADDRESS: "0x1Ba47279fd3426e9310F8bBbff042B338bB9DE85",
    DISTRIBUTOR_ADDRESS: "0x7372b9A79955d596b335E2F030AA2501Ef299BF9",
    BONDINGCALC_ADDRESS: "0xd7776b22F81Fdaba375abce51753a96fefafa969",
    CIRCULATING_SUPPLY_ADDRESS: "0x5a2a03BeDbe19a98C0B26b4a974C6945F0505a1C",
    TREASURY_ADDRESS: "0xdBDbb72C34286266a355b3A1183e9d75e86A1281",
    REDEEM_HELPER_ADDRESS: "0x9fab8FB87b7bB328645CcA423019A8e813Fe48e4",
  },
  [NetworkId.MAINNET]: {
    FACTORY_ADDRESS: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DEAD_ADDRESS: "0x000000000000000000000000000000000000dEaD",
    BUSD_ADDRESS: "",
    SDOGE_BUSD_LP_ADDRESS: "",
    WBNB_ADDRESS: "",
    SDOGE_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    SSDOGE_ADDRESS: "",
    BUSD_BOND_ADDRESS: "",
    SDOGE_BUSD_BOND_ADDRESS: "",
    WBNB_BOND_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
  },
  [NetworkId.ARBITRUM]: {
  }, // TODO: Replace with Arbitrum contract addresses when ready
  [NetworkId.ARBITRUM_TESTNET]: {
  }, // TODO: Replace with Arbitrum Testnet contract addresses when ready
  [NetworkId.AVALANCHE_TESTNET]: {
  }, // TODO: Avalanche Testnet addresses
  [NetworkId.AVALANCHE]: {
  }, // TODO: Avalanche Mainnet addresses
  [NetworkId.POLYGON]: {
  },
  [NetworkId.FANTOM]: {
    FACTORY_ADDRESS: "",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DEAD_ADDRESS: "0x000000000000000000000000000000000000dEaD",
    BUSD_ADDRESS: "",
    SDOGE_BUSD_LP_ADDRESS: "",
    WBNB_ADDRESS: "",
    SDOGE_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    SSDOGE_ADDRESS: "",
    BUSD_BOND_ADDRESS: "",
    SDOGE_BUSD_BOND_ADDRESS: "",
    WBNB_BOND_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
  },
  [NetworkId.FANTOM_TESTNET]: {
    FACTORY_ADDRESS: "",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DEAD_ADDRESS: "0x000000000000000000000000000000000000dEaD",
    BUSD_ADDRESS: "",
    SDOGE_BUSD_LP_ADDRESS: "",
    WBNB_ADDRESS: "",
    SDOGE_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    SSDOGE_ADDRESS: "",
    BUSD_BOND_ADDRESS: "",
    SDOGE_BUSD_BOND_ADDRESS: "",
    WBNB_BOND_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
  },
};

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: SVGImageElement;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
// TODO: TESTING REMOVE HERE AND UNCOMMENT
export const USER_SELECTABLE_NETWORKS = [NetworkId.MAINNET, NetworkId.TESTNET];
//export const USER_SELECTABLE_NETWORKS = [NetworkId.MAINNET, NetworkId.ARBITRUM, NetworkId.AVALANCHE];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = -1;

export const NETWORKS: { [key: number]: INetwork } = {
  [NetworkId.MAINNET]: {
    chainName: "BSC mainnet",
    chainId: 56,
    nativeCurrency: {
      name: "Binance coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://bscscan.io/#/"],
    image: ethereum,
    imageAltText: "Binance coin logo",
    uri: () => NodeHelper.getBSCURI(NetworkId.MAINNET),
  },
  [NetworkId.TESTNET]: {
    chainName: "BSC testnet",
    chainId: 97,
    nativeCurrency: {
      name: "Binance coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://testnet.bscscan.io/#/"],
    image: ethereum,
    imageAltText: "Binance coin logo",
    uri: () => NodeHelper.getBSCURI(NetworkId.TESTNET),
  },
  [NetworkId.ARBITRUM]: {
    chainName: "Arbitrum",
    chainId: 42161,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => NodeHelper.getBSCURI(NetworkId.ARBITRUM),
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    chainName: "Arbitrum Testnet",
    chainId: 421611,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => EnvHelper.alchemyArbitrumTestnetURI,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.alchemyAvalancheTestnetURI,
  },
  [NetworkId.AVALANCHE]: {
    chainName: "Avalanche",
    chainId: 43114,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getBSCURI(NetworkId.AVALANCHE),
  },
  [NetworkId.POLYGON]: {
    chainName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => NodeHelper.getBSCURI(NetworkId.POLYGON),
  },
  [NetworkId.POLYGON_TESTNET]: {
    chainName: "Polygon Mumbai Testnet",
    chainId: 80001,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => "", // NodeHelper.getBSCURI(NetworkId.POLYGON_TESTNET),
  },
  [NetworkId.FANTOM]: {
    chainName: "Fantom",
    chainId: 250,
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ftm.tools/"],
    blockExplorerUrls: ["https://ftmscan.com/"],
    image: ftm,
    imageAltText: "Fantom Logo",
    uri: () => NodeHelper.getBSCURI(NetworkId.POLYGON),
  },
  [NetworkId.FANTOM_TESTNET]: {
    chainName: "Fantom Testnet",
    chainId: 4002,
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.testnet.fantom.network/"],
    blockExplorerUrls: ["https://testnet.ftmscan.com/"],
    image: ftm,
    imageAltText: "Fantom Logo",
    uri: () => "", // NodeHelper.getBSCURI(NetworkId.POLYGON_TESTNET),
  },
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view
interface IViewsForNetwork {
  dashboard: boolean;
  stake: boolean;
  wrap: boolean;
  zap: boolean;
  threeTogether: boolean;
  bonds: boolean;
  network: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
  [NetworkId.MAINNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  [NetworkId.TESTNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  [NetworkId.ARBITRUM]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
  },
  [NetworkId.AVALANCHE]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
  },
  [NetworkId.FANTOM]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
  },
  [NetworkId.FANTOM_TESTNET]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
  },
};
