import React, { memo } from "react";
import "./treasury-dashboard.scss";
import { Box, Container, Grid, Paper, useMediaQuery, Zoom } from "@material-ui/core";
import {
  CircSupply,
  MarketCap,
  SDAOPrice,
  StakedPercentage,
} from "./components/Metric/Metric";
import { MetricCollection } from "src/components/Metric";

const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className="hero-metrics">
          <Paper className="sdao-card">
            <MetricCollection>
              <MarketCap />
              <SDAOPrice />
              <StakedPercentage />
              {/*<GSDAOPrice />*/}
              <CircSupply />
              {/*<BackingPerSDAO />*/}
              {/*<CurrentIndex />*/}
            </MetricCollection>
          </Paper>
        </Box>
        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Paper className="sdao-card sdao-chart-card">
                {/*TODO: Set content here*/}
              </Paper>
            </Grid>

            {/*<Grid item lg={6} md={6} sm={12} xs={12}>*/}
            {/*  <Paper className="sdao-card sdao-chart-card">*/}
            {/*    <MarketValueGraph />*/}
            {/*  </Paper>*/}
            {/*</Grid>*/}

            {/*<Grid item lg={6} md={6} sm={12} xs={12}>*/}
            {/*  <Paper className="sdao-card sdao-chart-card">*/}
            {/*    <RiskFreeValueGraph />*/}
            {/*  </Paper>*/}
            {/*</Grid>*/}

            {/*<Grid item lg={6} md={6} sm={12} xs={12}>*/}
            {/*  <Paper className="sdao-card sdao-chart-card">*/}
            {/*    <ProtocolOwnedLiquidityGraph />*/}
            {/*  </Paper>*/}
            {/*</Grid>*/}

            {/*  Temporarily removed until correct data is in the graph */}
            {/* <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="sdao-card">
                <Chart
                  type="bar"
                  data={data}
                  dataKey={["holders"]}
                  headerText="Holders"
                  stroke={[theme.palette.text.secondary]}
                  headerSubText={`${data.length > 0 && data[0].holders}`}
                  bulletpointColors={bulletpoints.holder}
                  itemNames={tooltipItems.holder}
                  itemType={undefined}
                  infoTooltipMessage={tooltipInfoMessages.holder}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  scale={undefined}
                  color={undefined}
                  stroke={undefined}
                  dataFormat={undefined}
                  isPOL={undefined}
                  isStaked={undefined}
                />
              </Paper>
            </Grid> */}

            {/*<Grid item lg={6} md={6} sm={12} xs={12}>*/}
            {/*  <Paper className="sdao-card sdao-chart-card">*/}
            {/*    <SDAOStakedGraph />*/}
            {/*  </Paper>*/}
            {/*</Grid>*/}

            {/*<Grid item lg={6} md={6} sm={12} xs={12}>*/}
            {/*  <Paper className="sdao-card sdao-chart-card">*/}
            {/*    <RunwayAvailableGraph />*/}
            {/*  </Paper>*/}
            {/*</Grid>*/}
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
});

export default TreasuryDashboard;
