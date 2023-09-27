import express, { Express } from 'express';
import cors from 'cors';
import {hexToBytes} from "ethereum-cryptography/utils";
import {getAddress, getPublicKeyFromMessage, hashMessage} from "./utils";

const app: Express = express();
const port = 3042;

app.use(cors());
app.use(express.json());

// Generated private key: dc921d27d367c2f87706aef853647b7547d43f76aca9a56e62f38eb325439c92
// Generated public key: 03b317b4224a276e34dc103e103228aeb39261cafd72994d6a239211ecc5c738b4
// Generated address: d669e8c942974d11c09c4de26c849ab1fc189cf3

// Generated private key: 389808e025925dc83e1c3bd725f032c0dfe8aef842486fc251b8341bf1742261
// Generated public key: 034cdbd10c4a9c8c1d687e700d9ab523ef8aa104dda3b6fcad1d569b5aede581a8
// Generated address: 3a2314b3f3f42365b15836b57b10b981c2d8b476


const balances: Record<string, number> = {
  "0xd669e8c942974d11c09c4de26c849ab1fc189cf3": 100,
  "0x3a2314b3f3f42365b15836b57b10b981c2d8b476": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});


app.post("/send", (req, res) => {
  const { signature, recovery, message } = req.body;
  const senderPublicKey = getPublicKeyFromMessage(signature, hashMessage(message), recovery);
  const sender = '0x' + getAddress(hexToBytes(senderPublicKey));
  const { recipient, amount } = JSON.parse(req.body.message);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

function setInitialBalance(address: string) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});