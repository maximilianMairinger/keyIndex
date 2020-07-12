const indexSymbol = Symbol()

type Primitive = string | number | symbol
type GenericObject = {[key in Primitive]: unknown}

function parseInit(init: any) {
  if (init[indexSymbol]) return () => init()
  else return init
}

export function constructIndex<Pointer = unknown, Value = GenericObject>(init: (pointer: Pointer) => Value = () => {return {} as any}) {
  const index: Map<Pointer, Value> = new Map
  init = parseInit(init)
  
  function ind(pointer: Pointer, set: Value): typeof set
  function ind(pointer: Pointer): Value
  function ind(): Map<Pointer, Value>
  function ind(pointer?: Pointer, set?: Value) {
    if (set === undefined) {
      if (pointer === undefined) {
        let temp = new Map(index)
        index.forEach((val, key) => {
          if (val[indexSymbol]) temp.set(key, (val as any)())
        })

        return temp
      }
      else {
        let me = index.get(pointer)
        if (me === undefined) {
          me = init(pointer)
          index.set(pointer, me)
        }
        return me
      }
    }
    else {
      index.set(pointer, set)
      return set
    }
  }
  ind[indexSymbol] = true


  return ind
}

constructIndex[indexSymbol] = true

export default constructIndex


export function constructObjectIndex<Pointer extends Primitive = Primitive, Value = GenericObject>(init: (pointer: Pointer) => Value = () => {return {} as any}) {
  const index: any = {}
  init = parseInit(init)

  function ind(pointer: Pointer, set: Value): typeof set
  function ind(pointer: Pointer): Value
  function ind(): {[key in Pointer]: Value}
  function ind(pointer?: Pointer, set?: Value) {
    if (set === undefined) {
      if (pointer === undefined) {
        let temp = {...index}
        for (let key in index) {
          if (index[key][indexSymbol]) temp[key] = index[key]()
        }

        return temp
      }
      else {
        let me = index[pointer]
        if (me === undefined) index[pointer] = me = init(pointer)
        return me
      }
    }
    else return index[pointer] = set
  }
  ind[indexSymbol] = true
  
  return ind
}

constructObjectIndex[indexSymbol] = true


