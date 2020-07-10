export function constructIndex<Pointer = unknown, Value = unknown>(init: (pointer: Pointer) => Value) {
  const index: Map<Pointer, Value> = new Map
  
  return function (pointer: Pointer, set?: Value) {
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

export default constructIndex


export function constructObjectIndex<Pointer = unknown, Value = unknown>(init: (pointer: Pointer) => Value) {
  const index: any = {}
  
  return function (pointer: Pointer, set?: Value) {
    if (set === undefined) {
      let me = index[pointer]
      if (me === undefined) index[pointer] = me = init(pointer)
      return me
    }
    else return index[pointer] = set
  }
}
