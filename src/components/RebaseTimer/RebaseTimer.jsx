import { useSelector, useDispatch } from "react-redux";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useMemo, useState } from "react";
import {
  loadAppDetails,
  loadStakedPercentage
} from "../../slices/AppSlice";
import { useWeb3Context } from "../../hooks";

function RebaseTimer() {
  const dispatch = useDispatch();
  const { provider, networkId } = useWeb3Context();

  const SECONDS_TO_REFRESH = 60;
  const [secondsToRebase, setSecondsToRebase] = useState(0);
  const [rebaseString, setRebaseString] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const currentBlockTimestamp = useSelector(state => {
    return state.app.currentBlockTimestamp;
  });
  const epochEnd = useSelector(state => {
    return state.app.epochEnd;
  })

  function initializeTimer() {
    const seconds = epochEnd - currentBlockTimestamp;
    setSecondsToRebase(seconds);
    const prettified = prettifySeconds(seconds);
    setRebaseString(prettified !== "" ? prettified : "Less than a minute");
  }

  // This initializes secondsToRebase as soon as currentBlock becomes available
  useMemo(() => {
    if (currentBlockTimestamp) {
      initializeTimer();
    }
  }, [currentBlockTimestamp]);

  const reload = async () => {
    await dispatch(loadStakedPercentage({ networkID: networkId, provider: provider }));
    await dispatch(loadAppDetails({ networkID: networkId, provider: provider }));
  };

  // After every period SECONDS_TO_REFRESH, decrement secondsToRebase by SECONDS_TO_REFRESH,
  // keeping the display up to date without requiring an on chain request to update currentBlock.
  useEffect(() => {
    let interval = null;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      // When the countdown goes negative, reload the app details and reinitialize the timer
      if (secondsToRebase < 0) {
        reload();
        setRebaseString("");
      } else {
        clearInterval(interval);
        setSecondsToRebase(secondsToRebase => secondsToRebase - SECONDS_TO_REFRESH);
        setSecondsToRefresh(SECONDS_TO_REFRESH);
        const prettified = prettifySeconds(secondsToRebase);
        setRebaseString(prettified !== "" ? prettified : "Less than a minute");
      }
    }
    return () => clearInterval(interval);
  }, [secondsToRebase, secondsToRefresh]);

  return (
    <Box className="rebase-timer">
      <Typography variant="body2">
        {currentBlockTimestamp ? (
          secondsToRebase > 0 ? (
            <>
              <strong>{rebaseString}</strong> to next rebase
            </>
          ) : (
            <strong>rebasing</strong>
          )
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
}

export default RebaseTimer;