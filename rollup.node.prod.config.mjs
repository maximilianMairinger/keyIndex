import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/keyIndex.ts',
  output: {
    file: 'dist/cjs/keyIndex.js',
    format: 'cjs'
  },
})