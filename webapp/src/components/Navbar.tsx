import { ConnectWallet } from "@thirdweb-dev/react";

export const Navbar = (props: {
    funds?: string,
    loading: boolean
}) => {
    const {funds, loading} = props;

    return <div className="navbar">
        <h1 className="navbarTitle">
            Efforce withdraw funds
        </h1>
        <div className="navbarSpace" />

        {
            funds ? <div className="navbarFunds">
                <div className="navbarSpace" />
                <h3>Funds in contract: {loading ? "Loading…": `${funds} USDT`}</h3>
                <div className="navbarSpace" />
            </div> : null
        }

        <ConnectWallet dropdownPosition={{ side: 'bottom', align: 'center'}} />
    </div>;
}
