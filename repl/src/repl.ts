import keyIndex, { constructObjectIndex } from "./../../app/src/keyIndex"



let ind = keyIndex(() => keyIndex())

ind("qwe")("eee").key = "val"

console.log(ind())

console.log(ind("qwe")("eee"))
ind(true)


let ind2 = constructObjectIndex(() => constructObjectIndex())


ind2("qwe")("ewq").key = "val"
console.log(ind2("qwe")("ewq"), ind2())



let nestedIndex = constructObjectIndex(() => constructObjectIndex())

nestedIndex("keyA")("keyB").key = "val"
nestedIndex("keyA")("keyC").key = "val"
nestedIndex("keyD")("keyE").key1 = "val1"
nestedIndex("keyD")("keyE").key2 = "val2"

console.log(nestedIndex())