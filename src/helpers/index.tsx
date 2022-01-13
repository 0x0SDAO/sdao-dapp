import { addresses, BLOCK_RATE_SECONDS, EPOCH_INTERVAL, NetworkId } from "../constants";
import { BigNumber, ethers } from "ethers";
import axios from "axios";

import { default as PancakePairContract } from "../abi/libraries/PancakePair.json";
import { default as PancakeFactoryContract } from "../abi/libraries/PancakeFactory.json";
import { default as ScholarDogeCirculatingSupplyContract } from "../abi/ScholarDogeCirculatingSupply.json";
import { default as BEP20Contract } from "../abi/libraries/BEP20.json";
import { default as RedeemHelperContract } from "../abi/RedeemHelper.json";

import { SvgIcon } from "@material-ui/core";
import { ReactComponent as SdogeImg } from "../assets/tokens/token_SDOGE.svg";
import { ReactComponent as SSdogeImg } from "../assets/tokens/token_sSDOGE.svg";

import { sdoge_busd } from "./AllBonds";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import {
  BEP20, BUSD__factory,
  PancakeFactory,
  PancakePair,
  PancakePair__factory,
  RedeemHelper,
  ScholarDogeCirculatingSupply, ScholarDogeCirculatingSupply__factory, ScholarDogeToken__factory,
} from "../typechain";
// import { GOHM__factory } from "src/typechain/factories/GOHM__factory";
import { EnvHelper } from "./Environment";
import { NodeHelper } from "./NodeHelper";

/**
 * gets marketPrice from SDOGE-BUSD v2
 * @returns Number like 333.33
 */
export async function getMarketPrice(networkId: number) {
  const provider = NodeHelper.getBSCCurrentStaticProvider(networkId);
  const sdoge_busd_address = sdoge_busd.getAddressForReserve(networkId);
  const pairContract = new ethers.Contract(sdoge_busd_address || "", PancakePairContract.abi, provider) as PancakePair;

  const sdoge_address = addresses[networkId].SDOGE_ADDRESS;
  const reserves = await pairContract.getReserves();
  const token0 = await pairContract.token0();

  const sdogeReserve = BigNumber.from((sdoge_address == token0) ? reserves[0] : reserves[1]);
  const busdReserve = BigNumber.from((sdoge_address == token0) ? reserves[1] : reserves[0]);
  const priceWithDecimals = busdReserve.div(sdogeReserve);

  return priceWithDecimals.div(10 ** 9).toNumber();
}

export async function getMarketPriceFromPair(networkId: number, token0: string, token1: string) {
  const provider = NodeHelper.getBSCCurrentStaticProvider(networkId);
  const factoryContract = new ethers.Contract(addresses[networkId].FACTORY_ADDRESS || "", PancakeFactoryContract.abi, provider) as PancakeFactory;
  const pair_address = await factoryContract.getPair(token0, token1);
  const pairContract = new ethers.Contract(pair_address || "", PancakePairContract.abi, provider) as PancakePair;
  const token0Contract = new ethers.Contract(token0 || "", BEP20Contract.abi, provider) as BEP20;
  const token1Contract = new ethers.Contract(token1 || "", BEP20Contract.abi, provider) as BEP20;

  const reserves = await pairContract.getReserves();
  const pairToken0 = await pairContract.token0();
  const pairToken1 = await pairContract.token1();

  const token0Reserve = (token0 == pairToken0) ? reserves[0] : reserves[1];
  const token1Reserve = (token1 == pairToken1) ? reserves[1] : reserves[0];
  const token0Decimals = await token0Contract.decimals();
  const token1Decimals = await token1Contract.decimals();

  return bigNumberToDecimal(token1Reserve, token1Decimals) / bigNumberToDecimal(token0Reserve, token0Decimals);
}

export function bigNumberToDecimal(nb: BigNumber, decimals: number) {
  const strNb = nb.toString();

  return Number.parseInt(strNb.substring(0, strNb.length - decimals));
}

/**
 * gets circulatingSupply
 * @returns Number
 */
export async function getCirculatingSupply(networkId: number) {
  const provider = NodeHelper.getBSCCurrentStaticProvider(networkId);
  const sdogeCirculatingSupplyAddress = addresses[networkId].CIRCULATING_SUPPLY_ADDRESS;
  const circulatingSupplyContract = new ethers.Contract(sdogeCirculatingSupplyAddress || "", ScholarDogeCirculatingSupplyContract.abi, provider) as ScholarDogeCirculatingSupply;

  return (await circulatingSupplyContract.SDOGECirculatingSupply()).div(10 ** 9).toNumber();
}

