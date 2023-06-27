import { SmartContract, useContractEvents, WalletInstance } from "@thirdweb-dev/react";
import Genesis from "../components/Genesis";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { alchemyConfig, decimals, genesis1Address, genesis2Address } from "../react-app-env";
import { Alchemy, OwnedNft } from "alchemy-sdk";
import "../styles/withdraw.css";
import { Navbar } from "../components/Navbar";
import { Staking } from "../components/Staking";
import { TransactionsHistory } from "../components/TransactionsHistory";


export default function Withdraw(props: {
    genesis1contract: null|SmartContract,
    genesis2contract: null|SmartContract,
    refund1: BigNumber,
    refund2: BigNumber,
    wallet: undefined|WalletInstance,
    token: null|SmartContract
    efforceAddress: string
    efforce: null|SmartContract,
    walletAddress: string,
}) {
    const {
        genesis2contract,
        genesis1contract,
        refund2,
        refund1,
        wallet,
        token,
        efforceAddress,
        efforce,
        walletAddress
    } = props;


    const transferEvent = useContractEvents(token, "Transfer");
    const [fundsInContract, setFundsInContract] = useState(BigNumber.from(0));
    const nftTransferEvent1 = useContractEvents(genesis1contract, "Transfer");
    const nftTransferEvent2 = useContractEvents(genesis2contract, "Transfer");
    const [stackRefund, setStackRefund] = useState(BigNumber.from(0));

    const [genesis1, setGenesis1] = useState([] as number[]);
    const [genesis2, setGenesis2] = useState([] as number[]);

    const alchemy = new Alchemy(alchemyConfig);

    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (walletAddress !== "") {
            if (token) {
                token.erc20.balanceOf(efforceAddress).then((balance) => {
                    setFundsInContract(balance.value);
                });
            }
            if (efforce !== null) {
                // @ts-ignore
                efforce.call("getRefundAmount", [walletAddress]).then((refund: BigNumber) => {
                    setStackRefund(refund);
                });
            }
        }
    }, [transferEvent.data]);

    useEffect(() => {
        if (token) {
            token.erc20.balanceOf(efforceAddress).then((balance) => {
                setFundsInContract(balance.value);
            });
        }
    }, [token]);

    const parseNumber  = (number: BigNumber) => {
        const s = number.toString();
        const l = s.substring(0, s.length-decimals);
        const r = s.length - decimals >= 1 ? s.substring(s.length-decimals, s.length-decimals + 2) : "00";
        return (l === "" ? "0" : l) + "." + (r.length === 1 ? r + "0" : r);
    }

    const getNFTsList = async (contract: string) => {
        if (walletAddress !== "") {
            const response = await alchemy.nft.getNftsForOwner(
                walletAddress,
                {
                    contractAddresses: [contract]
                }
            );

            return response.ownedNfts.map((nft: OwnedNft) => Number(nft.tokenId));
        } else {
            return [];
        }
    }

    useEffect(() => {
        if (walletAddress !== "") {
            getNFTsList(genesis1Address).then((ids) => setGenesis1([...ids]));
            getNFTsList(genesis2Address).then((ids) => setGenesis2([...ids]));
        }
    }, [walletAddress]);

    useEffect(() => {
        if (walletAddress !== "") {
            getNFTsList(genesis1Address).then((ids) => setGenesis1([...ids]));
            getNFTsList(genesis2Address).then((ids) => setGenesis2([...ids]));
        }
    }, [nftTransferEvent1.data, nftTransferEvent2.data]);

    useEffect(() => {
        if (efforce !== null) {
            wallet?.getAddress().then((address: string) => {
                // @ts-ignore
                efforce.call("getRefundAmount", [address]).then((refund: BigNumber) => {
                    setStackRefund(refund);
                });
            });
        }
    }, [efforce, wallet]);

    const getAmountRefund = () => {
        if (genesis1 !== null && genesis2 !== null) {
            const g1Amount = genesis1.length;
            const g2Amount = genesis2.length;
            return parseNumber(stackRefund.add(refund1.mul(g1Amount).add(refund2.mul(g2Amount))));
        } else {
            return "0.00";
        }
    }

    return (
        <div>
            <Navbar funds={parseNumber(fundsInContract)} />
            <div className="content">
                {
                    !showHistory ? <div>
                        <h2 className="centeredText">
                            Total refund: {getAmountRefund()} USDT
                        </h2>
                        <h3
                            className="centeredText pointer"
                            onClick={() => setShowHistory(true)}
                        >
                            Transaction history
                        </h3>
                        <Staking
                            stackRefund={stackRefund}
                            wallet={wallet}
                            stackRefundStr={parseNumber(stackRefund)}
                        />
                        {
                            genesis1contract !== null ? <Genesis
                                contract={genesis1contract}
                                genesis={genesis1}
                                wallet={wallet}
                                refund={parseNumber(refund1)}
                                edition={1}
                                walletAddress={walletAddress}
                            /> : null
                        }
                        {
                            genesis2contract !== null ? <Genesis
                                contract={genesis2contract}
                                genesis={genesis2}
                                wallet={wallet}
                                refund={parseNumber(refund2)}
                                edition={2}
                                walletAddress={walletAddress}
                            /> : null
                        }
                    </div> : <TransactionsHistory
                        close={() => setShowHistory(false)}
                        alchemy={alchemy}
                        walletAddress={walletAddress}
                        transferEventData={transferEvent.data}
                        parseNumber={parseNumber}
                    />
                }
            </div>
            <ToastContainer />
        </div>
    );
}
