import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { t, Trans } from "@lingui/macro";
import TabPanel from "../../components/TabPanel";
import { getSDOGETokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import "./v1stake.scss";
import StakeRow from "./StakeRow";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ssdogeImg = getTokenImage("ssdoge");
const sdogeImg = getSDOGETokenImage(16, 16);

function V1Stake() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, connect, networkId } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const stakedPercentage = useSelector(state => {
    return state.app.stakedPercentage;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const sdogeBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sdoge;
  });
  const ssdogeBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ssdoge;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.sdogeStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.sdogeUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  // const gSdogeBalance = useAppSelector(state => {
  //   return state.account.balances && state.account.balances.gsdoge;
  // });

  // const calculateWrappedAsSsdoge = balance => {
  //   return Number(balance) * Number(currentIndex);
  // };
  // const gSdogeAsSsdoge = calculateWrappedAsSsdoge(gSdogeBalance);

  const setMax = () => {
    if (view === 0) {
      setQuantity(sdogeBalance);
    } else {
      setQuantity(ssdogeBalance);
    }
  };

  const onSeekApproval = async (token) => {
    await dispatch(changeApproval({ token, provider, address, networkID: networkId }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(sdogeBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your SDOGE balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(ssdogeBalance, "gwei"))) {
      return dispatch(error("You cannot unstake more than your SSDOGE balance."));
    }

    await dispatch(
      changeStake({ address, action, value: quantity.toString(), provider, networkID: networkId }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "sdoge") return stakeAllowance > 0;
      if (token === "ssdoge") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [ssdogeBalance/*, gSdogeAsSsdoge*/]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  // const goToV2Stake = () => {
  //   history.push("/stake");
  // };

  // const goToBonds = () => {
  //   history.push("/bonds");
  // };

  return (
    <div id="v1-stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`sdoge-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">
                  <Trans>Single Stake</Trans>
                </Typography>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>APY</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingAPY ? (
                          <>{new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}%</>
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-locked-percentage">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Staked supply</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakedPercentage ? <>{stakedPercentage.toFixed(2)} %</> : <Skeleton width="150px" />}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>TVL</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingTVL ? (
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">
                    <Trans>Connect your wallet to stake SDOGE</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label={t`Stake`} {...a11yProps(0)} />
                      <Tab label={t`Unstake`} {...a11yProps(1)} />
                    </Tabs>

                    <Box className="stake-action-row v1-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("sdoge") && view === 0) ||
                        (!hasAllowance("ssdoge") && view === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  <Trans>First time staking</Trans> <b>SDOGE</b>?
                                  <br />
                                  <Trans>Please approve ScholarDoge Dao to use your</Trans> <b>SDOGE</b>{" "}
                                  <Trans>for staking</Trans>.
                                </>
                              ) : (
                                <>
                                  <Trans>First time unstaking</Trans> <b>SSDOGE</b>?
                                  <br />
                                  <Trans>Please approve ScholarDoge Dao to use your</Trans> <b>SSDOGE</b>{" "}
                                  <Trans>for unstaking</Trans>.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="sdoge-input" variant="outlined" color="primary">
                            <InputLabel htmlFor="amount-input"/>
                            <OutlinedInput
                              id="amount-input"
                              type="number"
                              placeholder="Enter an amount"
                              className="stake-input"
                              value={quantity}
                              onChange={e => setQuantity(e.target.value)}
                              labelWidth={0}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Button variant="text" onClick={setMax} color="inherit">
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <Grid item xs={12} sm={4} className="stake-grid-item">
                        <TabPanel value={view} index={0} className="stake-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasAllowance("sdoge") ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "staking")}
                                onClick={() => {
                                  onChangeStake("stake");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "staking", t`Stake SDOGE`)}
                              </Button>
                            ) : (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                                onClick={() => {
                                  onSeekApproval("sdoge");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_staking", t`Approve`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>

                        <TabPanel value={view} index={1} className="stake-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : (address && hasAllowance("ssdoge"))? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "unstaking")}
                                onClick={() => {
                                  onChangeStake("unstake");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "unstaking", t`Unstake`)}
                              </Button>
                            ) : (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={() => {
                                  onSeekApproval("ssdoge");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>
                      </Grid>
                    </Box>
                  </Box>
                  <div className="stake-user-data">
                    <StakeRow
                      title={`${t`Unstaked Balance`}`}
                      id="user-balance"
                      balance={`${trim(Number(sdogeBalance), 4)} SDOGE`}
                      {...{ isAppLoading }}
                    />
                    <Accordion className="stake-accordion" square>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <StakeRow
                          title={t`Staked Balance`}
                          id="user-staked-balance"
                          balance={`${trimmedBalance} SSDOGE`}
                          {...{ isAppLoading }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <StakeRow
                          title={`${t`Single Staking`}`}
                          balance={`${trim(Number(ssdogeBalance), 4)} SSDOGE`}
                          indented
                          {...{ isAppLoading }}
                        />
                        {/*<StakeRow*/}
                        {/*  title={`${t`Wrapped Balance`} (v2)`}*/}
                        {/*  balance={`${trim(Number(gSdogeBalance), 4)} gSDOGE`}*/}
                        {/*  indented*/}
                        {/*  {...{ isAppLoading }}*/}
                        {/*/>*/}
                      </AccordionDetails>
                    </Accordion>
                    <Divider color="secondary" />
                    <StakeRow title={t`Next Reward Amount`} balance={`${nextRewardValue} SSDOGE`} {...{ isAppLoading }} />
                    <StakeRow
                      title={t`Next Reward Yield`}
                      balance={`${stakingRebasePercentage}%`}
                      {...{ isAppLoading }}
                    />
                    <StakeRow
                      title={t`ROI (5-Day Rate)`}
                      balance={`${trim(Number(fiveDayRate) * 100, 4)}%`}
                      {...{ isAppLoading }}
                    />
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default V1Stake;
