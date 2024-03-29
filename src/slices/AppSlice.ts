import { ethers } from "ethers";
import { addresses, IS_PRIVATE_SALE_ENABLED } from "../constants";
import { default as SSDAOContract } from "../abi/StakedScholarDAOToken.json";
import {
  bigNumberToDecimal,
  getCirculatingSupply, getMarketCap,
  getMarketPrice,
  getStakingPercentage, getStakingTVL,
  getTokenPrice, getTreasuryMarketValue,
  setAll,
} from "../helpers";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import {
  ERC20__factory,
  PresaleScholarDAOToken__factory,
  PrivateSale__factory,
  StakedScholarDAOToken,
  Staking__factory,
} from "../typechain";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly sdaoCirculatingSupply: string;
  readonly ssdaoCirculatingSupply: string;
  readonly totalSupply: string;
  readonly sdaoPrice: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedSdao: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk) => {
    if (IS_PRIVATE_SALE_ENABLED) {
      const prvSaleAddr = addresses[networkID].PRIVATE_SALE_ADDRESS;
      const prvSaleContract = PrivateSale__factory.connect(prvSaleAddr, provider);
      const psdaoContract = PresaleScholarDAOToken__factory.connect(addresses[networkID].PSDAO_ADDRESS, provider);
      const daiContract = ERC20__factory.connect(addresses[networkID].DAI_ADDRESS, provider);

      const psdaoAvailable = bigNumberToDecimal(await psdaoContract.balanceOf(prvSaleAddr), 9);
      const psdaoInputTokenRate = (await prvSaleContract.psdaoRate()).toNumber();
      const privateSaleInputTokenBalance = await daiContract.balanceOf(prvSaleAddr);
      const outputAmount = await prvSaleContract.calcAmountRaised(privateSaleInputTokenBalance);
      const psdaoPurchased = bigNumberToDecimal(outputAmount, 9);

      return {
        psdaoAvailable,
        psdaoInputTokenRate,
        psdaoPurchased,
        privateSaleFunds: bigNumberToDecimal(privateSaleInputTokenBalance, 18)
      }
    } else {
      // let marketPrice;
      // let marketCap;
      // let stakingTVL;
      // let circSupply;
      // let totalSupply;
      // let treasuryMarketValue;

      // if (networkID == NetworkId.MAINNET) {
      //   // TODO: Implement protocol metrics below
      //   const protocolMetricsQuery = `
      //     query {
      //       _meta {
      //         block {
      //           number
      //         }
      //       }
      //       protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
      //         timestamp
      //         sdaoCirculatingSupply
      //         ssdaoCirculatingSupply
      //         totalSupply
      //         sdaoPrice
      //         marketCap
      //         totalValueLocked
      //         treasuryMarketValue
      //         nextEpochRebase
      //         nextDistributedSdao
      //       }
      //     }
      //   `;
      //
      //   const graphData = await apollo<{ protocolMetrics: IProtocolMetrics[] }>(protocolMetricsQuery);
      //
      //   if (!graphData) {
      //     console.error("Returned a null response when querying TheGraph");
      //     return;
      //   }
      //
      //   stakingTVL = parseFloat(graphData.data.protocolMetrics[0].totalValueLocked);
      //   // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
      //   // const marketPrice = parseFloat(graphData.data.protocolMetrics[0].sdaoPrice);
      //   try {
      //     const originalPromiseResult = await dispatch(
      //       loadMarketPrice({ networkID: networkID, provider: provider }),
      //     ).unwrap();
      //     marketPrice = originalPromiseResult?.marketPrice;
      //   } catch (rejectedValueOrSerializedError) {
      //     // handle error here
      //     console.error("Returned a null response from dispatch(loadMarketPrice)");
      //     return;
      //   }
      //
      //   marketCap = parseFloat(graphData.data.protocolMetrics[0].marketCap);
      //   circSupply = parseFloat(graphData.data.protocolMetrics[0].sdaoCirculatingSupply);
      //   totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
      //   treasuryMarketValue = parseFloat(graphData.data.protocolMetrics[0].treasuryMarketValue);
      //   // const currentBlock = parseFloat(graphData.data._meta.block.number);
      // } else if (provider) {
      // Custom implementation based on on-chain values
      const treasuryMarketValue = await getTreasuryMarketValue(networkID);
      // }

      // if (!provider) {
      //   console.error("failed to connect to provider, please connect your wallet");
      //   return {
      //     stakingTVL,
      //     marketPrice,
      //     marketCap,
      //     circSupply,
      //     totalSupply,
      //     treasuryMarketValue,
      //   } as IAppData;
      // }
      const block = await provider.getBlock("latest");
      const currentBlock = block.number;
      const currentBlockTimestamp = block.timestamp;

      const stakingContract = Staking__factory.connect(addresses[networkID].STAKING_ADDRESS, provider);
      const ssdaoContract = new ethers.Contract(addresses[networkID].SSDAO_ADDRESS as string, SSDAOContract.abi, provider) as StakedScholarDAOToken;

      // Calculating staking
      const epoch = await stakingContract.epoch();
      const stakingReward = epoch.distribute;
      const epochEnd = epoch.end;
      const circ = await ssdaoContract.circulatingSupply();

      const stakingRebase = Number(stakingReward.toString()) / Number(circ.toString());
      const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
      const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

      // Current index
      const currentIndex = await stakingContract.index();

      return {
        currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        stakingTVL: await getStakingTVL(networkID),
        loading: false,
        epochEnd: epochEnd.toNumber(),
        currentBlock,
        currentBlockTimestamp,
        fiveDayRate,
        stakingAPY,
        stakingRebase,
        treasuryMarketValue
      } as IAppData;
    }
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the SDAO price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from sdao-dai contract
 * - updates the App.slice when it runs
 */
export const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  // TODO: Change here for get token price on mainnet ?
  try {
    // only get marketPrice on-chain
    marketPrice = await getMarketPrice(networkID);
  } catch (e) {
    marketPrice = await getTokenPrice("sdao");
  }
  return { marketPrice };
});

