import { useState } from "react";
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Button,
  SvgIcon,
  Typography,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { addresses, NetworkId } from "src/constants";
import { formatCurrency } from "src/helpers";

import { ReactComponent as MoreIcon } from "src/assets/icons/more.svg";
import { ReactComponent as SdaoImg } from "src/assets/tokens/token_SDOGE32.svg";
import { ReactComponent as SSdaoImg } from "src/assets/tokens/token_SSDOGE32.svg";

import { segmentUA } from "src/helpers/userAnalyticHelpers";
import { t } from "@lingui/macro";
import TokenLogo from "../../TokenLogo";
import { ReactComponent } from "*.svg";

const Accordion = withStyles({
  root: {
    backgroundColor: "inherit",
    backdropFilter: "none",
    "-webkit-backdrop-filter": "none",
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles(theme => ({
  root: {
    minHeight: "36px",
    height: "36px",
    padding: theme.spacing(0),
    "&$expanded": {
      padding: theme.spacing(0),
      minHeight: "36px",
    },
  },
  content: {
    margin: 0,
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

export interface IToken {
  symbol: string;
  address: string;
  decimals: number;
  icon: string;
  balance: string;
  price: number;
  crossChainBalances?: { balances: Record<NetworkId, string>; isLoading: boolean };
  vaultBalances?: { [vaultName: string]: string };
  totalBalance: string;
}

const addTokenToWallet = async (token: IToken, userAddress: string) => {
  if (!window.ethereum) return;
  const host = window.location.origin;
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: `${host}/${token.icon}`,
        },
      },
    });
    segmentUA({
      address: userAddress,
      type: "Add Token",
      tokenName: token.symbol,
    });
  } catch (error) {
    console.log(error);
  }
};

interface TokenProps extends IToken {
  expanded: boolean;
  onChangeExpanded: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onAddTokenToWallet: () => void;
  decimals: number;
}

const BalanceValue = ({
  balance,
  balanceValueUSD,
  isLoading = false,
  sigFigs,
}: {
  balance: string;
  balanceValueUSD: number;
  isLoading?: boolean;
  sigFigs: number;
}) => (
  <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <Typography variant="body2" style={{ fontWeight: 600 }}>
      {!isLoading ? balance.substring(0, sigFigs).replace(".", "") : <Skeleton variant="text" width={50} />}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {!isLoading ? (
        formatCurrency(isNaN(balanceValueUSD) ? 0 : balanceValueUSD, 2)
      ) : (
        <Skeleton variant="text" width={50} />
      )}
    </Typography>
  </Box>
);

const TokenBalance = ({
  balanceLabel,
  balance,
  balanceValueUSD,
  sigFigs,
}: {
  balanceLabel: string;
  balance: string;
  balanceValueUSD: number;
  sigFigs: number;
}) => (
  <Box display="flex" flexDirection="row" justifyContent="space-between" key={balanceLabel}>
    <Typography color="textSecondary">{balanceLabel}</Typography>
    <Typography color="textSecondary">
      <BalanceValue balance={balance} sigFigs={sigFigs} balanceValueUSD={balanceValueUSD} />
    </Typography>
  </Box>
);

export const Token = ({
  symbol,
  decimals,
  icon,
  price = 0,
  vaultBalances,
  totalBalance,
  onAddTokenToWallet,
  expanded,
  onChangeExpanded,
}: TokenProps) => {
  const theme = useTheme();
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const balanceValue = parseFloat(totalBalance) * price;

  // cleanedDecimals provides up to 7 sigFigs on an 18 decimal token (gOHM) & 5 sigFigs on 9 decimal Token
  const sigFigs = decimals === 18 ? 7 : 5;

  return (
    <Accordion expanded={expanded} onChange={onChangeExpanded}>
      <AccordionSummary expandIcon={<SvgIcon component={MoreIcon} color="disabled" />}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TokenLogo svg={icon} marginRight={theme.spacing(1)}/>
          <Typography>{symbol}</Typography>
        </Box>
        <BalanceValue
          balance={totalBalance}
          sigFigs={sigFigs}
          balanceValueUSD={balanceValue}
          isLoading={isLoading}
        />
      </AccordionSummary>
      <AccordionDetails style={{ margin: "auto", padding: theme.spacing(1, 0) }}>
        <Box
          sx={{ display: "flex", flexDirection: "column", flex: 1, mx: "32px", justifyContent: "center" }}
          style={{ gap: theme.spacing(1) }}
        >
          {!!vaultBalances &&
            Object.entries(vaultBalances).map(
              ([vaultName, balance]) =>
                parseFloat(balance) > 0.01 && (
                  <TokenBalance
                    balanceLabel={`${vaultName}:`}
                    balance={balance}
                    balanceValueUSD={parseFloat(balance) * price}
                    sigFigs={sigFigs}
                  />
                ),
            )}
          <Box className="sdao-pairs" style={{ width: "100%" }}>
            <Button variant="contained" color="secondary" fullWidth onClick={onAddTokenToWallet}>
              <Typography>{t`Add to Wallet`}</Typography>
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const sumObjValues = (obj: Record<string, string> = {}) =>
  Object.values(obj).reduce((sum, b = "0.0") => sum + (parseFloat(b) || 0), 0);

export const useWallet = (
  userAddress: string,
  chainId: NetworkId,
  providerInitialized: boolean,
): Record<string, IToken> => {
  // default to mainnet while not initialized
  const networkId = providerInitialized ? chainId : NetworkId.MAINNET;

  const connectedChainBalances = useAppSelector(s => s.account.balances);
  const sdaoPrice = useAppSelector(s => s.app.marketPrice);
  const currentIndex = useAppSelector(s => s.app.currentIndex);

  // const { gsdao, wssdao, isLoading } = useCrossChainBalances(userAddress);

  const tokens = {
    sdao: {
      symbol: "SDAO",
      address: addresses[networkId].SDAO_ADDRESS,
      balance: connectedChainBalances.sdao,
      price: sdaoPrice || 0,
      icon: SdaoImg,
      decimals: 9,
    },
    ssdao: {
      symbol: "SSDAO",
      address: addresses[networkId].SSDAO_ADDRESS,
      balance: connectedChainBalances.ssdao,
      price: sdaoPrice || 0,
      icon: SSdaoImg,
      decimals: 9,
    },
  } as Record<string, Omit<IToken, "totalBalance">>;

  return Object.entries(tokens).reduce((wallet, [key, token]) => {
    const crossChainBalances = sumObjValues(token.crossChainBalances?.balances);
    const vaultBalances = sumObjValues(token.vaultBalances);
    const balance = crossChainBalances || parseFloat(token.balance) || 0;
    return {
      ...wallet,
      [key]: {
        ...token,
        totalBalance: (balance + vaultBalances).toString(),
      } as IToken,
    };
  }, {});
};

export const Tokens = () => {
  const { address: userAddress, networkId, providerInitialized } = useWeb3Context();
  const tokens = useWallet(userAddress, networkId, providerInitialized);
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const [expanded, setExpanded] = useState<string | null>(null);

  const alwaysShowTokens = [tokens.sdao, tokens.ssdao];

  const tokenProps = (token: IToken) => ({
    ...token,
    expanded: expanded === token.symbol,
    onChangeExpanded: (e: any, isExpanded: boolean) => setExpanded(isExpanded ? token.symbol : null),
    onAddTokenToWallet: () => addTokenToWallet(token, userAddress),
  });

  return (
    <>
      {alwaysShowTokens.map(token => (
        <Token key={token.symbol} {...tokenProps(token)} />
      ))}
    </>
  );
};
