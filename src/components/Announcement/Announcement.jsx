import { useState } from "react";
import "./Announcement.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
          {/*<Paper className="new-network" style={isMobileScreen ? { borderRadius: 0 } : { width: "100%" }}>*/}
          {/*  <Box style={{ width: "2%" }}/>*/}
          {/*  <Box display="flex" alignItems="center">*/}
          {/*    <Box className="new-network-box" style={{ marginRight: "10px" }}>*/}
          {/*      <SvgIcon component={InfoIcon} />*/}
          {/*    </Box>*/}

              {/*<Box className="new-network-box">*/}
              {/*  <Typography variant="body2">*/}
              {/*    <Trans>*/}
              {/*      Treasury stats may be inaccurate during the migration. Please check telegram if you have any*/}
              {/*      questions.*/}
              {/*    </Trans>*/}
              {/*  </Typography>*/}
              {/*</Box>*/}
            {/*</Box>*/}

          {/*  <Box>*/}
          {/*    <IconButton onClick={handleClose}>*/}
          {/*      <SvgIcon color="primary" component={XIcon} />*/}
          {/*    </IconButton>*/}
          {/*  </Box>*/}
          {/*</Paper>*/}
        </>
      )}
    </div>
  );
}

export default Announcement;