export const loadCircSupply = createAsyncThunk("app/loadCircSupply", async ({ networkID, provider }: IBaseAsyncThunk) => {
  return { circSupply: await getCirculatingSupply(networkID) };
});

export const loadMarketCap = createAsyncThunk("app/loadMarketCap", async ({ networkID, provider }: IBaseAsyncThunk) => {
  return { marketCap: await getMarketCap(networkID) };
});

export const loadStakedPercentage = createAsyncThunk("app/loadStakedPercentage", async ({ networkID, provider }: IBaseAsyncThunk) => {
  return { stakedPercentage: await getStakingPercentage(networkID) };
});

export interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly stakedPercentage?: number;
  readonly currentBlock?: number;
  readonly currentBlockTimestamp?: number;
  readonly fiveDayRate?: number;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly epochEnd?: number;
  readonly psdaoAvailable?: number;
  readonly psdaoInputTokenRate?: number;
  readonly psdaoPurchased?: number;
  readonly privateSaleFunds?: number;
  readonly loading: boolean;
  readonly loadingMarketCap: boolean;
  readonly loadingStakedPercentage: boolean;
  readonly loadingCirculatingSupply: boolean;
  readonly loadingMarketPrice: boolean;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketCap: false,
  loadingStakedPercentage: false,
  loadingCirculatingSupply: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketCap.pending, (state, action) => {
        state.loadingMarketCap = true;
      })
      .addCase(loadMarketCap.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketCap = false;
      })
      .addCase(loadMarketCap.rejected, (state, { error }) => {
        state.loadingMarketCap = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadCircSupply.pending, (state, action) => {
        state.loadingCirculatingSupply = true;
      })
      .addCase(loadCircSupply.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingCirculatingSupply = false;
      })
      .addCase(loadCircSupply.rejected, (state, { error }) => {
        state.loadingCirculatingSupply = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadStakedPercentage.pending, (state, action) => {
        state.loadingStakedPercentage = true;
      })
      .addCase(loadStakedPercentage.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingStakedPercentage = false;
      })
      .addCase(loadStakedPercentage.rejected, (state, { error }) => {
        state.loadingStakedPercentage = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
