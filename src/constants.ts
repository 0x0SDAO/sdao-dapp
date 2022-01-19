import { NodeHelper } from "./helpers/NodeHelper";
import ftm from "./assets/tokens/ftm32.svg";

export const IS_PRIVATE_SALE_ENABLED = true;

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
    FACTORY_ADDRESS: "0x8E20a29705C1FC2dDD0C320067669a3e2e74B3cf",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    DAI_ADDRESS: "0x792492FEDB1c282a48456e72762D4290cED55612",
    SDAO_DAI_LP_ADDRESS: "0xcE62411aD29961C70950F8ad25D55d6B14e6fF42",
    WFTM_ADDRESS: "0x7e6059D144018743301a43513B9019FAaEF32A95",
    PSDAO_ADDRESS: "0x01740450366A8FCF2f011334c4F288E3F4AAA6D1",
    PRIVATE_SALE_ADDRESS: "0x570B55aF8966A202A6493E9bA7A750021C098329",
    SDAO_ADDRESS: "0xa5EB86C8B86Bd10C4D2b38189c5F54c6B4BdA91C",
    STAKING_ADDRESS: "0x726966982D95A52364806A48758337B3f31266a9",
    SSDAO_ADDRESS: "0x1069FE9A7C2Da3b76d66E101870fD71B6de9235A",
    DAI_BOND_ADDRESS: "0x723377B0d4F33fCeBEd7d5C2dDba589B8601A6ca",
    SDAO_DAI_BOND_ADDRESS: "0x9D824810689f59D3B5fCA4Aca1b825A7Aeacd9B5",
    WFTM_BOND_ADDRESS: "0xD9D8361bb586d95f94E9557992AAb4d49cCaD28D",
    DISTRIBUTOR_ADDRESS: "0x6B09D347262DdFf61c7c6e4681954cBd7269362B",
    BONDINGCALC_ADDRESS: "0x7dE615664510b0b6A8D144ae23C3C865216a66D1",
    CIRCULATING_SUPPLY_ADDRESS: "0x38A67e3CD8e57ddc1A4f64A194BD47d4D09e9e7B",
    TREASURY_ADDRESS: "0x8e7d55F9A94659610EC08b3387719bE0CAc17C63",
    REDEEM_HELPER_ADDRESS: "0x1D399398bcF86BfB5b12356d2D5F96b638d5DD50",
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
