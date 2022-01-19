import React, { useCallback, useState, ChangeEventHandler } from "react";
import { useDispatch } from "react-redux";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
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
import { t, Trans } from "@lingui/macro";

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import "./privateSale.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { useAppSelector } from "src/hooks";
import { Metric, MetricCollection } from "../../components/Metric";
import {
  buyPSDAO,
  changePrivateSaleTokenInApproval,
  changeSDAOPSDAOBurnApproval,
  claimSDAO,
} from "../../slices/PrivateSaleThunk";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function PrivateSale() {
  const dispatch = useDispatch();
  const { provider, address, connect, networkId } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const isAppLoading = useAppSelector(state => state.app.loading);

  const psdaoAvailable = useAppSelector(state => {
    return state.app.psdaoAvailable;
  });
  const psdaoInputTokenRate = useAppSelector(state => {
    return state.app.psdaoInputTokenRate;
  });
  const purchasedPSDAO = useAppSelector(state => {
    return state.app.psdaoPurchased || 0;
  });
  const raisedTokens = useAppSelector(state => {
    return state.app.privateSaleFunds || 0;
  });
  const daiUserBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.dai;
  });
  const psdaoUserBalance = useAppSelector(state => {
    return (state.account.balances && state.account.balances.psdao) || "0";
  });
  const tokenInAllowance = useAppSelector(state => {
    return (state.account.privateSale && state.account.privateSale.privateSaleTokenInAllowance) || 0;
  });
  const sdaoPsdaoBurnAllowance = useAppSelector(state => {
    return (state.account.privateSale && state.account.privateSale.sdaoPsdaoBurnAllowance) || 0;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(daiUserBalance);
    } else {
      setQuantity(psdaoUserBalance);
    }
  }

  const onPrivateSaleApproval = async () => {
    await dispatch(changePrivateSaleTokenInApproval({ address, provider, networkID: networkId }));
  };

  const onSDAOPSDAOBurnApproval = async () => {
    await dispatch(changeSDAOPSDAOBurnApproval({ address, provider, networkID: networkId }));
  };

  const onBuyPSDAO = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(quantity)) || Number(quantity) === 0 || Number(quantity) < 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    const value18 = ethers.utils.parseUnits(quantity.toString(), "ether");
    if (value18.gt(ethers.utils.parseUnits(daiUserBalance, "ether"))) {
      return dispatch(error(t`You cannot buy more than your DAI balance.`));
    }

    await dispatch(
      buyPSDAO({
        address,
        value: quantity,
        provider,
        networkID: networkId
      }),
    );
  };

  const onClaimSDAO = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(psdaoUserBalance)) || Number(psdaoUserBalance) === 0 || Number(psdaoUserBalance) < 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`You don't have enough PSDAO.`));
    }

    await dispatch(
      claimSDAO({
        address,
        value: "0",
        provider,
        networkID: networkId
      }),
    );
  };

  const hasPresaleAllowance = useCallback(
    () => {
      return tokenInAllowance > 0;
    },
    [tokenInAllowance],
  );

  const hasClaimAllowance = useCallback(
    () => {
      return sdaoPsdaoBurnAllowance > 0;
    },
    [sdaoPsdaoBurnAllowance],
  );

  const isAllowanceDataLoading = (tokenInAllowance == null && view === 0) || (sdaoPsdaoBurnAllowance == null && view === 1);

  const modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </Button>,
  );

  const changeView = (_event: React.ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  const handleChangeQuantity = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    if (Number(e.target.value) >= 0) setQuantity(e.target.value);
  }, []);

  const trimmedBalance = Number(
    [
      daiUserBalance,
      psdaoUserBalance
    ]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  return (
    <div id="private-sale-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`sdao-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Private sale</Typography>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <MetricCollection>
                <Metric
                  className="available-PSDAO"
                  label={t`Available PSDAO`}
                  metric={`${psdaoAvailable} PSDAO`}
                  isLoading={!psdaoAvailable}
                />
                <Metric
                  className="purchased-PSDAO"
                  label={t`Purchased PSDAO`}
                  metric={`${purchasedPSDAO} PSDAO`}
                  isLoading={!purchasedPSDAO}
                />
                <Metric
                  className="raised-funds"
                  label={t`Raised funds`}
                  metric={`${purchasedPSDAO} DAI`}
                  isLoading={!purchasedPSDAO}
                />
              </MetricCollection>
            </Grid>
            <div className="private-sale-area">
              {!address ? (
                <div className="private-sale-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">
                    <Trans>Connect your wallet to participate to private sale</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="private-sale-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="private-sale-tab-buttons"
                      onChange={changeView}
                      aria-label="private sale tabs"
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed ? { style: { display: "none" } } : undefined}
                    >
                      <Tab
                        label={t({
                          id: "buy_PSDAO",
                          comment: "The action of buying PSDAO tokens",
                        })}
                        {...a11yProps(0)}
                      />
                      <Tab
                        label={t({
                          id: "claim_SDAO",
                          comment: "The action of claiming SDAO tokens",
                        })}
                        {...a11yProps(1)} />
                    </Tabs>
                    <Grid container className="private-sale-action-row">
                      <Grid item xs={12} sm={8} className="private-sale-grid-item">
                        {address && !isAllowanceDataLoading ? (
                          (!hasPresaleAllowance() && view === 0) ||
                          (!hasClaimAllowance() && view === 1) ? (
                            <Box className="help-text">
                              <Typography variant="body1" className="stake-note" color="textSecondary">
                                {view === 0 ? (
                                  <>
                                    <Trans>First time purchasing</Trans> <b>PSDAO</b> ?
                                    <br />
                                    <Trans>Please approve PrivateSale to use your</Trans> <b>DAI</b>{" "}
                                    <Trans>to buy PSDAO tokens</Trans>.
                                  </>
                                ) : (
                                  <>
                                    <Trans>First time claiming</Trans> <b>SDAO</b>?
                                    <br />
                                    <Trans>Please approve ScholarDAO to use your</Trans> <b>PSDAO</b>{" "}
                                    <Trans>to claim SDAO tokens</Trans>.
                                  </>
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <FormControl className="sdao-input" variant="outlined" color="primary">
                              <InputLabel htmlFor="amount-input"/>
                              <OutlinedInput
                                id="amount-input"
                                type="number"
                                placeholder="Enter an amount"
                                className="private-sale-input"
                                value={quantity}
                                onChange={handleChangeQuantity}
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
                      </Grid>
                      <Grid item xs={12} sm={4} className="private-sale-grid-item">
                        <TabPanel value={view} index={0} className="private-sale-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasPresaleAllowance() ? (
                              <Button
                                className="buy-PSDAO-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "buy_PSDAO")}
                                onClick={() => {
                                  onBuyPSDAO();
                                }}
                              >
                                {txnButtonText(
                                  pendingTransactions,
                                  "buy_PSDAO",
                                  `${t`Buy PSDAO`}`,
                                )}
                              </Button>
                            ) : (
                              <Button
                                className="buy-PSDAO-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_private_sale")}
                                onClick={() => {
                                  onPrivateSaleApproval();
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_private_sale", t`Approve PrivateSale`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>

                        <TabPanel value={view} index={1} className="private-sale-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : (address && hasClaimAllowance()) ? (
                              <Button
                                className="buy-PSDAO-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "claim_SDAO")}
                                onClick={() => {
                                  onClaimSDAO();
                                }}
                              >
                                {txnButtonText(
                                  pendingTransactions,
                                  "claim_SDAO",
                                  `${t`Claim SDAO`}`,
                                )}
                              </Button>
                            ) : (
                              <Button
                                className="buy-PSDAO-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_sdao_psdao_burn")}
                                onClick={() => {
                                  onSDAOPSDAOBurnApproval();
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_sdao_psdao_burn", t`Approve ScholarDAO`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
      {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
      {/* <ZapCta /> */}
    </div>
  );
}

export default PrivateSale;