/**
 * gets totalSupply
 * @returns Number
 */
export async function getTotalSupply(networkId: number) {
  const provider = NodeHelper.getBSCCurrentStaticProvider(networkId);
  const sdogeAddress = addresses[networkId].SDOGE_ADDRESS;
  const sdogeContract = new ethers.Contract(sdogeAddress || "", BEP20Contract.abi, provider) as BEP20;

  return bigNumberToDecimal(await sdogeContract.totalSupply(), 9);
}

/**
 * gets marketCap
 * @returns Number
 */
export async function getMarketCap(networkId: number) {
  const marketPrice = await getMarketPrice(networkId);
  const circulatingSupply = await getCirculatingSupply(networkId);

  return marketPrice * circulatingSupply;
}

/**
 * gets marketCap
 * @returns Number
 */
export async function getStakingTVL(networkId: number) {
  const provider = NodeHelper.getBSCCurrentStaticProvider(networkId);
  const sdogeAddress = addresses[networkId].SDOGE_ADDRESS;
  const sdogeContract = new ethers.Contract(sdogeAddress || "", BEP20Contract.abi, provider) as BEP20;
  const stakedSupply = (await sdogeContract.balanceOf(addresses[networkId].STAKING_ADDRESS)).div(10 ** 9).toNumber();
  const marketPrice = await getMarketPrice(networkId);

  return marketPrice * stakedSupply;
}

/**
 * gets marketCap
 * @returns Number
 */
export async function getStakingPercentage(networkId: number) {
  const provider = NodeHelper.getBSCCurrentStaticProvider(networkId);
  const sdogeAddress = addresses[networkId].SDOGE_ADDRESS;
  const sdogeContract = new ethers.Contract(sdogeAddress || "", BEP20Contract.abi, provider) as BEP20;
  const stakedSupply = (await sdogeContract.balanceOf(addresses[networkId].STAKING_ADDRESS)).div(10 ** 9).toNumber();
  const circulatingSupply = await getCirculatingSupply(networkId);

  return stakedSupply / circulatingSupply * 100;
}

/**
 * gets totalSupply
 * @returns Number
 */
export async function getTreasuryMarketValue(networkId: number) {
  const provider = NodeHelper.getBSCCurrentStaticProvider(networkId);
  const treasuryAddress = addresses[networkId].TREASURY_ADDRESS;
  const sdogeAddress = addresses[networkId].SDOGE_ADDRESS;
  const busdAddress = addresses[networkId].BUSD_ADDRESS;
  const sdogeContract = new ethers.Contract(sdogeAddress || "", BEP20Contract.abi, provider) as BEP20;
  const busdContract = new ethers.Contract(busdAddress || "", BEP20Contract.abi, provider) as BEP20;
  const sdogeAmount = bigNumberToDecimal((await sdogeContract.balanceOf(treasuryAddress)), 9);
  const busdAmount = bigNumberToDecimal((await busdContract.balanceOf(treasuryAddress)), 18);

  // TODO: Handle other tokens

  return (sdogeAmount * (await getMarketPrice(networkId))) + busdAmount;
}

export function getPcsBuyLinkURL(networkId: number) {
  if (networkId == NetworkId.MAINNET || networkId == NetworkId.TESTNET) {
    return "https://pancakeswap.finance/#/swap?outputCurrency=" + addresses[networkId].SDOGE_ADDRESS;
  }
}

// export async function getMarketPriceFromWeth() {
//   const mainnetProvider = NodeHelper.getMainnetStaticProvider();
//   // v2 price
//   const ohm_weth_address = ohm_weth.getAddressForReserve(NetworkId.MAINNET);
//   const wethBondContract = ohm_weth.getContractForBond(NetworkId.MAINNET, mainnetProvider);
//   const pairContract = new ethers.Contract(ohm_weth_address || "", PairContractABI, mainnetProvider) as PairContract;
//   const reserves = await pairContract.getReserves();
//
//   // since we're using OHM/WETH... also need to multiply by weth price;
//   const wethPriceBN: BigNumber = await wethBondContract.assetPrice();
//   const wethPrice = Number(wethPriceBN.toString()) / Math.pow(10, 8);
//   const marketPrice = (Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9) * wethPrice;
//   return marketPrice;
// }

/**
 * gets price of token from coingecko
 * @param tokenId STRING taken from https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 * @returns INTEGER usd value
 */
