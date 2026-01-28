# Key Index

Key based index store.

## Installation

```shell
 $ npm i key-index
```

## Usage

### Create an index

Import

```ts
import keyIndex from "key-index"
```

Create an instance

```ts
let initer = (pointer: string) => {
  return {name: pointer}
}

let index = keyIndex(initer)
```

### Query

When querying a key that is not assigned to a value yet, one is automatically created via the given `initer` function.

```ts
let a = index("keyA")     // {name: "keyA"}
a.prop = "val"
index("keyA")             // {name: "keyA", prop: "val"}
```

(Mostly for debugging purposes) you can also query the whole document

```ts
let a = index()    // Map: {
                   //   "keyA": {
                   //     "name": "keyA"
                   //     "prop": "val"
                   //   }
                   // }
```

The index is stored in a Map by default. If youd like to use a regular object as index instead use

```ts
import { constructObjectIndex as keyIndex } from "key-index"
```

All functionality is the same here. The only difference is the underlying technology used. 

> Note: that native objects do only support strings | number | symbol as indices!

### Using other initers

This is the default initer

```ts
keyIndex(/* () => {return {}} */)
```

#### Using values directly

You can use values directly. If your use case does only need one value.

```ts
let valueIndex = keyIndex((key) => key)
valueIndex("keyA")                 // "keyA"
```

In that (and every other) case you can change the value like so: 

```ts
valueIndex("keyA", "keyAValue")    // "keyAValue"
valueIndex("keyA")                 // "keyAValue"
```

#### Nested indices

If using your use case requires nested indices consider this

```ts
let nestedIndex = keyIndex(() => keyIndex(/* () => {return {}} */))
nestedIndex("keyA")("keyB")         // {}
```

Querying the whole document does also work here

```ts
nestedIndex("keyA")("keyB").key = "val"
nestedIndex("keyA")("keyC").key = "val"
nestedIndex("keyD")("keyE").key1 = "val1"
nestedIndex("keyD")("keyE").key2 = "val2"


nestedIndex()                      // Map {
                                   //   "keyA": Map {
                                   //     "keyB": { key: "val" }
                                   //     "keyC": { key: "val" }
                                   //   }
                                   //   "keyD": Map {
                                   //     "keyE": { key1: "val1", key2: "val2" }
                                   //   }
                                   // }
```

> Note: Depending on the underlying technology (maps / objects) this may yield slightly different results (all maps would be regular objects).


### Memoize

The `memoize` function ensures that a given `creator` function is only executed once. Subsequent calls return the cached result. It is specifically designed to handle **circular dependencies** (cyclic calls) and supports **post-initialization hooks**.

#### Basic Usage

Pass a function to `memoize`. The first call executes the function, and all future calls return the same value.

```ts
import { memoize } from "key-index"

const getComplexConfig = memoize(() => {
  console.log("Calculating...")
  return { status: "ready", timestamp: Date.now() }
})

getComplexConfig() // Logs "Calculating...", returns {status: "ready", ...}
getComplexConfig() // Returns cached object immediately
```

#### Handling Circular Dependencies

In complex systems, Function A might call Function B, which accidentally calls Function A again before it has finished. To prevent infinite loops (Stack Overflows), you can enable `optimisticReturn`.

If enabled, the function will return `undefined` for any recursive calls that occur while the creator is still running.

```ts
const serviceA = memoize(() => {
  const b = serviceB()
  return { name: "A", dependency: b }
}, true) // Enable optimistic return

const serviceB = memoize(() => {
  const a = serviceA() // This would normally loop forever
  return { name: "B", dependency: a } // 'a' will be undefined here
})

serviceA()
```

#### Post-Initialization Hook (`afterCreator`)

You can provide a callback as the second argument. This runs exactly once, immediately after the `creator` has successfully finished. This is useful for "wiring up" objects or triggering side effects after an instance is cached.

```ts
const getSocket = memoize(
  () => new WebSocket("ws://link"),
  (args, socket) => {
    console.log("Socket initialized with args:", args)
    socket.onopen = () => console.log("Connected")
  }
)
```

#### Manual Cyclic Control

If you initialized `memoize` with a boolean flag, the calling signature changes. The first argument becomes a toggle for that specific call, and the creator's arguments are passed as an array in the second argument.

```ts
const myMemo = memoize((name: string) => ({ name }), true)

// Syntax: myMemo(optimisticToggle?, [argsForCreator])
myMemo(true, ["MyName"]) 
```

#### Properties

The returned function also exposes its state:
- `isResolved`: Boolean indicating if the creator has already run.
- `cache`: The stored result (if resolved).

---

### Logic Summary of `memoize`

| Feature | Description |
| :--- | :--- |
| **Execution** | The `creator` runs exactly once. |
| **Arguments** | Only the arguments from the **first** call are passed to the creator. |
| **Cyclic Safety** | Prevents crashes if the creator triggers itself. |
| **Hook** | `afterCreator` allows logic to run after the value is stored in the cache. |

---


## Contribute

All feedback is appreciated. Create a pull request or write an issue.
