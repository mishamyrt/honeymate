import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

/* eslint-env node */

const production = process.env.prod || false
const amd = process.env.module || false

const exportName = amd ? 'honeymate-module' : 'honeymate'

export default {
    input: 'source/' + (amd ? 'index' : 'honeymate') + '.js',
    output: {
        file: production ? `dist/${exportName}.js` : `build/${exportName}.js`,
        format: amd ? 'amd' : 'iife',
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                ['env', {
                    modules: false,
                    useBuiltIns: 'entry',
                }],
            ],
            plugins: ['external-helpers'],
            externalHelpers: true,
        }),
        production && !amd ? terser() : false,
    ],
}
