import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds, { allExpiredBonds } from "src/helpers/AllBonds";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";
import { NetworkId } from "src/constants";

interface IBondingStateView {
  account: {
    bonds: {
      [key: string]: IUserBondDetails;
    };
  };
  bonding: {
    loading: boolean;
    [key: string]: any;
  };
}

// Smash all the interfaces together to get the BondData Type
export interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {}

const initialBondArray = allBonds;
const initialExpiredArray = allExpiredBonds;
// Slaps together bond data within the account & bonding states
function useBonds(networkId: NetworkId) {
  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const accountBondsState = useSelector((state: IBondingStateView) => state.account.bonds);
  const [bonds, setBonds] = useState<Bond[] | IAllBondData[]>(initialBondArray);
  const [expiredBonds, setExpiredBonds] = useState<Bond[] | IAllBondData[]>(initialExpiredArray);

  useEffect(() => {
    const bondDetails: IAllBondData[] = allBonds
      .flatMap(bond => {
        if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
          return Object.assign(bond, bondState[bond.name]); // Keeps the object type
        }
        return bond;
      })
      .flatMap(bond => {
        if (accountBondsState[bond.name]) {
          return Object.assign(bond, accountBondsState[bond.name]);
        }
        return bond;
      });

    // NOTE (appleseed): temporary for ONHOLD MIGRATION
    const mostProfitableBonds = bondDetails.concat().sort((a, b) => {
      if (!a.getBondability(networkId)) return 1;
      if (!b.getBondability(networkId)) return -1;
      return a["bondDiscount"] > b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0;
    });
    setBonds(mostProfitableBonds);
    // setBonds(bondDetails);

    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    if (allExpiredBonds.length > 0) {

    }
    const expiredDetails: IAllBondData[] = allExpiredBonds
      .flatMap(bond => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return Object.assign(bond, bondState[bond.name]); // Keeps the object type
        }
        return bond;
      })
      .flatMap(bond => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (accountBondsState[bond.name]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return Object.assign(bond, accountBondsState[bond.name]);
        }
        return bond;
      });
    setExpiredBonds(expiredDetails);
  }, [bondState, accountBondsState, bondLoading]);

  // Debug Log:
  // console.log(bonds);
  return { bonds, loading: bondLoading, expiredBonds };
}

export default useBonds;
