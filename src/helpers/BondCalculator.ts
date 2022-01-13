import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { default as BondCalcContract } from "src/abi/BondingCalculator.json";
import { ethers } from "ethers";
import { addresses, NetworkId } from "src/constants";
import { BondingCalculator } from "../typechain";

export const getBondCalculator = (NetworkId: NetworkId, provider: StaticJsonRpcProvider) => {
    return new ethers.Contract(
      addresses[NetworkId].BONDINGCALC_ADDRESS as string,
      BondCalcContract.abi,
      provider,
    ) as BondingCalculator;
};
