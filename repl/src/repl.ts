import keyIndex from "./../../app/src/keyIndex"



let ind = keyIndex(() => keyIndex())

ind("qwe")("eee").key = "val"

console.log(ind())

console.log(ind("qwe")("eee"))
ind(true)
console.log(ind())