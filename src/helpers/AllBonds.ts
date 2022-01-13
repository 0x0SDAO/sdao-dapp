import { BondType, CustomBond, LPBond, StableBond } from "src/lib/Bond";
import { addresses, NetworkId } from "src/constants";

// TODO: Set correct images below
import { ReactComponent as BusdImg } from "src/assets/tokens/BUSD.svg";
import { ReactComponent as SdogeBusdImg } from "src/assets/tokens/SDOGE-BUSD.svg";
import { ReactComponent as wBNBImg } from "src/assets/tokens/wBNB.svg";

import { default as BondDepositoryContract } from "src/abi/BondDepository.json";
import { default as BondDepositoryWBNBContract } from "src/abi/BondDepositoryWBNB.json";
import { default as IBEP20Contract } from "src/abi/interfaces/IBEP20.json";
import { default as PancakePairContract } from "src/abi/interfaces/IPancakePair.json";

import { BigNumberish } from "ethers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const busd = new StableBond({
  name: "busd",
  displayName: "BUSD",
  bondToken: "BUSD",
  payoutToken: "SDOGE",
  bondIconSvg: BusdImg,
  bondContractABI: BondDepositoryContract.abi,
  isBondable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Sold Out",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: addresses[NetworkId.MAINNET].BUSD_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.MAINNET].BUSD_ADDRESS,
    },
    [NetworkId.TESTNET]: {
      bondAddress: addresses[NetworkId.TESTNET].BUSD_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.TESTNET].BUSD_ADDRESS,
    },
  },
});

export const wbnb = new CustomBond({
  name: "wbnb",
  displayName: "WBNB",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "WBNB",
  payoutToken: "SDOGE",
  bondIconSvg: wBNBImg,
  bondContractABI: BondDepositoryWBNBContract.abi,
  reserveContract: IBEP20Contract.abi, // The Standard BEP20 since they're normal tokens
  isBondable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Taking a Spa Day",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: addresses[NetworkId.MAINNET].WBNB_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.MAINNET].WBNB_ADDRESS,
    },
    [NetworkId.TESTNET]: {
      bondAddress: addresses[NetworkId.TESTNET].WBNB_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.TESTNET].WBNB_ADDRESS,
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    const wbnbBondContract = this.getContractForBond(NetworkId, provider);
    let wbnbPrice: BigNumberish = await wbnbBondContract.assetPrice();
    wbnbPrice = Number(wbnbPrice.toString()) / Math.pow(10, 8);
    const token = this.getBEP20ContractForReserve(NetworkId, provider);
    let wbnbAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    wbnbAmount = Number(wbnbAmount.toString()) / Math.pow(10, 18);
    return wbnbAmount * wbnbPrice;
  },
});

export const sdoge_busd = new LPBond({
  name: "sdoge_busd_lp",
  displayName: "SDOGE-BUSD LP",
  bondToken: "BUSD",
  payoutToken: "SDOGE",
  bondIconSvg: SdogeBusdImg,
  bondContractABI: BondDepositoryContract.abi,
  reserveContract: PancakePairContract.abi,
  isBondable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: addresses[NetworkId.MAINNET].SDOGE_BUSD_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.MAINNET].SDOGE_BUSD_LP_ADDRESS,
    },
    [NetworkId.TESTNET]: {
      bondAddress: addresses[NetworkId.TESTNET].SDOGE_BUSD_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.TESTNET].SDOGE_BUSD_LP_ADDRESS,
    },
  },
  // TODO: Set lp URL below when set
  lpUrl:
    "https://https://pancakeswap.finance/add/" + addresses[NetworkId.MAINNET].SDOGE_ADDRESS + "/" + addresses[NetworkId.MAINNET].BUSD_ADDRESS,
});

// export const ohm_weth = new CustomBond({
//   name: "ohm_weth_lp",
//   displayName: "OHM-WETH SLP",
//   bondToken: "WETH",
//   payoutToken: "OHM",
//   v2Bond: true,
//   bondIconSvg: OhmEthImg,
//   bondContractABI: BondOhmEthContract,
//   reserveContract: ReserveOhmEthContract,
//   isBondable: {
//     [NetworkId.MAINNET]: false,
//     [NetworkId.TESTNET]: false,
//     [NetworkId.ARBITRUM]: false,
//     [NetworkId.ARBITRUM_TESTNET]: false,
//     [NetworkId.AVALANCHE]: false,
//     [NetworkId.AVALANCHE_TESTNET]: false,
//   },
//   isLOLable: {
//     [NetworkId.MAINNET]: false,
//     [NetworkId.TESTNET]: false,
//     [NetworkId.ARBITRUM]: false,
//     [NetworkId.ARBITRUM_TESTNET]: false,
//     [NetworkId.AVALANCHE]: false,
//     [NetworkId.AVALANCHE_TESTNET]: false,
//   },
//   LOLmessage: "Maternity Leave",
//   isClaimable: {
//     [NetworkId.MAINNET]: true,
//     [NetworkId.TESTNET]: true,
//     [NetworkId.ARBITRUM]: false,
//     [NetworkId.ARBITRUM_TESTNET]: false,
//     [NetworkId.AVALANCHE]: false,
//     [NetworkId.AVALANCHE_TESTNET]: false,
//   },
//   networkAddrs: {
//     [NetworkId.MAINNET]: {
//       // TODO (appleseed): need new bond address
//       bondAddress: "0xB6C9dc843dEc44Aa305217c2BbC58B44438B6E16",
//       reserveAddress: "0x69b81152c5A8d35A67B32A4D3772795d96CaE4da",
//     },
//     [NetworkId.TESTNET]: {
//       // NOTE (unbanksy): using ohm-dai rinkeby contracts
//       bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
//       reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
//     },
//   },
//   bondType: BondType.LP,
//   lpUrl:
//     "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//   customTreasuryBalanceFunc: async function (this: CustomBond, networkId, provider) {
//     if (networkId === NetworkId.MAINNET) {
//       const ethBondContract = this.getContractForBond(networkId, provider);
//       let ethPrice: BigNumberish = await ethBondContract.assetPrice();
//       ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
//       const token = this.getContractForReserve(networkId, provider);
//       const tokenAddress = this.getAddressForReserve(networkId);
//       const bondCalculator = getBondCalculator(networkId, provider, true);
//       const tokenAmount = await token.balanceOf(addresses[networkId].TREASURY_V2);
//       const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
//       const markdown = await bondCalculator.markdown(tokenAddress || "");
//       let tokenUSD =
//         (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
//       return tokenUSD * Number(ethPrice.toString());
//     } else {
//       // NOTE (appleseed): using OHM-DAI on rinkeby
//       const token = this.getContractForReserve(networkId, provider);
//       const tokenAddress = this.getAddressForReserve(networkId);
//       const bondCalculator = getBondCalculator(networkId, provider, false);
//       const tokenAmount = await token.balanceOf(addresses[networkId].TREASURY_ADDRESS);
//       const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
//       const markdown = await bondCalculator.markdown(tokenAddress || "");
//       let tokenUSD =
//         (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
//       return tokenUSD;
//     }
//   },
// });

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
  busd,
  sdoge_busd,
  wbnb
];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds = [];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
