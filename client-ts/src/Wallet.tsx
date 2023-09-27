import server from "./server";
import {ChangeEvent, useState} from "react";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";
import {toHex} from "ethereum-cryptography/utils";

type WalletProps = {
    privateKey: string;
    setPrivateKey: (address: string) => void,
    balance: number,
    setBalance: (balance: number) => void,
}

function Wallet({privateKey, setPrivateKey, balance, setBalance}: WalletProps) {
    const [privateKeyError, setPrivateKeyError] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    const getAddress = (key: string) => {
        if (key.length === 64) {
            const publicKey = secp256k1.getPublicKey(key);
            setPrivateKeyError(null);
            const kek = keccak256(publicKey.slice(1));
            return '0x'+ toHex(kek.slice(-20));
        } else {
            setPrivateKeyError('Invalid private key! It must be 64 chars!');
            return null;
        }
    }

    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const privateKey = evt.target.value;
        const calculatedAddress = getAddress(privateKey);
        setPrivateKey(privateKey);
        setAddress(calculatedAddress);

        if (calculatedAddress) {
          const {
            data: { balance },
          } = await server.get(`balance/${calculatedAddress}`);
          setBalance(balance);
        } else {
          setBalance(0);
        }
    }


    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>

            <label>
                Private Key
                <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
                {privateKeyError && <span style={{ color: 'red', paddingTop: 10 }}>{privateKeyError}</span>}
            </label>

            <label>
                Wallet Address
                <h4>{address}</h4>
            </label>

            <div className="balance">Balance: {balance}</div>
        </div>
    );
}

export default Wallet;
