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
        babel({
            exclude: 'node_modules/**',
            presets: [
                ['@babel/preset-env', {
                    modules: false,
                    useBuiltIns: 'entry',
                }],
            ],
            externalHelpers: true,
            plugins: ['@babel/plugin-external-helpers'],
        }),
        production && !cjs ? terser() : false,
    ],
}
