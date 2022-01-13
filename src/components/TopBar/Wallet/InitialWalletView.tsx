import { Component, ReactElement, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { ReactComponent as CloseIcon } from "src/assets/icons/x.svg";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as arrowDown } from "src/assets/icons/arrow-down.svg";
import { formatCurrency } from "src/helpers";
import { useAppSelector, useWeb3Context } from "src/hooks";
import useCurrentTheme from "src/hooks/useTheme";

import { busd } from "src/helpers/AllBonds";

import { Tokens, useWallet } from "./Token";
import { Trans } from "@lingui/macro";
import { addresses } from "src/constants";

const Borrow = ({
  Icon1,
  borrowableTokensIcons,
  borrowOn,
  href,
}: {
  Icon1: typeof Component;
  borrowableTokensIcons: typeof Component[];
  borrowOn: string;
  href: string;
}) => {
  const theme = useTheme();
  return (
    <ExternalLink href={href}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row-reverse", justifyContent: "flex-end" }}>
          {borrowableTokensIcons.map((Icon, i, arr) => (
            <Icon style={{ height: "24px", width: "24px", ...(arr.length !== i + 1 && { marginLeft: "-8px" }) }} />
          ))}
          <SvgIcon
            component={arrowDown}
            viewBox="-12 -12 48 48"
            style={{ height: "24px", width: "24px", transform: "rotate(270deg)" }}
          />
          <Icon1 style={{ height: "24px", width: "24px" }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: theme.spacing(1) }}>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right", marginRight: theme.spacing(0.5) }}>
            <Typography align="left" style={{ maxWidth: "90px", whiteSpace: "break-spaces" }}>
              Borrow on {borrowOn}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ExternalLink>
  );
};

const ExternalLink = ({ href, children, color }: { href: string; children: ReactElement; color?: any }) => {
  const theme = useTheme();
  return (
    <Button
      href={href}
      color={color}
      variant="outlined"
      size="large"
      style={{ padding: theme.spacing(1.5), maxHeight: "unset", height: "auto" }}
      fullWidth
      target={`_blank`}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%" }}>{children}</Box>
        <Box sx={{ display: "flex", alignSelf: "start" }}>
          <SvgIcon
            component={ArrowUpIcon}
            htmlColor={color === "textSecondary" ? theme.palette.text.secondary : ""}
            style={{
              position: "absolute",
              right: -2,
              top: -2,
              height: `18px`,
              width: `18px`,
              verticalAlign: "middle",
            }}
          />
        </Box>
      </Box>
    </Button>
  );
};

const DisconnectButton = () => {
  const { disconnect } = useWeb3Context();
  return (
    <Button onClick={disconnect} variant="contained" color="primary" size="large">
      <Trans>Disconnect</Trans>
    </Button>
  );
};

const CloseButton = withStyles(theme => ({
  root: {
    ...theme.overrides?.MuiButton?.containedSecondary,
    width: "30px",
    height: "30px",
  },
}))(IconButton);

const WalletTotalValue = () => {
  const { address: userAddress, networkId, providerInitialized } = useWeb3Context();
  const tokens = useWallet(userAddress, networkId, providerInitialized);
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const marketPrice = useAppSelector(s => s.app.marketPrice || 0);
  const [currency, setCurrency] = useState<"USD" | "SDOGE">("USD");

  const walletTotalValueUSD = Object.values(tokens).reduce(
    (totalValue, token) => totalValue + parseFloat(token.totalBalance) * token.price,
    0,
  );
  const walletValue = {
    USD: walletTotalValueUSD,
    SDOGE: walletTotalValueUSD / marketPrice,
  };
  return (
    <Box onClick={() => setCurrency(currency === "USD" ? "SDOGE" : "USD")}>
      <Typography style={{ lineHeight: 1.1, fontWeight: 600, fontSize: "0.975rem" }} color="textSecondary">
        MY WALLET
      </Typography>
      <Typography style={{ fontWeight: 700 }} variant="h3">
        {!isLoading ? formatCurrency(walletValue[currency], 2, currency) : <Skeleton variant="text" width={100} />}
      </Typography>
    </Box>
  );
};

function InitialWalletView({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [currentTheme] = useCurrentTheme();
  const { networkId } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <Paper>
      <Box sx={{ padding: theme.spacing(0, 3), display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: theme.spacing(3, 0) }}>
          <WalletTotalValue />
          <CloseButton size="small" onClick={onClose} aria-label="close wallet">
            <SvgIcon component={CloseIcon} color="primary" style={{ width: "15px", height: "15px" }} />
          </CloseButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(1) }}>
          <Tokens />
        </Box>

        <Box sx={{ margin: theme.spacing(2, -3) }}>
          <Divider color="secondary" />
        </Box>

        <Box
          sx={{
            ...(isSmallScreen
              ? { display: "flex", flexDirection: "column" }
              : { display: "grid", gridTemplateRows: "min-content", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }),
          }}
          style={{ gap: theme.spacing(1.5) }}
        >
          <ExternalLink
            color={currentTheme === "dark" ? "primary" : undefined}
            href={`https://pancakeswap.finance/swap?inputCurrency=${busd.getAddressForReserve(
              networkId,
            )}&outputCurrency=${addresses[networkId].SDOGE_ADDRESS}`}
          >
            <Typography>Get on Pancakeswap</Typography>
          </ExternalLink>
          {/*<Borrow*/}
          {/*  href={`https://app.rari.capital/fuse/pool/18`}*/}
          {/*  borrowOn="Rari Capital"*/}
          {/*  borrowableTokensIcons={[wethTokenImg, daiTokenImg, fraxTokenImg]}*/}
          {/*  Icon1={wsSdogeTokenImg}*/}
          {/*/>*/}
        </Box>

        <Box sx={{ marginTop: "auto", marginX: "auto", padding: theme.spacing(2) }}>
          <DisconnectButton />
        </Box>
      </Box>
    </Paper>
  );
}

export default InitialWalletView;
