// rollup.config.js
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';

export default {
  input: 'index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    globals: {
      react: 'React',
      'react-dom': 'ReactDom',
    },
  },


  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    resolve({
      browser: true,
      preferBuiltins: true,
      // pass custom options to the resolve plugin
      moduleDirectories: [ 'node_modules' ],
    }),

    babel({ babelHelpers: 'bundled' }),

    commonjs(),

    process.env.NODE_ENV === 'development' ? serve('dist') : null,
  ],
};
