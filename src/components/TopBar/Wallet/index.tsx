import { useState } from "react";

import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import InitialWalletView from "./InitialWalletView";
import { Button, SvgIcon, SwipeableDrawer, Typography, useTheme, withStyles } from "@material-ui/core";
import { t } from "@lingui/macro";

const WalletButton = ({ openWallet }: { openWallet: () => void }) => {
  const { connect, connected, address } = useWeb3Context();
  const onClick = connected ? openWallet : connect;
  const label = connected ? address.slice(0, 6) + '...' : t`Connect Wallet`;
  const theme = useTheme();
  return (
    <Button id="sdao-menu-button" variant="contained" color="secondary" onClick={onClick}>
      <SvgIcon component={WalletIcon} style={{ marginRight: theme.spacing(1) }} />
      <Typography>{label}</Typography>
    </Button>
  );
};

const StyledSwipeableDrawer = withStyles(theme => ({
  root: {
    width: "460px",
    maxWidth: "100%",
  },
  paper: {
    maxWidth: "100%",
  },
}))(SwipeableDrawer);

export function Wallet({supportedNetwork}) {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const openWallet = () => setWalletOpen(true);

  // only enable backdrop transition on ios devices,
  // because we can assume IOS is hosted on hight-end devices and will not drop frames
  // also disable discovery on IOS, because of it's 'swipe to go back' feat
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <>
      <WalletButton openWallet={supportedNetwork ? openWallet : () => {}} />
      <StyledSwipeableDrawer
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        anchor="right"
        open={isWalletOpen}
        onOpen={openWallet}
        onClose={closeWallet}
      >
        <InitialWalletView onClose={closeWallet} />
      </StyledSwipeableDrawer>
    </>
  );
}

export default Wallet;
