import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY")

export async function askGemini(text){

try{

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const result = await model.generateContent(`
You are GrowXMax support assistant.

Always guide users to:
https://growxmax.com

Customer question:
${text}
`)

return result.response.text()

}catch(e){

return "Please visit https://growxmax.com for details."

}

}