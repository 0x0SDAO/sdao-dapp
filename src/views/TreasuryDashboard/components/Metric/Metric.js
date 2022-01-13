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

export const SDOGEPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);
  return (
    <Metric
      label={t`SDOGE Price`}
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

// export const BackingPerSDOGE = () => {
//   const backingPerSdoge = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);
//   return (
//     <Metric
//       label={t`Backing per SDOGE`}
//       metric={!isNaN(backingPerSdoge) && formatCurrency(backingPerSdoge, 2)}
//       isLoading={!backingPerSdoge}
//       {...sharedProps}
//     />
//   );
// };

// export const CurrentIndex = () => {
//   const currentIndex = useSelector(state => state.app.currentIndex);
//   return (
//     <Metric
//       label={t`Current Index`}
//       metric={currentIndex && trim(currentIndex, 2) + " SSDOGE"}
//       isLoading={!currentIndex}
//       {...sharedProps}
//       tooltip="The current index tracks the amount of SSDOGE accumulated since the beginning of staking. Basically, how much SSDOGE one would have if they staked and held a single SDOGE from day 1."
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
      tooltip={`Percentage of SDOGE circulating supply staked.`}
    />
  );
};

// export const GSDOGEPrice = () => {
//   const gSdogePrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);
//   return (
//     <Metric
//       className="metric wsoprice"
//       label={t`gSDOGE Price`}
//       metric={gSdogePrice && formatCurrency(gSdogePrice, 2)}
//       isLoading={!gSdogePrice}
//       {...sharedProps}
//       tooltip={`gSDOGE = SSDOGE * index\n\nThe price of gSDOGE is equal to the price of SDOGE multiplied by the current index`}
//     />
//   );
// };
