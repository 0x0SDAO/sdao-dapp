import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
import { default as IBEP20Contract } from "../abi/interfaces/IBEP20.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { loadStakedPercentage, loadAppDetails } from "./AppSlice";
import { error, info } from "./MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IBEP20, Staking__factory } from "src/typechain";
import ReactGA from "react-ga";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(
  token: string,
  stakeAllowance: BigNumber,
  unstakeAllowance: BigNumber
) {
  // set defaults
  const bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;
  // determine which allowance to check
  if (token === "sdoge") {
    applicableAllowance = stakeAllowance;
  } else if (token === "ssdoge") {
    applicableAllowance = unstakeAllowance;
  }

  // check if allowance exists
  return applicableAllowance.gt(bigZero);
}

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const sdogeContract = new ethers.Contract(addresses[networkID].SDOGE_ADDRESS as string, IBEP20Contract.abi, signer) as IBEP20;
    const ssdogeContract = new ethers.Contract(addresses[networkID].SSDOGE_ADDRESS as string, IBEP20Contract.abi, signer) as IBEP20;
    let approveTx;
    let stakeAllowance = await sdogeContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    let unstakeAllowance = await ssdogeContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            sdogeStake: +stakeAllowance,
            sdogeUnstake: +unstakeAllowance,
          },
        }),
      );
    }

    try {
      if (token === "sdoge") {
        approveTx = await sdogeContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "ssdoge") {
        approveTx = await ssdogeContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      const text = "Approve " + (token === "sdoge" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "sdoge" ? "approve_staking" : "approve_unstaking";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    stakeAllowance = await sdogeContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    unstakeAllowance = await ssdogeContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          sdogeStake: +stakeAllowance,
          sdogeUnstake: +unstakeAllowance,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID, rebase }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const staking = Staking__factory.connect(addresses[networkID].STAKING_ADDRESS, signer);

    let stakeTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "stake") {
        uaData.type = "stake";
        // 3rd arg is rebase
        // 4th argument is claim default to true
        stakeTx = await staking.stake(address, ethers.utils.parseUnits(value, "gwei"), true);
      } else {
        uaData.type = "unstake";
        // 3rd arg is trigger default to true for mainnet and false for rinkeby
        // 4th arg is rebasing
        stakeTx = await staking.unstake(address, ethers.utils.parseUnits(value, "gwei"), true);
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Staking",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(loadAppDetails({ networkID, provider }));
    dispatch(loadStakedPercentage({ networkID, provider }));
  },
);
