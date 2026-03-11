import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"
import { getSheetAnswer } from "./sheet.js"
import { askGemini } from "./gemini.js"

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", ({qr}) => {

if(qr){
console.log("Scan this QR Code")
qrcode.generate(qr,{small:true})
}

})

sock.ev.on("messages.upsert", async ({messages}) => {

const msg = messages[0]

if(!msg.message) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
""

let reply = await getSheetAnswer(text)

if(!reply){
reply = await askGemini(text)
}

await sock.sendMessage(msg.key.remoteJid,{text:reply})

})

}

startBot()