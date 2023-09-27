import "./App.scss";
import {useState} from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";

function App() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState("");

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Created with Typescript!</h1>
            <div className="app">

                <Wallet
                    balance={balance}
                    setBalance={setBalance}
                    address={address}
                    setAddress={setAddress}
                />
                <Transfer setBalance={setBalance} address={address}/>
            </div>
        </div>
    );
}

export default App
