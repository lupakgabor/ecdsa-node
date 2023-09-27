import {ChangeEvent, FormEvent, useState} from "react";
import server from "./server";
import axios from 'axios';
import {utf8ToBytes} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";
import {secp256k1 } from "ethereum-cryptography/secp256k1";


type TransferProps = {
  privateKey: string;
  setBalance: (balance: number) => void;
}

function Transfer({ privateKey, setBalance }: TransferProps) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter: (value: string) => void) => (evt: ChangeEvent<HTMLInputElement>) => setter(evt.target.value);
  const hashMessage = (message: string) => keccak256(utf8ToBytes(message));

  async function transfer(evt: FormEvent) {
    evt.preventDefault();

    const message = JSON.stringify({
      recipient,
      amount: parseInt(sendAmount),
    })

    const signedMessage = secp256k1.sign(hashMessage(message), privateKey);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signedMessage.toCompactHex(),
        recovery: signedMessage.recovery,
        message,
      });
      setBalance(balance);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message);
      } else {
        console.log('Error', error);
        alert('Something went wrong!')
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" disabled={!privateKey || !sendAmount || !recipient} />
    </form>
  );
}

export default Transfer;
