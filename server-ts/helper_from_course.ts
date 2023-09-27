// To run: npx ts-node helper_from_course.ts

import {toHex, utf8ToBytes} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";
import {secp256k1 } from "ethereum-cryptography/secp256k1";

const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";

function hashMessage(message: string) {
    const bytes = utf8ToBytes(message);
    console.log('Message in bytes', bytes);
    const hash = keccak256(bytes);
    console.log('Hash message', hash);
    return hash;
}

console.log('Hex message', toHex(hashMessage('Hello Alchemy!')));

function signMessage(messageHash: Uint8Array): [string, number] {
    const sign = secp256k1.sign(messageHash, PRIVATE_KEY);

    sign.recoverPublicKey(messageHash);

    console.log('Is valid?', secp256k1.verify(sign, messageHash, getPublicKey()));

    return [sign.toCompactHex(), sign.recovery];
}

function getPublicKey () {
    return secp256k1.getPublicKey(PRIVATE_KEY);
}

function getPublicKeyFromMessage(signature: string , messageHash: Uint8Array, recoveryBit: number) {
    let sign = secp256k1.Signature.fromCompact(signature);

    sign = sign.addRecoveryBit(recoveryBit);

    return sign.recoverPublicKey(messageHash).toHex(true);
}

function getAddress(publicKey: Uint8Array) {
    const isCompressed = publicKey.slice(0, 1);

    const kek = keccak256(publicKey.slice(1));
    return toHex(kek.slice(-20));
}

const messageHash = hashMessage('Hello from Alchemy!');
const [signedMessage, recoveryBit] = signMessage(messageHash);
console.log('Public key:', getPublicKeyFromMessage(signedMessage, messageHash, recoveryBit));
console.log('Public key:', toHex(getPublicKey()));

const priv = secp256k1.utils.randomPrivateKey();
const pub = secp256k1.getPublicKey(priv);

console.log('Generated private key:', toHex(priv));
console.log('Generated public key:', toHex(pub));
console.log('Generated address:', getAddress(pub));

