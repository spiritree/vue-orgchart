const rollup = require('rollup')
const vue = require('rollup-plugin-vue')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const inputOptions = {
  input: 'src/index.js',
  plugins: [
    vue({ css: 'dist/style.min.css', postcss: [autoprefixer, cssnano] }),
    resolve({
      extensions: ['.js', '.vue']
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    uglify()
  ]
}

const outputOptions = {
  format: 'umd',
  name: 'vue-orgchart',
  file: 'dist/vue-orgchart.min.js'
}

async function build() {
  const bundle = await rollup.rollup(inputOptions)
  const { code, map } = await bundle.generate(outputOptions)
  await bundle.write(outputOptions)
}

build();
