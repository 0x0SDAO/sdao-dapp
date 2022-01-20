import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
import { default as IERC20Contract } from "../abi/IERC20.json";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "./MessagesSlice";
import { IActionValueAsyncThunk, IPresaleApprovalThunk, IJsonRPCError, IValueAsyncThunk } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, PrivateSale__factory, ScholarDAOToken__factory } from "src/typechain";
import ReactGA from "react-ga";
import { loadAppDetails } from "./AppSlice";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changePrivateSaleTokenInApproval = createAsyncThunk(
  "privateSale/changePrivateSaleTokenInApproval",
  async ({ provider, address, networkID }: IPresaleApprovalThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(
      addresses[networkID].DAI_ADDRESS as string,
      IERC20Contract.abi,
      signer
    ) as IERC20;
    let approveTx;
    let tokenInAllowance = await daiContract.allowance(address, addresses[networkID].PRIVATE_SALE_ADDRESS);
    // return early if approval has already happened
    if (tokenInAllowance.gt(BigNumber.from("0"))) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          privateSale: {
            privateSaleTokenInAllowance: +tokenInAllowance,
          },
        }),
      );
    }

    try {
      approveTx = await daiContract.approve(
        addresses[networkID].PRIVATE_SALE_ADDRESS,
        ethers.utils.parseUnits("100000", "ether").toString(),
      );

      const text = "Approve private sale for buying";
      const pendingTxnType = "approve_private_sale";
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
    tokenInAllowance = await daiContract.allowance(address, addresses[networkID].PRIVATE_SALE_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        privateSale: {
          privateSaleTokenInAllowance: +tokenInAllowance
        },
      }),
    );
  },
);

export const changeSDAOPSDAOBurnApproval = createAsyncThunk(
  "privateSale/changeSDAOPSDAOBurnApproval",
  async ({ provider, address, networkID }: IPresaleApprovalThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const psdaoContract = new ethers.Contract(
      addresses[networkID].PSDAO_ADDRESS as string,
      IERC20Contract.abi,
      signer
    ) as IERC20;
    let approveTx;
    let allowance = await psdaoContract.allowance(address, addresses[networkID].SDAO_ADDRESS);
    // return early if approval has already happened
    if (allowance.gt(BigNumber.from("0"))) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          privateSale: {
            sdaoPsdaoBurnAllowance: +allowance,
          },
        }),
      );
    }

    try {
      approveTx = await psdaoContract.approve(
        addresses[networkID].SDAO_ADDRESS,
        ethers.utils.parseUnits("100000", "ether").toString(),
      );

      const text = "Approve SDAO to PSDAO";
      const pendingTxnType = "approve_sdao_psdao_burn";
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
    allowance = await psdaoContract.allowance(address, addresses[networkID].SDAO_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        privateSale: {
          sdaoPsdaoBurnAllowance: +allowance
        },
      }),
    );
  },
);

export const buyPSDAO = createAsyncThunk(
  "privateSale/buyPSDAO",
  async ({ value, provider, address, networkID }: IValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const privateSale = PrivateSale__factory.connect(addresses[networkID].PRIVATE_SALE_ADDRESS, signer);

    let buyTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      uaData.type = "buy_PSDAO";
      buyTx = await privateSale.buyPSDAO(ethers.utils.parseUnits(value, "ether"));

      const pendingTxnType = "buy_PSDAO";
      uaData.txHash = buyTx.hash;
      dispatch(fetchPendingTxns({ txnHash: buyTx.hash, text: "Buying PSDAO", type: pendingTxnType }));
      await buyTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to buy more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (buyTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "PrivateSale",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(buyTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(loadAppDetails({ networkID, provider }));
  },
);

export const claimSDAO = createAsyncThunk(
  "privateSale/claimPSDAO",
  async ({ value, provider, address, networkID }: IValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const sdao = ScholarDAOToken__factory.connect(addresses[networkID].SDAO_ADDRESS, signer);

    let claimTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      uaData.type = "claim_SDAO";
      claimTx = await sdao.claimWithPSDAO();

      const pendingTxnType = "claim_SDAO";
      uaData.txHash = claimTx.hash;
      dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text: "Claiming SDAO", type: pendingTxnType }));
      await claimTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to buy more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (claimTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "PrivateSale",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(claimTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(loadAppDetails({ networkID, provider }));
  },
);
