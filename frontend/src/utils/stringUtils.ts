import {Buffer} from 'buffer';

export const base64Encode = (wurd: string)  => {
    const bufferObj = Buffer.from(wurd, "utf8");
    console.log(`CONVERT:: ${wurd} `)
    return bufferObj.toString("base64");
}