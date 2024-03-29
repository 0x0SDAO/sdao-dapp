/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "BondDepository",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BondDepository__factory>;
    getContractFactory(
      name: "BondDepositoryWFTM",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BondDepositoryWFTM__factory>;
    getContractFactory(
      name: "BondingCalculator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BondingCalculator__factory>;
    getContractFactory(
      name: "Distributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Distributor__factory>;
    getContractFactory(
      name: "IBond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBond__factory>;
    getContractFactory(
      name: "IBondCalculator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBondCalculator__factory>;
    getContractFactory(
      name: "IBondingCalculator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBondingCalculator__factory>;
    getContractFactory(
      name: "IDistributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDistributor__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Burnable__factory>;
    getContractFactory(
      name: "IERC20Mintable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Mintable__factory>;
    getContractFactory(
      name: "IERC2612Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC2612Permit__factory>;
    getContractFactory(
      name: "IOwnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOwnable__factory>;
    getContractFactory(
      name: "IPolicy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPolicy__factory>;
    getContractFactory(
      name: "IScholarDAOToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IScholarDAOToken__factory>;
    getContractFactory(
      name: "IStakedScholarDAOToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStakedScholarDAOToken__factory>;
    getContractFactory(
      name: "IStaking",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStaking__factory>;
    getContractFactory(
      name: "ITreasury",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITreasury__factory>;
    getContractFactory(
      name: "IUniswapV2Callee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Callee__factory>;
    getContractFactory(
      name: "IUniswapV2ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2ERC20__factory>;
    getContractFactory(
      name: "IUniswapV2Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Factory__factory>;
    getContractFactory(
      name: "IUniswapV2Pair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Pair__factory>;
    getContractFactory(
      name: "IUniswapV2Router01",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router01__factory>;
    getContractFactory(
      name: "IUniswapV2Router02",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV2Router02__factory>;
    getContractFactory(
      name: "IWETH",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Permit__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Policy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Policy__factory>;
    getContractFactory(
      name: "UniswapV2ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV2ERC20__factory>;
    getContractFactory(
      name: "UniswapV2Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV2Factory__factory>;
    getContractFactory(
      name: "UniswapV2Pair",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV2Pair__factory>;
    getContractFactory(
      name: "UniswapV2Router",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV2Router__factory>;
    getContractFactory(
      name: "UniswapV2Router01",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UniswapV2Router01__factory>;
    getContractFactory(
      name: "VaultOwned",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VaultOwned__factory>;
    getContractFactory(
      name: "PresaleScholarDAOToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PresaleScholarDAOToken__factory>;
    getContractFactory(
      name: "PrivateSale",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PrivateSale__factory>;
    getContractFactory(
      name: "RedeemHelper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RedeemHelper__factory>;
    getContractFactory(
      name: "ScholarDAOCirculatingSupply",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ScholarDAOCirculatingSupply__factory>;
    getContractFactory(
      name: "ScholarDAOToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ScholarDAOToken__factory>;
    getContractFactory(
      name: "StakedScholarDAOToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StakedScholarDAOToken__factory>;
    getContractFactory(
      name: "Staking",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Staking__factory>;
    getContractFactory(
      name: "Treasury",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Treasury__factory>;

    getContractAt(
      name: "BondDepository",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BondDepository>;
    getContractAt(
      name: "BondDepositoryWFTM",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BondDepositoryWFTM>;
    getContractAt(
      name: "BondingCalculator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BondingCalculator>;
    getContractAt(
      name: "Distributor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Distributor>;
    getContractAt(
      name: "IBond",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBond>;
    getContractAt(
      name: "IBondCalculator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBondCalculator>;
    getContractAt(
      name: "IBondingCalculator",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBondingCalculator>;
    getContractAt(
      name: "IDistributor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDistributor>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC20Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Burnable>;
    getContractAt(
      name: "IERC20Mintable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Mintable>;
    getContractAt(
      name: "IERC2612Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC2612Permit>;
    getContractAt(
      name: "IOwnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IOwnable>;
    getContractAt(
      name: "IPolicy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPolicy>;
    getContractAt(
      name: "IScholarDAOToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IScholarDAOToken>;
    getContractAt(
      name: "IStakedScholarDAOToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IStakedScholarDAOToken>;
    getContractAt(
      name: "IStaking",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IStaking>;
    getContractAt(
      name: "ITreasury",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ITreasury>;
    getContractAt(
      name: "IUniswapV2Callee",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Callee>;
    getContractAt(
      name: "IUniswapV2ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2ERC20>;
    getContractAt(
      name: "IUniswapV2Factory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Factory>;
    getContractAt(
      name: "IUniswapV2Pair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Pair>;
    getContractAt(
      name: "IUniswapV2Router01",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router01>;
    getContractAt(
      name: "IUniswapV2Router02",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV2Router02>;
    getContractAt(
      name: "IWETH",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "AggregatorV3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV3Interface>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Permit>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Policy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Policy>;
    getContractAt(
      name: "UniswapV2ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV2ERC20>;
    getContractAt(
      name: "UniswapV2Factory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV2Factory>;
    getContractAt(
      name: "UniswapV2Pair",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV2Pair>;
    getContractAt(
      name: "UniswapV2Router",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV2Router>;
    getContractAt(
      name: "UniswapV2Router01",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UniswapV2Router01>;
    getContractAt(
      name: "VaultOwned",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VaultOwned>;
    getContractAt(
      name: "PresaleScholarDAOToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PresaleScholarDAOToken>;
    getContractAt(
      name: "PrivateSale",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PrivateSale>;
    getContractAt(
      name: "RedeemHelper",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RedeemHelper>;
    getContractAt(
      name: "ScholarDAOCirculatingSupply",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ScholarDAOCirculatingSupply>;
    getContractAt(
      name: "ScholarDAOToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ScholarDAOToken>;
    getContractAt(
      name: "StakedScholarDAOToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.StakedScholarDAOToken>;
    getContractAt(
      name: "Staking",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Staking>;
    getContractAt(
      name: "Treasury",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Treasury>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
