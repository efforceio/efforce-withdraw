import { ConnectWallet } from "@thirdweb-dev/react";
import "../styles/home.css";

export default function LandingPage() {
    return (
        <div className="container">
            <main className="main">
                <h1 className="title">
                    Efforce withdraw funds
                </h1>
                <p className="description">
                    Welcome to Efforce withdraw! Seamlessly connect their wallets, explore your NFTs from the Genesis 1 and Genesis 2 projects, and effortlessly claim refunds for the staking period.
                </p>
                <div className="connect">
                    <ConnectWallet dropdownPosition={{ side: 'bottom', align: 'center' }} />
                </div>
            </main>
        </div>
    );
}
