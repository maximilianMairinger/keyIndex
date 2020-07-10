export function constructIndex<Pointer = unknown, Value = unknown>(init: (pointer: Pointer) => Value): ((pointer: Pointer, set?: Value) => Value) & { valueOf(): Map<Pointer, Value> } {
  const index: Map<Pointer, Value> = new Map
  
  function ind(pointer: Pointer, set?: Value) {
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
  ind.valueOf = () => {
    return index
  }

  return ind
}

export default constructIndex


type Primitive = string | number | symbol

export function constructObjectIndex<Pointer extends Primitive = Primitive, Value = unknown>(init: (pointer: Pointer) => Value): ((pointer: Pointer, set?: Value) => Value) & { valueOf(): {[key in Pointer]: Value} }  {
  const index: any = {}

  function ind(pointer: Pointer, set?: Value) {
    if (set === undefined) {
      let me = index[pointer]
      if (me === undefined) index[pointer] = me = init(pointer)
      return me
    }
    else return index[pointer] = set
  }
  ind.valueOf = () => {
    return index
  }
  
  return ind
}