export async function getTokenPrice(tokenId = "olympus") {
  let resp;
  try {
    resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    return resp.data[tokenId].usd;
  } catch (e) {
    // console.log("coingecko api error: ", e);
  }
}

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shortenString(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function formatCurrency(c: number, precision = 0, currency = "USD") {
  if (currency === "SDOGE") return `${trim(c, precision)} SDOGE`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export function trim(number = 0, precision = 0) {
  // why would number ever be undefined??? what are we trimming?
  const array = Number(number).toFixed(8).split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  const poppedNumber = array.pop() || "0";
  array.push(poppedNumber.substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

export function getRebaseBlock(currentBlock: number) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock: number, endBlock: number) {
  const blocksAway = endBlock - startBlock;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return secondsAway;
}

export function prettyVestingPeriod(currentBlock: number, vestingBlock: number) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

function getSSDOGETokenImage() {
  return <SvgIcon component={SSdogeImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getSDOGETokenImage(w?: number, h?: number) {
  const height = h == null ? "32px" : `${h}px`;
  const width = w == null ? "32px" : `${w}px`;
  return <SvgIcon component={SdogeImg} viewBox="0 0 32 32" style={{ height, width }} />;
}

export function getTokenImage(name: string) {
  if (name === "sdoge") return getSDOGETokenImage();
  if (name === "ssdoge") return getSSDOGETokenImage();
}

// TS-REFACTOR-NOTE - Used for:
// AccountSlice.ts, AppSlice.ts, LusdSlice.ts
export function setAll(state: any, properties: any) {
  if (properties) {
    const props = Object.keys(properties);
    props.forEach(key => {
      state[key] = properties[key];
    });
  }
}

export function contractForRedeemHelper({
  networkID,
  provider,
}: {
  networkID: NetworkId;
  provider: StaticJsonRpcProvider | JsonRpcSigner;
}) {
  return new ethers.Contract(
    addresses[networkID].REDEEM_HELPER_ADDRESS as string,
    RedeemHelperContract.abi,
    provider,
  ) as RedeemHelper;
}

/**
 * returns false if SafetyCheck has fired in this Session. True otherwise
 * @returns boolean
 */
export const shouldTriggerSafetyCheck = () => {
  const _storage = window.sessionStorage;
  const _safetyCheckKey = "-oly-safety";
  // check if sessionStorage item exists for SafetyCheck
  if (!_storage.getItem(_safetyCheckKey)) {
    _storage.setItem(_safetyCheckKey, "true");
    return true;
  }
  return false;
};

/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

/**
 * subtracts two dates for use in 33-together timer
 * param (Date) dateA is the ending date object
 * param (Date) dateB is the current date object
 * returns days, hours, minutes, seconds
 * NOTE: this func previously used parseInt() to convert to whole numbers, however, typescript doesn't like
 * ... using parseInt on number params. It only allows parseInt on string params. So we converted usage to
 * ... Math.trunc which accomplishes the same result as parseInt.
 */
export const subtractDates = (dateA: Date, dateB: Date) => {
  const msA: number = dateA.getTime();
  const msB: number = dateB.getTime();

  let diff: number = msA - msB;

  let days = 0;
  if (diff >= 86400000) {
    days = Math.trunc(diff / 86400000);
    diff -= days * 86400000;
  }

  let hours = 0;
  if (days || diff >= 3600000) {
    hours = Math.trunc(diff / 3600000);
    diff -= hours * 3600000;
  }

  let minutes = 0;
  if (hours || diff >= 60000) {
    minutes = Math.trunc(diff / 60000);
    diff -= minutes * 60000;
  }

  let seconds = 0;
  if (minutes || diff >= 1000) {
    seconds = Math.trunc(diff / 1000);
  }
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const toBN = (num: number) => {
  return BigNumber.from(num);
};

export const bnToNum = (bigNum: BigNumber) => {
  return Number(bigNum.toString());
};

export const handleContractError = (e: any) => {
  if (EnvHelper.env.NODE_ENV !== "production") console.warn("caught error in slices; usually network related", e);
};

interface ICheckBalance extends IBaseAsyncThunk {
  readonly ssdogebalance: string;
}

// export const getGohmBalFromSohm = async ({ provider, networkID, sOHMbalance }: ICheckBalance) => {
//   const gOhmContract = GOHM__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
//   const formattedGohmBal = await gOhmContract.balanceTo(ethers.utils.parseUnits(sOHMbalance, "gwei").toString());
//   return ethers.utils.formatEther(formattedGohmBal);
// };
