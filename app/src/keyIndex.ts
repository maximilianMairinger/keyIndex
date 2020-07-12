const indexSymbol = Symbol()

type Primitive = string | number | symbol
type GenericObject = {[key in Primitive]: unknown}

export function constructIndex<Pointer = unknown, Value = GenericObject>(init: (pointer: Pointer) => Value = () => {return {} as any}): ((pointer: Pointer, set?: Value) => Value) & { valueOf(): Map<Pointer, Value> } {
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
  ind[indexSymbol] = true
  ind.valueOf = () => {
    let temp = new Map(index)
    index.forEach((val, key) => {
      if (val[indexSymbol]) temp.set(key, val.valueOf() as any)
    })

    return temp
  }

  return ind
}

export default constructIndex


export function constructObjectIndex<Pointer extends Primitive = Primitive, Value = GenericObject>(init: (pointer: Pointer) => Value = () => {return {} as any}): ((pointer: Pointer, set?: Value) => Value) & { valueOf(): {[key in Pointer]: Value} }  {
  const index: any = {}

  function ind(pointer: Pointer, set?: Value) {
    if (set === undefined) {
      let me = index[pointer]
      if (me === undefined) index[pointer] = me = init(pointer)
      return me
    }
    else return index[pointer] = set
  }
  ind[indexSymbol] = true
  ind.valueOf = () => {
    let temp = {...index}
    for (let key in index) {
      if (index[key][indexSymbol]) temp.set(key, index[key].valueOf() as any)
    }

    return temp
  }
  
  return ind
}


