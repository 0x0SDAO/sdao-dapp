import { useState } from "react";
import "./Announcement.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Box, IconButton, Paper, SvgIcon, Typography } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "src/assets/icons/info.svg";
import { Trans } from "@lingui/macro";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

function Announcement() {
  const [newNetworkVisible, setNewNetworkVisible] = useState(true);
  const isMobileScreen = useMediaQuery("(max-width: 513px)");

  const handleClose = () => {
    setNewNetworkVisible(false);
  };

  return (
    <div className="announcement-banner sdao-card">
      {newNetworkVisible && (
        <>
          <Paper className="new-network" style={isMobileScreen ? { borderRadius: 0 } : { width: "100%" }}>
            <Box style={{ width: "2%" }}/>
            <Box display="flex" alignItems="center">
              <Box className="new-network-box" style={{ marginRight: "10px" }}>
                <SvgIcon component={InfoIcon} />
              </Box>

              <Box className="new-network-box">
                <Typography variant="body2">
                  <Trans>
                    You are not connected or on the wrong network. You will only be able to see data from supported mainnet.
                  </Trans>
                </Typography>
              </Box>
            </Box>

            <Box>
              <IconButton onClick={handleClose}>
                <SvgIcon color="primary" component={XIcon} />
              </IconButton>
            </Box>
          </Paper>
        </>
      )}
    </div>
  );
}

export default Announcement;
