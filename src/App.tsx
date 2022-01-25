import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { useCallback, useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import useBonds, { IAllBondData } from "./hooks/Bonds";
import { useAppSelector, useWeb3Context } from "./hooks";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { segmentUA } from "./helpers/userAnalyticHelpers";
import { shouldTriggerSafetyCheck } from "./helpers";

import { calcBondDetails } from "./slices/BondSlice";
import {
  loadAppDetails,
  loadCircSupply,
  loadMarketCap,
  loadMarketPrice,
  loadStakedPercentage,
} from "./slices/AppSlice";
import { calculateUserBondDetails, loadAccountDetails } from "./slices/AccountSlice";
import { info } from "./slices/MessagesSlice";

import { Bond, ChooseBond, TreasuryDashboard } from "./views";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import Messages from "./components/Messages/Messages";
import NotFound from "./views/404/NotFound";
import ChangeNetwork from "./views/ChangeNetwork/ChangeNetwork";
import { dark as darkTheme } from "./themes/dark.js";
import { light as lightTheme } from "./themes/light.js";
import { girth as gTheme } from "./themes/girth.js";
import "./style.scss";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import Announcement from "./components/Announcement/Announcement";
import { addresses, IS_PRIVATE_SALE_ENABLED, NetworkId } from "./constants";
import Stake from "./views/Stake/Stake";
import PrivateSale from "./views/PrivateSale/PrivateSale";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Fantom mainnet");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const queryClient = new QueryClient();

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  useSegmentAnalytics();
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch = useDispatch();
  const [theme, toggleTheme] = useTheme();
  const currentPath = location.pathname + location.hash + location.search;
  const trimmedPath = location.pathname + location.hash;
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportedNetwork, setSupportedNetwork] = useState(false);

  const { address, connect, hasCachedProvider, provider, connected, networkId, providerInitialized } = useWeb3Context();
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const [walletChecked, setWalletChecked] = useState(false);

  // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
  const { bonds, expiredBonds } = useBonds(networkId);

  async function loadDetails(whichDetails: string) {
    // NOTE (unbanksy): If you encounter the following error:
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with networkID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to networkID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setnetworkID equal to 4 before testing.
    const loadProvider = provider;

    if (whichDetails === "app") {
      loadDashboard(loadProvider);

      if (supportedNetwork) {
        loadApp(loadProvider);
      }
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected && supportedNetwork) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: networkId, provider: loadProvider }));
      // NOTE (appleseed) - tech debt - better network filtering for active bonds
      if (networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET) {
        bonds.map(bond => {
          dispatch(calcBondDetails({
            bond,
            value: "",
            provider: loadProvider,
            address: loadProvider.address,
            networkID: networkId,
          }));
        });
      }
    },
    [networkId],
  );

  const loadDashboard = useCallback(
    loadProvider => {
      dispatch(loadMarketCap({ networkID: networkId, provider: loadProvider }));
      dispatch(loadMarketPrice({ networkID: networkId, provider: loadProvider }));
      dispatch(loadStakedPercentage({ networkID: networkId, provider: loadProvider }));
      dispatch(loadCircSupply({ networkID: networkId, provider: loadProvider }));
    },
    [networkId],
  );

  const loadAccount = useCallback(
    loadProvider => {
      if (!providerInitialized) {
        return;
      }

      // dispatch(getMigrationAllowances({ address, provider: loadProvider, networkID: networkId }));

      dispatch(loadAccountDetails({ networkID: networkId, address, provider: loadProvider }));

      bonds.map(bond => {
        // NOTE: get any Claimable bonds, they may not be bondable
        if (bond.getClaimability(networkId)) {
          dispatch(calculateUserBondDetails({ address, bond, provider: loadProvider, networkID: networkId }));
        }
      });
      expiredBonds.map(bond => {
        if (bond.getClaimability(networkId)) {
          dispatch(calculateUserBondDetails({ address, bond, provider: loadProvider, networkID: networkId }));
        }
      });
    },
    [networkId, address, providerInitialized],
  );

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setSupportedNetwork(addresses[provider.network.chainId] != null);
        setWalletChecked(true);
        segmentUA({
          type: "connect",
          provider: provider,
          context: currentPath,
        });
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on dapp.scholardao.net !"));
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      setSupportedNetwork(addresses[provider.network.chainId] != null);

      if (networkId !== -1) {
        loadDetails("account");
        loadDetails("app");
      }
    }
  }, [walletChecked, networkId]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected && providerInitialized) {
      setSupportedNetwork(addresses[provider.network.chainId] != null);

      loadDetails("account");
    }
  }, [connected, networkId, providerInitialized]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  let themeMode = theme === "light" ? lightTheme : theme === "dark" ? darkTheme : gTheme;

  useEffect(() => {
    themeMode = theme === "light" ? lightTheme : darkTheme;
  }, [theme]);

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={themeMode}>
        <CssBaseline />
        {/* {isAppLoading && <LoadingSplash />} */}
        <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
          <Messages />
          <TopBar supportedNetwork={supportedNetwork} theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />

          <nav className={classes.drawer}>
            {isSmallerScreen ? (
              <NavDrawer supportedNetwork={supportedNetwork} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            ) : (
              <Sidebar supportedNetwork={supportedNetwork} />
            )}
          </nav>

          <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
            {providerInitialized && !supportedNetwork && <Announcement />}

            <Switch>
              <Route exact path="/dashboard">
                <TreasuryDashboard />
              </Route>

              <Route exact path="/">
                <Redirect to={!IS_PRIVATE_SALE_ENABLED || !supportedNetwork ? "/dashboard" : "/private-sale"} />
              </Route>

              {
                !IS_PRIVATE_SALE_ENABLED && supportedNetwork ? (
                  <>
                    <Route path="/stake">
                      <Stake />
                    </Route>

                    <Route path="/bonds">
                      {(bonds as IAllBondData[]).map(bond => {
                        return (
                          <Route exact key={bond.name} path={`/bonds/${bond.name}`}>
                            <Bond bond={bond} />
                          </Route>
                        );
                      })}
                      <ChooseBond />
                    </Route>
                  </>
                ) : (
                  supportedNetwork ? (
                    <>
                      <Route path="/private-sale">
                        <PrivateSale />
                      </Route>
                    </>
                  ) : (
                    <></>
                  )
                )
              }

              <Route path="/network">
                <ChangeNetwork />
              </Route>

              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
