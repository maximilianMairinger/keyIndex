import getClassFunctionNames from "get-class-function-names"

const indexSymbol = Symbol()

type Primitive = string | number | symbol
type GenericObject = {[key in Primitive]: unknown}


type Ind<Pointer, Value> = 
((pointer: Pointer, set: Value) => typeof set) &
((pointer: Pointer) => Value) &
(() => Map<Pointer, Value>)


// legacy
export const constructObjectIndex = (...a) => {
  console.warn("constructObjectIndex is deprecated and will be removed in key-index@2")
  //@ts-ignore
  return constructIndex(...a)
}


export function constructIndex<Pointer = unknown, Value = GenericObject>(init?: (pointer: Pointer) => Value, Index?: typeof Map): Ind<Pointer, Value> & Map<Pointer, Value>
export function constructIndex<Pointer extends object = object, Value = GenericObject>(init: (pointer: Pointer) => Value, Index: typeof WeakMap): Ind<Pointer, Value> & WeakMap<Pointer, Value>
export function constructIndex<Pointer = unknown, Value = GenericObject>(init: (pointer: Pointer) => Value = () => {return {} as any}, Index: typeof Map | typeof WeakMap = Map): any {
  const index: Map<Pointer, Value> = new (Index as any)
  
  function ind(pointer: Pointer, set: Value): typeof set
  function ind(pointer: Pointer): Value
  function ind(): Map<Pointer, Value>
  function ind(pointer?: Pointer, set?: Value) {
    if (arguments.length < 2) {
      if (arguments.length === 0) {
        let temp = new (Index as any)(index)
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



  const propagate = constructPropagate(index, ind)
  for (let k of getClassFunctionNames(Index)) {
    propagate(k)
  }
  

  


  return ind as any
}


function constructPropagate(root: any, to: any) {
  return function propagate(rootKey: string) {
    if (root[rootKey] instanceof Function) {
      to[rootKey] = root[rootKey].bind(root)
    }
    else {
      Object.defineProperty(to, rootKey, {
        get() {
          return root[rootKey]
        },
        set(to) {
          root[rootKey] = to
        }
      })
    }
    
  }
}

type Maybe<T> = T | undefined

constructIndex[indexSymbol] = true

export default constructIndex



