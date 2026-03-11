import axios from "axios"

const SHEET_URL="https://opensheet.elk.sh/1D1vjKRDvmaDS5L3menOOXMYP81K4DoVi-FhLJ6GJJ98/faq"

export async function getSheetAnswer(question){

try{

const res=await axios.get(SHEET_URL)

const data=res.data

for(let item of data){

if(question.toLowerCase().includes(item.keyword.toLowerCase())){
return item.answer
}

}

return null

}catch(e){

return null

}

}