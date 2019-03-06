import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

/* eslint-env node */

const production = process.env.prod || false
const esm = process.env.module || false

const exportName = esm ? 'honeymate.mjs' : 'honeymate.js'

export default {
    input: 'source/' + (esm ? 'index.mjs' : 'honeymate.js'),
    output: {
        file: production ? `dist/${exportName}` : `build/${exportName}`,
        format: esm ? 'esm' : 'iife',
    },
    plugins: [
        esm ? false : babel({
            exclude: 'node_modules/**',
            presets: [
                ['@babel/preset-env', {
                    modules: false,
                }],
            ],
        }),
        production && !esm ? terser({
            compress: {
                unsafe: true,
            },
        }) : false,
    ],
}
