import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

/* eslint-env node */

const production = process.env.prod || false
const cjs = process.env.module || false

const exportName = cjs ? 'honeymate-module' : 'honeymate'

export default {
    input: 'source/' + (cjs ? 'index' : 'honeymate') + '.js',
    output: {
        file: production ? `dist/${exportName}.js` : `build/${exportName}.js`,
        format: cjs ? 'cjs' : 'iife',
    },
    plugins: [
        cjs ? false : babel({
            exclude: 'node_modules/**',
            presets: [
                ['@babel/preset-env', {
                    modules: false,
                }],
            ],
        }),
        production && !cjs ? terser({
            compress: {
                unsafe: true,
            },
        }) : false,
    ],
}
