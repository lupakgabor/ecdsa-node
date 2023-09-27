import "./App.scss";
import {useState} from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";

function App() {

    const [balance, setBalance] = useState(0);
    const [privateKey, setPrivateKey] = useState("");

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Created with Typescript!</h1>
            <div className="app">
                <Wallet
                    balance={balance}
                    setBalance={setBalance}
                    privateKey={privateKey}
                    setPrivateKey={setPrivateKey}
                />
                <Transfer setBalance={setBalance} privateKey={privateKey}/>
            </div>
        </div>
    );
}

export default App
