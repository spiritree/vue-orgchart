const rollup = require('rollup')
const vue = require('rollup-plugin-vue')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

let inputOptions = {
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

let outputOptions = [
  {
    format: 'umd',
    name: 'vue-orgchart',
    file: 'dist/vue-orgchart.min.js'
  },
  {
    format: 'cjs',
    name: 'vue-orgchart',
    file: 'dist/vue-orgchart.common.min.js'
  }
]

async function build(outputOptions) {
  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(outputOptions)
}

outputOptions.forEach(outputOptions => {
  build(outputOptions)
    .then(() => console.log(`rollup: ${outputOptions.name}.${outputOptions.format} built successfully`))
    .catch(err => console.error(err))
})
