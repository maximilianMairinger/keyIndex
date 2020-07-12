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


## Contribute

All feedback is appreciated. Create a pull request or write an issue.
