import { BondType, CustomBond, LPBond, StableBond } from "src/lib/Bond";
import { addresses, NetworkId } from "src/constants";

// TODO: Set correct images below
import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as SdaoDaiImg } from "src/assets/tokens/SDAO-DAI.svg";
import { ReactComponent as wFTMImg } from "src/assets/tokens/ftm32.svg";

import { default as BondDepositoryContract } from "src/abi/BondDepository.json";
import { default as BondDepositoryWFTMContract } from "src/abi/BondDepositoryWFTM.json";
import { default as IERC20Contract } from "src/abi/IERC20.json";
import { default as UniswapV2PairContract } from "src/abi/IUniswapV2Pair.json";

import { BigNumberish } from "ethers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  payoutToken: "SDAO",
  bondIconSvg: DaiImg,
  bondContractABI: BondDepositoryContract.abi,
  isBondable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
    // [NetworkId.BSC]: false,
    // [NetworkId.BSC_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET]: false,
  },
  LOLmessage: "Sold Out",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: addresses[NetworkId.MAINNET].DAI_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.MAINNET].DAI_ADDRESS,
    },
    [NetworkId.TESTNET]: {
      bondAddress: addresses[NetworkId.TESTNET].DAI_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.TESTNET].DAI_ADDRESS,
    },
  },
});

export const wftm = new CustomBond({
  name: "wftm",
  displayName: "WFTM",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "WFTM",
  payoutToken: "SDAO",
  bondIconSvg: wFTMImg,
  bondContractABI: BondDepositoryWFTMContract.abi,
  reserveContract: IERC20Contract.abi, // The Standard ERC20 since they're normal tokens
  isBondable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET]: false,
  },
  LOLmessage: "Taking a Spa Day",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: addresses[NetworkId.MAINNET].WFTM_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.MAINNET].WFTM_ADDRESS,
    },
    [NetworkId.TESTNET]: {
      bondAddress: addresses[NetworkId.TESTNET].WFTM_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.TESTNET].WFTM_ADDRESS,
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    const wftmBondContract = this.getContractForBond(NetworkId, provider);
    let wftmPrice: BigNumberish = await wftmBondContract.assetPrice();
    wftmPrice = Number(wftmPrice.toString()) / Math.pow(10, 8);
    const token = this.getERC20ContractForReserve(NetworkId, provider);
    let wftmAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    wftmAmount = Number(wftmAmount.toString()) / Math.pow(10, 18);
    return wftmAmount * wftmPrice;
  },
});

export const sdao_dai = new LPBond({
  name: "sdao_dai_lp",
  displayName: "SDAO-DAI LP",
  bondToken: "DAI",
  payoutToken: "SDAO",
  bondIconSvg: SdaoDaiImg,
  bondContractABI: BondDepositoryContract.abi,
  reserveContract: UniswapV2PairContract.abi,
  isBondable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET]: true,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: addresses[NetworkId.MAINNET].SDAO_DAI_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.MAINNET].SDAO_DAI_LP_ADDRESS,
    },
    [NetworkId.TESTNET]: {
      bondAddress: addresses[NetworkId.TESTNET].SDAO_DAI_BOND_ADDRESS,
      reserveAddress: addresses[NetworkId.TESTNET].SDAO_DAI_LP_ADDRESS,
    },
  },
  // TODO: Set lp URL below when set
  lpUrl:
    "https://https://spookyswap.finance/add/" + addresses[NetworkId.MAINNET].SDAO_ADDRESS + "/" + addresses[NetworkId.MAINNET].DAI_ADDRESS,
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
  dai,
  sdao_dai,
  wftm
];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds = [];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
