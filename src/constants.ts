import { NodeHelper } from "./helpers/NodeHelper";
import ftm from "./assets/tokens/ftm32.svg";

export const IS_PRIVATE_SALE_ENABLED = false;

// TODO Check values below
export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/sdao-protocol-metrics";
export const EPOCH_INTERVAL = 28800;

// NOTE could get this from an outside source since it changes slightly over time
// BSC : 3.01
// ETH : 13.14
// FTM : 0.90
export const BLOCK_RATE_SECONDS = 0.90;

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
  MAINNET = 250,
  TESTNET = 4002,
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
    'https://rpc.ftm.tools/'
  ],
  testnetRpcs: [
    'https://rpc.testnet.fantom.network/'
  ]
}

// TODO: Check below if nothing missing / remove unused
export const addresses: IAddresses = {
  // Using FTM
  [NetworkId.TESTNET]: {
    FACTORY_ADDRESS: "0x050Eb9b4fa797FCA1Dbddb1587DF11f0B980b02D",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DAI_ADDRESS: "0x74A61f3F8a21d9d2dA367abc213Bea27DBc1003D",
    SDAO_DAI_LP_ADDRESS: "0xd3195b2C9CE57388Fe84bBA4D5c006d5B62ff712",
    WFTM_ADDRESS: "0x74A61f3F8a21d9d2dA367abc213Bea27DBc1003D",
    PSDAO_ADDRESS: "0xf852fE5B1a64d3c55D2c6789657eA54847Dd01af",
    PRIVATE_SALE_ADDRESS: "0x0D5677AC9746E342c23c78e6E8354C4d1bDa296e",
    SDAO_ADDRESS: "0x7F8718dBAecd862e5663dC2Aab40d04547665d81",
    STAKING_ADDRESS: "0xd7e1f9616F5e4Bb5EFF18BbE6ad183eEC8E5535b",
    SSDAO_ADDRESS: "0x949e3Eedc17695FD30dA38D889691F6fE821189E",
    DAI_BOND_ADDRESS: "0xe87c8F3545552ee79eF79b1E7eEc2f804307AF03",
    SDAO_DAI_BOND_ADDRESS: "0xE310483379b367eA13e8FBD393eF757B86C3833c",
    WFTM_BOND_ADDRESS: "0x679Bf7df9851aC815adA8266aA010C7Ba934e9A4",
    DISTRIBUTOR_ADDRESS: "0x4fF3FcE82f868FC1b3C11312CFBec941a8d01FF3",
    BONDINGCALC_ADDRESS: "0x2d22B51738D806fd32D1Abb472600f713e011872",
    CIRCULATING_SUPPLY_ADDRESS: "0x0b48fceC969190C23422f9398F73Cd185858DeCA",
    TREASURY_ADDRESS: "0x57AFCb4EFBEB6F797C2c88914F2Fd31dc85D0A17",
    REDEEM_HELPER_ADDRESS: "0xB5AfF5941cfba046ee5370FFFa0B332920BE7A2D",
  },
  // Using FTM
  [NetworkId.MAINNET]: {
    FACTORY_ADDRESS: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DAI_ADDRESS: "",
    SDAO_DAI_LP_ADDRESS: "",
    WFTM_ADDRESS: "",
    PSDAO_ADDRESS: "",
    PRIVATE_SALE_ADDRESS: "",
    SDAO_ADDRESS: "",
    STAKING_ADDRESS: "",
    SSDAO_ADDRESS: "",
    DAI_BOND_ADDRESS: "",
    SDAO_DAI_BOND_ADDRESS: "",
    WFTM_BOND_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
  },
  // [NetworkId.ARBITRUM]: {
  // }, // TODO: Replace with Arbitrum contract addresses when ready
  // [NetworkId.ARBITRUM_TESTNET]: {
  // }, // TODO: Replace with Arbitrum Testnet contract addresses when ready
  // [NetworkId.AVALANCHE_TESTNET]: {
  // }, // TODO: Avalanche Testnet addresses
  // [NetworkId.AVALANCHE]: {
  // }, // TODO: Avalanche Mainnet addresses
  // [NetworkId.POLYGON]: {
  // },
  // [NetworkId.FANTOM]: {
  //   FACTORY_ADDRESS: "",
  //   ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
  //   DAI_ADDRESS: "",
  //   DAI_ADDRESS: "",
  //   SDAO_DAI_LP_ADDRESS: "",
  //   WFTM_ADDRESS: "",
  //   PSDAO_ADDRESS: "",
  //   PRIVATE_SALE_ADDRESS: "",
  //   SDAO_ADDRESS: "",
  //   STAKING_ADDRESS: "",
  //   SSDAO_ADDRESS: "",
  //   DAI_BOND_ADDRESS: "",
  //   SDAO_DAI_BOND_ADDRESS: "",
  //   WFTM_BOND_ADDRESS: "",
  //   DISTRIBUTOR_ADDRESS: "",
  //   BONDINGCALC_ADDRESS: "",
  //   CIRCULATING_SUPPLY_ADDRESS: "",
  //   TREASURY_ADDRESS: "",
  //   REDEEM_HELPER_ADDRESS: "",
  // },
  // [NetworkId.FANTOM_TESTNET]: {
  //   FACTORY_ADDRESS: "",
  //   ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
  //   DAI_ADDRESS: "",
  //   DAI_ADDRESS: "",
  //   SDAO_DAI_LP_ADDRESS: "",
  //   WFTM_ADDRESS: "",
  //   PSDAO_ADDRESS: "",
  //   PRIVATE_SALE_ADDRESS: "",
  //   SDAO_ADDRESS: "",
  //   STAKING_ADDRESS: "",
  //   SSDAO_ADDRESS: "",
  //   DAI_BOND_ADDRESS: "",
  //   SDAO_DAI_BOND_ADDRESS: "",
  //   WFTM_BOND_ADDRESS: "",
  //   DISTRIBUTOR_ADDRESS: "",
  //   BONDINGCALC_ADDRESS: "",
  //   CIRCULATING_SUPPLY_ADDRESS: "",
  //   TREASURY_ADDRESS: "",
  //   REDEEM_HELPER_ADDRESS: "",
  // },
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
    uri: () => NodeHelper.getURI(NetworkId.POLYGON),
  },
  [NetworkId.TESTNET]: {
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
    uri: () => "", // NodeHelper.getURI(NetworkId.POLYGON_TESTNET),
  },
  // [NetworkId.BSC]: {
  //   chainName: "BSC mainnet",
  //   chainId: 56,
  //   nativeCurrency: {
  //     name: "Binance coin",
  //     symbol: "BNB",
  //     decimals: 18,
  //   },
  //   rpcUrls: [""],
  //   blockExplorerUrls: ["https://bscscan.io/#/"],
  //   image: ethereum,
  //   imageAltText: "Binance coin logo",
  //   uri: () => NodeHelper.getURI(NetworkId.MAINNET),
  // },
  // [NetworkId.BSC_TESTNET]: {
  //   chainName: "BSC testnet",
  //   chainId: 97,
  //   nativeCurrency: {
  //     name: "Binance coin",
  //     symbol: "BNB",
  //     decimals: 18,
  //   },
  //   rpcUrls: [""],
  //   blockExplorerUrls: ["https://testnet.bscscan.io/#/"],
  //   image: ethereum,
  //   imageAltText: "Binance coin logo",
  //   uri: () => NodeHelper.getURI(NetworkId.TESTNET),
  // },
  // [NetworkId.ARBITRUM]: {
  //   chainName: "Arbitrum",
  //   chainId: 42161,
  //   nativeCurrency: {
  //     name: "Ethereum",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  //   blockExplorerUrls: ["https://explorer.arbitrum.io/#/"],
  //   image: arbitrum,
  //   imageAltText: "Arbitrum Logo",
  //   uri: () => NodeHelper.getURI(NetworkId.ARBITRUM),
  // },
  // [NetworkId.ARBITRUM_TESTNET]: {
  //   chainName: "Arbitrum Testnet",
  //   chainId: 421611,
  //   nativeCurrency: {
  //     name: "Ethereum",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
  //   blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
  //   image: arbitrum,
  //   imageAltText: "Arbitrum Logo",
  //   uri: () => EnvHelper.alchemyArbitrumTestnetURI,
  // },
  // [NetworkId.AVALANCHE_TESTNET]: {
  //   chainName: "Avalanche Fuji Testnet",
  //   chainId: 43113,
  //   nativeCurrency: {
  //     name: "AVAX",
  //     symbol: "AVAX",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  //   blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
  //   image: avalanche,
  //   imageAltText: "Avalanche Logo",
  //   uri: () => EnvHelper.alchemyAvalancheTestnetURI,
  // },
  // [NetworkId.AVALANCHE]: {
  //   chainName: "Avalanche",
  //   chainId: 43114,
  //   nativeCurrency: {
  //     name: "AVAX",
  //     symbol: "AVAX",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  //   blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
  //   image: avalanche,
  //   imageAltText: "Avalanche Logo",
  //   uri: () => NodeHelper.getURI(NetworkId.AVALANCHE),
  // },
  // [NetworkId.POLYGON]: {
  //   chainName: "Polygon",
  //   chainId: 137,
  //   nativeCurrency: {
  //     name: "Polygon",
  //     symbol: "MATIC",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://polygon-rpc.com"],
  //   blockExplorerUrls: ["https://polygonscan.com/"],
  //   image: polygon,
  //   imageAltText: "Polygon Logo",
  //   uri: () => NodeHelper.getURI(NetworkId.POLYGON),
  // },
  // [NetworkId.POLYGON_TESTNET]: {
  //   chainName: "Polygon Mumbai Testnet",
  //   chainId: 80001,
  //   nativeCurrency: {
  //     name: "Polygon",
  //     symbol: "MATIC",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://polygon-rpc.com"],
  //   blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  //   image: polygon,
  //   imageAltText: "Polygon Logo",
  //   uri: () => "", // NodeHelper.getURI(NetworkId.POLYGON_TESTNET),
  // },
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
    uri: () => NodeHelper.getURI(NetworkId.POLYGON),
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
    uri: () => "", // NodeHelper.getURI(NetworkId.POLYGON_TESTNET),
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
  [NetworkId.BSC]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
  },
  [NetworkId.BSC_TESTNET]: {
    dashboard: false,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: false,
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
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  [NetworkId.FANTOM_TESTNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
  },
};
