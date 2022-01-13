import { useEffect } from "react";
import { History } from "history";
import { NetworkId, VIEWS_FOR_NETWORK } from "src/constants";

/**
 * will redirect from paths that aren't active on a given network yet.
 */
export function usePathForNetwork({
  pathName,
  networkID,
  history,
}: {
  pathName: string;
  networkID: NetworkId;
  history: History;
}) {
  const handlePathForNetwork = () => {
    // do nothing if networkID is -1 since that's a default state
    if (networkID != NetworkId.MAINNET && networkID != NetworkId.TESTNET) return;

    switch (pathName) {
      case "stake":
        if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].stake) {
          break;
        } else {
          history.push("/dashboard");
          break;
        }
      case "bonds":
        if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].bonds) {
          break;
        } else {
          history.push("/dashboard");
          break;
        }
      default:
        console.log("pathForNetwork ok");
    }
  };

  useEffect(() => {
    handlePathForNetwork();
  }, [networkID]);
}
