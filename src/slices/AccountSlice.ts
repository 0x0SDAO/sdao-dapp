import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses, IS_PRIVATE_SALE_ENABLED } from "../constants";
import IERC20Contract from "../abi/IERC20.json";
import SSDAOContract from "../abi/StakedScholarDAOToken.json";

import { bigNumberToDecimal, handleContractError, setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import {
  ERC20__factory,
  IERC20, PresaleScholarDAOToken__factory,
  ScholarDAOToken__factory,
  StakedScholarDAOToken,
  StakedScholarDAOToken__factory,
} from "src/typechain";

interface IUserBalances {
  balances: {
    sdao: string;
    psdao?: string;
    ssdao?: string;
    dai: string;
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
    let sdaoBalance = BigNumber.from("0");
    let daiBalance = BigNumber.from("0");

    try {
      const sdaoContract = ScholarDAOToken__factory.connect(addresses[networkID].SDAO_ADDRESS, provider);
      sdaoBalance = await sdaoContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }

    try {
      const daiContract = ERC20__factory.connect(addresses[networkID].DAI_ADDRESS, provider);
      daiBalance = await daiContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }

    if (!IS_PRIVATE_SALE_ENABLED) {
      let ssdaoBalance = BigNumber.from("0");

      try {
        const ssdaoContract = StakedScholarDAOToken__factory.connect(addresses[networkID].SSDAO_ADDRESS, provider);
        ssdaoBalance = await ssdaoContract.balanceOf(address);
      } catch (e) {
        handleContractError(e);
      }

      return {
        balances: {
          sdao: ethers.utils.formatUnits(sdaoBalance, "gwei"),
          ssdao: ethers.utils.formatUnits(ssdaoBalance, "gwei"),
          dai: ethers.utils.formatUnits(daiBalance, "ether"),
        },
      };
    } else {
      let psdaoBalance = BigNumber.from("0");

      try {
        const psdaoContract = PresaleScholarDAOToken__factory.connect(addresses[networkID].PSDAO_ADDRESS, provider);
        psdaoBalance = await psdaoContract.balanceOf(address);
      } catch (e) {
        handleContractError(e);
      }

      return {
        balances: {
          sdao: ethers.utils.formatUnits(sdaoBalance, "gwei"),
          psdao: ethers.utils.formatUnits(psdaoBalance, "gwei"),
          dai: ethers.utils.formatUnits(daiBalance, "ether"),
        },
      };
    }
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (!IS_PRIVATE_SALE_ENABLED) {
      let stakeAllowance = BigNumber.from("0");
      let unstakeAllowance = BigNumber.from("0");

      try {
        const sdaoContract = new ethers.Contract(
          addresses[networkID].SDAO_ADDRESS as string,
          IERC20Contract.abi,
          provider,
        ) as IERC20;
        stakeAllowance = await sdaoContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

        const ssdaoContract = new ethers.Contract(addresses[networkID].SSDAO_ADDRESS as string, SSDAOContract.abi, provider) as StakedScholarDAOToken;
        unstakeAllowance = await ssdaoContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
      await dispatch(getBalances({ address, networkID, provider }));

      return {
        staking: {
          sdaoStake: +stakeAllowance,
          sdaoUnstake: +unstakeAllowance,
        },
      };
    } else {
      let privateSaleTokenInAllowance = BigNumber.from("0");
      let sdaoPsdaoBurnAllowance = BigNumber.from("0");

      try {
        const daiContract = new ethers.Contract(
          addresses[networkID].DAI_ADDRESS as string,
          IERC20Contract.abi,
          provider,
        ) as IERC20;
        privateSaleTokenInAllowance = await daiContract.allowance(address, addresses[networkID].PRIVATE_SALE_ADDRESS);

      } catch (e) {
        handleContractError(e);
      }

      try {
        const psdaoContract = new ethers.Contract(
          addresses[networkID].PSDAO_ADDRESS as string,
          IERC20Contract.abi,
          provider,
        ) as IERC20;
        sdaoPsdaoBurnAllowance = await psdaoContract.allowance(address, addresses[networkID].SDAO_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }

      return {
        privateSale: {
          privateSaleTokenInAllowance: bigNumberToDecimal(privateSaleTokenInAllowance, 18),
          sdaoPsdaoBurnAllowance: bigNumberToDecimal(sdaoPsdaoBurnAllowance, 9)
        },
      };
    }
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
    const reserveContract = bond.getERC20ContractForReserve(networkID, provider);
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
  // giving: { ssdaoGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  // mockGiving: { ssdaoGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  redeeming: { ssdaoRedeemable: string; recipientInfo: IUserRecipientInfo };
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    sdao: string;
    psdao?: string;
    ssdao?: string;
    dai: string;
  };
  loading: boolean;
  staking: {
    sdaoStake: number;
    sdaoUnstake: number;
  };
  privateSale: {
    privateSaleTokenInAllowance: number;
    sdaoPsdaoBurnAllowance: number;
  }
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    sdao: "",
    ssdao: "",
    dai: "",
  },
  redeeming: {
    ssdaoRedeemable: "",
    recipientInfo: {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    },
  },
  staking: { sdaoStake: 0, sdaoUnstake: 0 },
  privateSale: { privateSaleTokenInAllowance: 0, sdaoPsdaoBurnAllowance: 0 },
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
