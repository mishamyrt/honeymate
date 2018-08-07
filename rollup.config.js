import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'source/honeymate.js',
    output: {
        file: 'dist/honeymate.js',
        format: 'iife',
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [['env', { modules: false }]],
            plugins: ['external-helpers'],
            externalHelpers: true,
        }),
        terser(),
    ],
}
