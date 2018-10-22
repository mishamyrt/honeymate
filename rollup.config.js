import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

/* eslint-env node */

const production = process.env.prod || false

export default {
    input: 'source/honeymate.js',
    output: {
        file: production ? 'dist/honeymate.js' : 'build/honeymate.js',
        format: 'iife',
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
        production ? terser() : false,
    ],
}
