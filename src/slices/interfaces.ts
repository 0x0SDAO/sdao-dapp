import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "src/lib/Bond";
import { NetworkId } from "src/constants";

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkId;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly token: string;
  readonly address: string;
}

export interface IPresaleApprovalThunk extends IBaseAsyncThunk {
  readonly address: string;
  readonly amount: string;
}

export interface IChangeApprovalWithDisplayNameAsyncThunk extends IChangeApprovalAsyncThunk {
  readonly displayName: string;
  readonly insertName: boolean;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
  readonly action: string;
  readonly rebase: boolean;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

// Account Slice

export interface ICalcUserBondDetailsAsyncThunk extends IBaseAddressAsyncThunk, IBaseBondAsyncThunk {}

// Bond Slice

export interface IBaseBondAsyncThunk extends IBaseAsyncThunk {
  readonly bond: Bond;
}

export interface IApproveBondAsyncThunk extends IBaseBondAsyncThunk {
  readonly address: string;
}

export interface ICalcBondDetailsAsyncThunk extends IBaseBondAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IBondAssetAsyncThunk extends IBaseBondAsyncThunk, IValueAsyncThunk {
  readonly slippage: number;
}

export interface IRedeemBondAsyncThunk extends IBaseBondAsyncThunk {
  readonly address: string;
  readonly autostake: boolean;
}

export interface IRedeemAllBondsAsyncThunk extends IBaseAsyncThunk {
  readonly bonds: Bond[];
  readonly address: string;
  readonly autostake: boolean;
}
