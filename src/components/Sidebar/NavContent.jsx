import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as PresaleIcon } from "../../assets/icons/wallet.svg";
import { ReactComponent as SDAOIcon } from "../../assets/icons/sdoge-logo-100.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { Trans } from "@lingui/macro";
import { getSWBuyLinkURL, trim } from "../../helpers";
import { useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { IS_PRIVATE_SALE_ENABLED, NetworkId } from "src/constants";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Link,
  Paper,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import { ExpandMore } from "@material-ui/icons";

function NavContent({ handleDrawerToggle }) {
  const [isActive] = useState();
  const { networkId } = useWeb3Context();
  const { bonds } = useBonds(networkId);
  const swLink = getSWBuyLinkURL(networkId);

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://scholardao.net" target="_blank">
              <SvgIcon
                color="primary"
                component={SDAOIcon}
                viewBox="0 0 100 100"
                style={{ minWdth: "100px", minHeight: "98px", width: "100px" }}
              />
            </Link>
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET ? (
                <>
                  {!IS_PRIVATE_SALE_ENABLED ? (
                    <>
                      <Link
                        component={NavLink}
                        id="dash-nav"
                        to="/dashboard"
                        isActive={(match, location) => {
                          return checkPage(match, location, "dashboard");
                        }}
                        className={`button-dapp-menu ${isActive ? "active" : ""}`}
                        onClick={handleDrawerToggle}
                      >
                        <Typography variant="h6">
                          <SvgIcon color="primary" component={DashboardIcon} />
                          <Trans>Dashboard</Trans>
                        </Typography>
                      </Link>

                      <Link
                        href={swLink}
                        target="_blank"
                        isActive={() => false}
                        className={`button-dapp-menu`}
                        onClick={handleDrawerToggle}
                      >
                        <Typography variant="h6">
                          <SvgIcon color="primary" component={WalletIcon} />
                          <Trans>Buy on SpookySwap</Trans>
                        </Typography>
                      </Link>

                      <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/bonds"
                        isActive={(match, location) => {
                        return checkPage(match, location, "bonds");
                        }}
                        className={`button-dapp-menu ${isActive ? "active" : ""}`}
                        onClick={handleDrawerToggle}
                      >
                        <Typography variant="h6">
                        <SvgIcon color="primary" component={BondIcon} />
                        <Trans>Bond</Trans>
                        </Typography>
                      </Link>

                      <div className="dapp-menu-data discounts">
                        <div className="bond-discounts">
                        <Accordion className="discounts-accordion" square defaultExpanded>
                          <AccordionSummary
                            expandIcon={
                              <ExpandMore
                                className="discounts-expand"
                                viewbox="0 0 12 12"
                                style={{ width: "18px", height: "18px" }}
                              />
                            }
                          >
                            <Typography variant="body2">
                            <Trans>Bond discounts</Trans>
                            </Typography>
                          </AccordionSummary>
                        <AccordionDetails>
                          {bonds.map((bond, i) => {
                            // NOTE (appleseed): temporary for ONHOLD MIGRATION
                            // if (bond.getBondability(networkId)) {
                            if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
                              return (
                                <Link
                                component={NavLink}
                                to={`/bonds/${bond.name}`}
                                key={i}
                                className={"bond"}
                                onClick={handleDrawerToggle}
                                >
                                  {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                  ) : (
                                    <Typography variant="body2">
                                      {bond.displayName}

                                      <span className="bond-pair-roi">
                                        {bond.isLOLable[networkId]
                                          ? "--"
                                          : !bond.isBondable[networkId]
                                          ? "Sold Out"
                                          : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
                                        {/* {!bond.isBondable[networkId]
                                                                ? "Sold Out"
                                                                : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`} */}
                                      </span>
                                    </Typography>
                                  )}
                                </Link>
                                );
                              }
                              })}
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      </div>

                      <Link
                        component={NavLink}
                        id="stake-nav"
                        to="/stake"
                        isActive={(match, location) => {
                          return checkPage(match, location, "stake");
                        }}
                        className={`button-dapp-menu ${isActive ? "active" : ""}`}
                        onClick={handleDrawerToggle}
                      >
                        <Typography variant="h6">
                          <SvgIcon color="primary" component={StakeIcon} />
                          <Trans>Stake</Trans>
                        </Typography>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        component={NavLink}
                        id="private-sale-nav"
                        to="/private-sale"
                        isActive={(match, location) => {
                        return checkPage(match, location, "private-sale");
                        }}
                        className={`button-dapp-menu ${isActive ? "active" : ""}`}
                        onClick={handleDrawerToggle}
                      >
                        <Typography variant="h6">
                        <SvgIcon color="primary" component={PresaleIcon} />
                        <Trans>Private sale</Trans>
                        </Typography>
                      </Link>
                    </>
                    )}

                  {/*<Box className="menu-divider">*/}
                  {/*  <Divider />*/}
                  {/*</Box>*/}

                  {/*<Link*/}
                  {/*  href="https://pro.scholardao.net/"*/}
                  {/*  target="_blank"*/}
                  {/*  className="external-site-link"*/}
                  {/*  onClick={handleDrawerToggle}*/}
                  {/*>*/}
                  {/*  <Box display="flex" alignItems="center">*/}
                  {/*    <SvgIcon component={ProIcon} color="primary" color="primary" viewBox="0 0 50 50" />*/}
                  {/*    <Typography variant="h6">ScholarDAO Pro</Typography>*/}
                  {/*    <SvgIcon component={ArrowUpIcon} className="external-site-link-icon" />*/}
                  {/*  </Box>*/}
                  {/*</Link>*/}

                  {/* <Link
                    component={NavLink}
                    id="33-together-nav"
                    to="/33-together"
                    isActive={(match, location) => {
                      return checkPage(match, location, "33-together");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={PoolTogetherIcon} />
                      3,3 Together
                    </Typography>
                  </Link> */}
                  <Box className="menu-divider">
                    <Divider />
                  </Box>
                </>
              ) : (
                <>
                </>
              )}
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link
                  key={i}
                  href={`${externalUrls[link].url}`}
                  target="_blank"
                  className="external-site-link"
                  onClick={handleDrawerToggle}
                >
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                  <SvgIcon component={ArrowUpIcon} className="external-site-link-icon" />
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
