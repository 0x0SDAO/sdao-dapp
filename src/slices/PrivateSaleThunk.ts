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
import { bigNumberToDecimal } from "../helpers";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changePrivateSaleTokenInApproval = createAsyncThunk(
  "privateSale/changePrivateSaleTokenInApproval",
  async ({ amount, provider, address, networkID }: IPresaleApprovalThunk, { dispatch }) => {
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
    const psdaoContract = new ethers.Contract(
      addresses[networkID].PSDAO_ADDRESS as string,
      IERC20Contract.abi,
      signer
    ) as IERC20;
    let approveTx;
    let tokenInAllowance = await daiContract.allowance(address, addresses[networkID].PRIVATE_SALE_ADDRESS);
    const amount18 = ethers.utils.parseUnits(amount || "0", "ether");
    // return early if approval has already happened
    if (tokenInAllowance.gt(amount18)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          privateSale: {
            privateSaleTokenInAllowance: bigNumberToDecimal(tokenInAllowance, 18),
          },
        }),
      );
    }

    try {
      let approveAmount;

      if (amount && Number(amount) > 0) {
        approveAmount = amount18.toString();
      } else {
        approveAmount = ethers.utils.parseUnits("100000", "ether");
      }

      approveTx = await daiContract.approve(
        addresses[networkID].PRIVATE_SALE_ADDRESS,
        approveAmount,
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
    const burnAllowance = await psdaoContract.allowance(address, addresses[networkID].SDAO_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        privateSale: {
          privateSaleTokenInAllowance: bigNumberToDecimal(tokenInAllowance, 18),
          sdaoPsdaoBurnAllowance: bigNumberToDecimal(burnAllowance, 9)
        },
      }),
    );
  },
);

export const changeSDAOPSDAOBurnApproval = createAsyncThunk(
  "privateSale/changeSDAOPSDAOBurnApproval",
  async ({ amount, provider, address, networkID }: IPresaleApprovalThunk, { dispatch }) => {
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
    const psdaoContract = new ethers.Contract(
      addresses[networkID].PSDAO_ADDRESS as string,
      IERC20Contract.abi,
      signer
    ) as IERC20;
    let approveTx;
    let allowance = await psdaoContract.allowance(address, addresses[networkID].SDAO_ADDRESS);
    const amount9 = ethers.utils.parseUnits(amount || "0", "gwei");
    // return early if approval has already happened
    if (allowance.gt(amount9)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          privateSale: {
            sdaoPsdaoBurnAllowance: bigNumberToDecimal(allowance, 9),
          },
        }),
      );
    }

    try {
      let approveAmount;

      if (amount && Number(amount) > 0) {
        approveAmount = amount9.toString();
      } else {
        approveAmount = ethers.utils.parseUnits("100000", "gwei");
      }

      approveTx = await psdaoContract.approve(
        addresses[networkID].SDAO_ADDRESS,
        approveAmount,
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
    const tokenInAllowance = await daiContract.allowance(address, addresses[networkID].PRIVATE_SALE_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        privateSale: {
          privateSaleTokenInAllowance: bigNumberToDecimal(tokenInAllowance, 18),
          sdaoPsdaoBurnAllowance: bigNumberToDecimal(allowance, 9)
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
