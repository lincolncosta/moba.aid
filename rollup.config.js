import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const extensions = [
    '.js', '.ts',
];

const name = 'EvolveGA';

export default [
    {
        input: './src/index.ts',
        external: [],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['src/**/*'], exclude: ['src/**/*.spec.ts'] }),
        ],
        output: [{
            file: pkg.main,
            format: 'cjs',
        }, {
            file: pkg.module,
            format: 'es',
        }, {
            file: pkg.browser,
            format: 'iife',
            name,
            globals: {},
        }],
    },
    {
        input: './src/index.ts',
        external: [],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['src/**/*'], exclude: ['src/**/*.spec.ts'] }),
            terser(),
        ],
        output: [{
            file: 'dist/evolve-ga.iife.min.js',
            format: 'iife',
            name,
            globals: {},
        }],
    },
];
