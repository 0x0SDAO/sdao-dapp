import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import IBEP20Contract from "../abi/interfaces/IBEP20.json";
import SSDOGEContract from "../abi/StakedScholarDogeToken.json";

import { handleContractError, setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import {
  IBEP20,
  ScholarDogeToken__factory,
  StakedScholarDogeToken,
  StakedScholarDogeToken__factory,
} from "src/typechain";

interface IUserBalances {
  balances: {
    sdoge: string;
    ssdoge: string;
  };
}

interface IUserRecipientInfo {
  totalDebt: string;
  carry: string;
  agnosticAmount: string;
  indexAtLastChange: string;
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk): Promise<IUserBalances> => {
    let sdogeBalance = BigNumber.from("0");
    let ssdogeBalance = BigNumber.from("0");

    try {
      const sdogeContract = ScholarDogeToken__factory.connect(addresses[networkID].SDOGE_ADDRESS, provider);
      sdogeBalance = await sdogeContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const ssdogeContract = StakedScholarDogeToken__factory.connect(addresses[networkID].SSDOGE_ADDRESS, provider);
      ssdogeBalance = await ssdogeContract.balanceOf(address);
    } catch (e) {
      console.log(e);
      handleContractError(e);
    }
    return {
      balances: {
        sdoge: ethers.utils.formatUnits(sdogeBalance, "gwei"),
        ssdoge: ethers.utils.formatUnits(ssdogeBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let stakeAllowance = BigNumber.from("0");
    let unstakeAllowance = BigNumber.from("0");

    try {
      const sdogeContract = new ethers.Contract(
        addresses[networkID].SDOGE_ADDRESS as string,
        IBEP20Contract.abi,
        provider,
      ) as IBEP20;
      stakeAllowance = await sdogeContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

      const ssdogeContract = new ethers.Contract(addresses[networkID].SSDOGE_ADDRESS as string, SSDOGEContract.abi, provider) as StakedScholarDogeToken;
      unstakeAllowance = await ssdogeContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    } catch (e) {
      handleContractError(e);
    }
    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        sdogeStake: +stakeAllowance,
        sdogeUnstake: +unstakeAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  // bond: string;
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getBEP20ContractForReserve(networkID, provider);
    const bondDetails = await bondContract.bondInfo(address);
    const interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    const bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    const pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance, balance = BigNumber.from(0);
    // eslint-disable-next-line prefer-const
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID) || "");
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision

    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

export interface IAccountSlice extends /*IUserAccountDetails, */IUserBalances {
  // giving: { ssdogeGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  // mockGiving: { ssdogeGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  redeeming: { ssdogeRedeemable: string; recipientInfo: IUserRecipientInfo };
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    sdoge: string;
    ssdoge: string;
    busd: string;
  };
  loading: boolean;
  staking: {
    sdogeStake: number;
    sdogeUnstake: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    sdoge: "",
    ssdoge: "",
    busd: "",
  },
  redeeming: {
    ssdogeRedeemable: "",
    recipientInfo: {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    },
  },
  staking: { sdogeStake: 0, sdogeUnstake: 0 },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
