import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

import { default as BEP20Contract } from "src/abi/interfaces/IBEP20.json";
import { getTokenPrice } from "src/helpers";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { BEP20, BSCContract, PancakePair } from "src/typechain";
import { addresses, NetworkId } from "src/constants";
import React from "react";

export enum BondType {
  StableAsset,
  LP,
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export type NetworkAddresses = { [key in NetworkId]?: BondAddresses };
export type Available = { [key in NetworkId]?: boolean };

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  isBondable: Available; // aka isBondable => set false to hide
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  isLOLable: Available; // aka isBondable => set false to hide
  LOLmessage: string; // aka isBondable => set false to hide
  isClaimable: Available; // set false to hide
  bondIconSvg: React.ReactNode; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
  payoutToken: string; // Token the user will receive - currently SDOGE on bsc
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly isBondable: Available;
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  readonly isLOLable: Available;
  readonly LOLmessage: string;
  readonly isClaimable: Available;
  readonly type: BondType;
  readonly bondIconSvg: React.ReactNode;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;
  readonly payoutToken: string;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;

  // Async method that returns a Promise
  abstract getTreasuryBalance(NetworkId: NetworkId, provider: StaticJsonRpcProvider): Promise<number>;

  constructor(type: BondType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.isBondable = bondOpts.isBondable;
    // NOTE (appleseed): temporary for ONHOLD MIGRATION
    this.isLOLable = bondOpts.isLOLable;
    this.LOLmessage = bondOpts.LOLmessage;
    this.type = type;
    this.isClaimable = bondOpts.isClaimable;
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.bondToken = bondOpts.bondToken;
    this.payoutToken = bondOpts.payoutToken;
  }

  /**
   * makes isBondable accessible within Bonds.ts
   * @param NetworkId
   * @returns boolean
   */
  getBondability(NetworkId: NetworkId) {
    return this.isBondable[NetworkId];
  }
  getClaimability(NetworkId: NetworkId) {
    return this.isClaimable[NetworkId];
  }
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  getLOLability(NetworkId: NetworkId) {
    return this.isLOLable[NetworkId];
  }

  getAddressForBond(NetworkId: NetworkId) {
    return this.networkAddrs[NetworkId]?.bondAddress;
  }

  getContractForBond(NetworkId: NetworkId, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(NetworkId) || "";
    return new ethers.Contract(bondAddress, this.bondContractABI, provider) as BSCContract;
  }

  getAddressForReserve(NetworkId: NetworkId) {
    return this.networkAddrs[NetworkId]?.reserveAddress;
  }
  getContractForReserve(NetworkId: NetworkId, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(NetworkId) || "";
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as BSCContract;
  }
  getPairContractForReserve(NetworkId: NetworkId, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(NetworkId) || "";
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as PancakePair;
  }
  getBEP20ContractForReserve(NetworkId: NetworkId, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(NetworkId) || "";
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as BEP20;
  }

  // TODO (appleseed): improve this logic
  async getBondReservePrice(NetworkId: NetworkId, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    let marketPrice: number;
    if (this.isLP) {
      const pairContract = this.getPairContractForReserve(NetworkId, provider);
      const reserves = await pairContract.getReserves();
      marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
    } else {
      // TODO: Update here ? see logic
      marketPrice = await getTokenPrice("convex-finance");
    }
    return marketPrice;
  }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string;
}

export class LPBond extends Bond {
  readonly isLP = true;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(lpBondOpts: LPBondOpts) {
    super(BondType.LP, lpBondOpts);

    this.lpUrl = lpBondOpts.lpUrl;
    this.reserveContract = lpBondOpts.reserveContract;
    this.displayUnits = "LP";
  }
  async getTreasuryBalance(NetworkId: NetworkId, provider: StaticJsonRpcProvider) {
    const token = this.getBEP20ContractForReserve(NetworkId, provider);
    const tokenAddress = this.getAddressForReserve(NetworkId);
    const bondCalculator = getBondCalculator(NetworkId, provider);
    const tokenAmount = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
    const markdown = await bondCalculator.markdown(tokenAddress || "");
    const tokenUSD = (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
    return Number(tokenUSD.toString());
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export type StableBondOpts = BondOpts
export class StableBond extends Bond {
  readonly isLP = false;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondType.StableAsset, stableBondOpts);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.displayName;
    this.reserveContract = BEP20Contract.abi; // The Standard IBEP20 since they're normal tokens
  }

  async getTreasuryBalance(NetworkId: NetworkId, provider: StaticJsonRpcProvider) {
    const token = this.getBEP20ContractForReserve(NetworkId, provider);
    const tokenAmount = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    return Number(tokenAmount.toString()) / Math.pow(10, 18);
  }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  bondType: number;
  lpUrl: string;
  customTreasuryBalanceFunc: (
    this: CustomBond,
    NetworkId: NetworkId,
    provider: StaticJsonRpcProvider,
  ) => Promise<number>;
}
export class CustomBond extends Bond {
  readonly isLP: boolean;
  getTreasuryBalance(NetworkId: NetworkId, provider: StaticJsonRpcProvider): Promise<number> {
    throw new Error("Method not implemented.");
  }
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  readonly lpUrl: string;

  constructor(customBondOpts: CustomBondOpts) {
    super(customBondOpts.bondType, customBondOpts);

    this.isLP = customBondOpts.bondType === BondType.LP;
    this.lpUrl = customBondOpts.lpUrl;
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOpts.displayName;
    this.reserveContract = customBondOpts.reserveContract;
    this.getTreasuryBalance = customBondOpts.customTreasuryBalanceFunc.bind(this);
  }
}
