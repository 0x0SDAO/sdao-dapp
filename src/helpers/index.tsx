import { addresses, BLOCK_RATE_SECONDS, EPOCH_INTERVAL, NetworkId } from "../constants";
import { BigNumber, ethers } from "ethers";
import axios from "axios";

import { default as UniswapV2PairContract } from "../abi/UniswapV2Pair.json";
import { default as UniswapV2FactoryContract } from "../abi/UniswapV2Factory.json";
import { default as ScholarDAOCirculatingSupplyContract } from "../abi/ScholarDAOCirculatingSupply.json";
import { default as ERC20Contract } from "../abi/ERC20.json";
import { default as RedeemHelperContract } from "../abi/RedeemHelper.json";

import { SvgIcon } from "@material-ui/core";
import { ReactComponent as SdaoImg } from "../assets/tokens/token_SDOGE.svg";
import { ReactComponent as SSdaoImg } from "../assets/tokens/token_sSDOGE.svg";

import { sdao_dai } from "./AllBonds";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { ERC20, RedeemHelper, ScholarDAOCirculatingSupply, UniswapV2Factory, UniswapV2Pair } from "../typechain";
import { EnvHelper } from "./Environment";
import { NodeHelper } from "./NodeHelper";

/**
 * gets marketPrice from SDAO-DAI v2
 * @returns Number like 333.33
 */
export async function getMarketPrice(networkId: number) {
  const provider = NodeHelper.getCurrentStaticProvider(networkId);
  const sdao_dai_address = sdao_dai.getAddressForReserve(networkId);
  const pairContract = new ethers.Contract(sdao_dai_address || "", UniswapV2PairContract.abi, provider) as UniswapV2Pair;

  const sdao_address = addresses[networkId].SDAO_ADDRESS;
  const reserves = await pairContract.getReserves();
  const token0 = await pairContract.token0();

  const sdaoReserve = BigNumber.from((sdao_address == token0) ? reserves[0] : reserves[1]);
  const daiReserve = BigNumber.from((sdao_address == token0) ? reserves[1] : reserves[0]);
  // Hardcoded decimals
  return bigNumberToDecimal(daiReserve, 18) / bigNumberToDecimal(sdaoReserve, 9);
}

export async function getMarketPriceFromPair(networkId: number, token0: string, token1: string) {
  const provider = NodeHelper.getCurrentStaticProvider(networkId);
  const factoryContract = new ethers.Contract(addresses[networkId].FACTORY_ADDRESS || "", UniswapV2FactoryContract.abi, provider) as UniswapV2Factory;
  const pair_address = await factoryContract.getPair(token0, token1);
  const pairContract = new ethers.Contract(pair_address || "", UniswapV2PairContract.abi, provider) as UniswapV2Pair;
  const token0Contract = new ethers.Contract(token0 || "", ERC20Contract.abi, provider) as ERC20;
  const token1Contract = new ethers.Contract(token1 || "", ERC20Contract.abi, provider) as ERC20;

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
  const provider = NodeHelper.getCurrentStaticProvider(networkId);
  const sdaoCirculatingSupplyAddress = addresses[networkId].CIRCULATING_SUPPLY_ADDRESS;
  const circulatingSupplyContract = new ethers.Contract(sdaoCirculatingSupplyAddress || "", ScholarDAOCirculatingSupplyContract.abi, provider) as ScholarDAOCirculatingSupply;

  return bigNumberToDecimal(await circulatingSupplyContract.sdaoCirculatingSupply(), 9);
}

/**
 * gets totalSupply
 * @returns Number
 */
export async function getTotalSupply(networkId: number) {
  const provider = NodeHelper.getCurrentStaticProvider(networkId);
  const sdaoAddress = addresses[networkId].SDAO_ADDRESS;
  const sdaoContract = new ethers.Contract(sdaoAddress || "", ERC20Contract.abi, provider) as ERC20;

  return bigNumberToDecimal(await sdaoContract.totalSupply(), 9);
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
  const provider = NodeHelper.getCurrentStaticProvider(networkId);
  const sdaoAddress = addresses[networkId].SDAO_ADDRESS;
  const sdaoContract = new ethers.Contract(sdaoAddress || "", ERC20Contract.abi, provider) as ERC20;
  const stakedSupply = bigNumberToDecimal(await sdaoContract.balanceOf(addresses[networkId].STAKING_ADDRESS), 9);
  const marketPrice = await getMarketPrice(networkId);

  return marketPrice * stakedSupply;
}

/**
 * gets marketCap
 * @returns Number
 */
export async function getStakingPercentage(networkId: number) {
  const provider = NodeHelper.getCurrentStaticProvider(networkId);
  const sdaoAddress = addresses[networkId].SDAO_ADDRESS;
  const sdaoContract = new ethers.Contract(sdaoAddress || "", ERC20Contract.abi, provider) as ERC20;
  const stakedSupply = bigNumberToDecimal(await sdaoContract.balanceOf(addresses[networkId].STAKING_ADDRESS), 9);
  const circulatingSupply = await getCirculatingSupply(networkId);

  return stakedSupply / circulatingSupply * 100;
}

/**
 * gets totalSupply
 * @returns Number
 */
export async function getTreasuryMarketValue(networkId: number) {
  const provider = NodeHelper.getCurrentStaticProvider(networkId);
  const treasuryAddress = addresses[networkId].TREASURY_ADDRESS;
  const sdaoAddress = addresses[networkId].SDAO_ADDRESS;
  const daiAddress = addresses[networkId].DAI_ADDRESS;
  const sdaoContract = new ethers.Contract(sdaoAddress || "", ERC20Contract.abi, provider) as ERC20;
  const daiContract = new ethers.Contract(daiAddress || "", ERC20Contract.abi, provider) as ERC20;
  const sdaoAmount = bigNumberToDecimal((await sdaoContract.balanceOf(treasuryAddress)), 9);
  const daiAmount = bigNumberToDecimal((await daiContract.balanceOf(treasuryAddress)), 18);

  // TODO: Handle other tokens / lp...

  return (sdaoAmount * (await getMarketPrice(networkId))) + daiAmount;
}

export function getSWBuyLinkURL(networkId: number) {
  if (networkId == NetworkId.MAINNET || networkId == NetworkId.TESTNET) {
    return "https://spookyswap.finance/#/swap?outputCurrency=" + addresses[networkId].SDAO_ADDRESS;
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
export async function getTokenPrice(tokenId = "sdao") {
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
  if (currency === "SDAO") return `${trim(c, precision)} SDAO`;
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

function getSSDAOTokenImage() {
  return <SvgIcon component={SSdaoImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getSDAOTokenImage(w?: number, h?: number) {
  const height = h == null ? "32px" : `${h}px`;
  const width = w == null ? "32px" : `${w}px`;
  return <SvgIcon component={SdaoImg} viewBox="0 0 32 32" style={{ height, width }} />;
}

export function getTokenImage(name: string) {
  if (name === "sdao") return getSDAOTokenImage();
  if (name === "ssdao") return getSSDAOTokenImage();
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
  readonly ssdaobalance: string;
}

// export const getGohmBalFromSohm = async ({ provider, networkID, sOHMbalance }: ICheckBalance) => {
//   const gOhmContract = GOHM__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
//   const formattedGohmBal = await gOhmContract.balanceTo(ethers.utils.parseUnits(sOHMbalance, "gwei").toString());
//   return ethers.utils.formatEther(formattedGohmBal);
// };
