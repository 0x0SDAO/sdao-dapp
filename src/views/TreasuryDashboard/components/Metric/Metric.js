import { useSelector } from "react-redux";
import { formatCurrency, trim } from "../../../../helpers";
import { Metric } from "src/components/Metric";
import { t } from "@lingui/macro";

const sharedProps = {
  labelVariant: "h6",
  metricVariant: "h5",
};

export const MarketCap = () => {
  const marketCap = useSelector(state => state.app.marketCap || 0);
  return (
    <Metric
      label={t`Market Cap`}
      metric={formatCurrency(marketCap, 0)}
      isLoading={!marketCap}
      {...sharedProps}
    />
  );
};

export const SDAOPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);
  return (
    <Metric
      label={t`SDAO Price`}
      metric={marketPrice && formatCurrency(marketPrice, 2)}
      isLoading={!marketPrice}
      {...sharedProps}
    />
  );
};

export const CircSupply = () => {
  const circSupply = useSelector(state => state.app.circSupply);
  return (
    <Metric
      label={t`Circulating Supply`}
      metric={circSupply && parseInt(circSupply)}
      isLoading={!circSupply}
      {...sharedProps}
    />
  );
};

// export const BackingPerSDAO = () => {
//   const backingPerSdao = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);
//   return (
//     <Metric
//       label={t`Backing per SDAO`}
//       metric={!isNaN(backingPerSdao) && formatCurrency(backingPerSdao, 2)}
//       isLoading={!backingPerSdao}
//       {...sharedProps}
//     />
//   );
// };

// export const CurrentIndex = () => {
//   const currentIndex = useSelector(state => state.app.currentIndex);
//   return (
//     <Metric
//       label={t`Current Index`}
//       metric={currentIndex && trim(currentIndex, 2) + " SSDAO"}
//       isLoading={!currentIndex}
//       {...sharedProps}
//       tooltip="The current index tracks the amount of SSDAO accumulated since the beginning of staking. Basically, how much SSDAO one would have if they staked and held a single SDAO from day 1."
//     />
//   );
// };

export const StakedPercentage = () => {
  const percentage = useSelector(state => state.app.stakedPercentage);
  return (
    <Metric
      label={t`Staked supply`}
      metric={percentage && percentage.toFixed(2) + " %"}
      isLoading={!percentage}
      {...sharedProps}
      tooltip={`Percentage of SDAO circulating supply staked.`}
    />
  );
};

// export const GSDAOPrice = () => {
//   const gSdaoPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);
//   return (
//     <Metric
//       className="metric wsoprice"
//       label={t`gSDAO Price`}
//       metric={gSdaoPrice && formatCurrency(gSdaoPrice, 2)}
//       isLoading={!gSdaoPrice}
//       {...sharedProps}
//       tooltip={`gSDAO = SSDAO * index\n\nThe price of gSDAO is equal to the price of SDAO multiplied by the current index`}
//     />
//   );
// };
