import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys"

import qrcode from "qrcode-terminal"
import { getSheetAnswer } from "./sheet.js"
import { askGemini } from "./gemini.js"

async function startBot(){

  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {

    const { connection, lastDisconnect, qr } = update

    if(qr){
      console.log("Scan this QR Code with WhatsApp")
      qrcode.generate(qr,{small:true})
    }

    if(connection === "open"){
      console.log("✅ WhatsApp Bot Connected")
    }

    if(connection === "close"){

      const shouldReconnect =
      lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

      console.log("connection closed")

      if(shouldReconnect){
        startBot()
      }

    }

  })

  sock.ev.on("messages.upsert", async ({messages}) => {

    const msg = messages[0]

    if(!msg.message) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if(!text) return

    console.log("User:", text)

    let reply = await getSheetAnswer(text)

    if(!reply){
      reply = await askGemini(text)
    }

    await sock.sendMessage(msg.key.remoteJid,{ text: reply })

  })
const sock = makeWASocket({
  auth: state,
  printQRInTerminal: true,
  browser: ["Ubuntu", "Chrome", "20.0.04"]
})
}

startBot()

