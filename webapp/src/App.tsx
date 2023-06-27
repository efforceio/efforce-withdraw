import { SmartContract, useConnectionStatus, useWallet } from "@thirdweb-dev/react";
import "./styles/home.css";
import { useEffect, useState } from "react";
import Withdraw from "./pages/Withdraw";
import LandingPage from "./pages/LandingPage";
import { BigNumber } from "ethers";
import { chainId, currencyAddress, efforceAddress, genesis1Address, genesis2Address, sdk } from "./react-app-env";

export default function Home() {
  const connectionStatus = useConnectionStatus();
  const wallet = useWallet();

  const [genesis1, setGenesis1] = useState(null as null|SmartContract);
  const [genesis2, setGenesis2] = useState(null as null|SmartContract);
  const [token, setToken] = useState(null as null|SmartContract);
  const [efforce, setEfforce] = useState(null as null|SmartContract);

  const [refund1, setRefund1] = useState(BigNumber.from(0));
  const [refund2, setRefund2] = useState(BigNumber.from(0));

  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    sdk.getContract(genesis1Address).then((contract: SmartContract) => {
      setGenesis1(contract);
    });
    sdk.getContract(genesis2Address).then((contract: SmartContract) => {
      setGenesis2(contract);
    });
    sdk.getContract(currencyAddress).then((contract: SmartContract) => {
      setToken(contract);
    });
    sdk.getContract(efforceAddress).then((contract: SmartContract) => {
      setEfforce(contract);
      if (contract !== null) {
        // @ts-ignore
        contract.call("REFUND_1", []).then((res: BigNumber) => {
          setRefund1(res);
        });

        // @ts-ignore
        contract.call("REFUND_2", []).then((res: BigNumber) => {
          setRefund2(res);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (wallet) {
      wallet.getAddress().then((walletAddress: string) => {
        setWalletAddress(walletAddress);
      });
      wallet.getChainId().then((id: number) => {
        if (id !== chainId) {
          try {
            wallet.switchChain(chainId).then();
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
  }, [wallet, genesis1, genesis2, token]);

  return (
      connectionStatus === 'connected' ? <Withdraw
          genesis1contract={genesis1}
          genesis2contract={genesis2}
          token={token}
          efforce={efforce}
          refund1={refund1}
          refund2={refund2}
          wallet={wallet}
          efforceAddress={efforceAddress}
          walletAddress={walletAddress}
      /> : <LandingPage />
  );
}
