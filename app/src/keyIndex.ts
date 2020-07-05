export default function constructIndex<Pointer, Value>(init: (pointer: Pointer) => Value) {
  const index: Map<Pointer, Value> = new Map
  
  return function (pointer: Pointer, set: Value) {
    if (set === undefined) {
      let me = index.get(pointer)
      if (me === undefined) {
        me = init(pointer)
        index.set(pointer, me)
      }
      return me
    }
    else {
      index.set(pointer, set)
      return set
    }
  }
}
