import getClassFunctionNames, { getClassFunctionSymbols } from "get-class-function-names"
import { isUndefined } from "util"

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

  for (let k of getClassFunctionSymbols(Index)) {
    propagate(k)
  }
  

  


  return ind as any
}


function constructPropagate(root: any, to: any) {
  return function propagate(rootKey: string | symbol) {
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

constructIndex[indexSymbol] = true

export default constructIndex


export function memoize<T, Args extends unknown[]>(creator: (...forward: Args) => T, optimisticReturnUndefinedOnCyclicCallDefaultValue: boolean): (optimisticReturnUndefinedOnCyclicCall?: boolean, args?: Args) => T | undefined
export function memoize<T, Args extends unknown[]>(creator: (...forward: Args) => T): (...forwarded: Args) => T
export function memoize<T, Args extends unknown[]>(creator: (...forward: Args) => T, cyclicCallReturnUndefinedDefaultValue?: boolean): (...forwarded: Args) => T {
  const cyclicCallPossible = cyclicCallReturnUndefinedDefaultValue !== undefined
  let cache: T
  let isCached = false
  return function(...forwarded: Args) {
    if (!isCached) {
      if (cyclicCallPossible && forwarded[0] !== undefined ? forwarded[0] : cyclicCallReturnUndefinedDefaultValue) isCached = true
      cache = creator(...!cyclicCallPossible ? forwarded : forwarded[1] !== undefined ? forwarded[1] as Args : [] as Args)
      // if we move this line above the previous line, we would allow cyclic calls (by just returning undefined). Dont know it thats a good idea, as the error would be hidden
      isCached = true
      return cache
    }
    else return cache    
  }
}


export const isBigintSupported = memoize(() => {
  try {BigInt(1); return true} catch(e) {return false}
})
export function incUIDScope<Val extends number | bigint>(init: Val, inc: Val): () => Val
export function incUIDScope<Val extends number | bigint>(): () => Val
export function incUIDScope<Val extends number | bigint>(init?: Val, inc?: Val) {
  if (init === undefined) {
    if (isBigintSupported()) {
      init = BigInt(0) as any
      inc = BigInt(1) as any
    }
    else {
      init = 0 as any
      inc = 1 as any
    }
  }
  let uid = init as any
  return () => {
    uid = uid + inc as any
    return uid
  }
}

