const rollup = require('rollup')
const vue = require('rollup-plugin-vue')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const outputOptions = [
  {
    min: true,
    format: 'umd',
    name: 'vue-orgchart',
    file: 'dist/vue-orgchart.min.js'
  },
  {
    min: false,
    format: 'umd',
    name: 'vue-orgchart',
    file: 'dist/vue-orgchart.js'
  },
  {
    min: true,
    format: 'cjs',
    name: 'vue-orgchart',
    file: 'dist/vue-orgchart.common.min.js'
  },
  {
    min: false,
    format: 'cjs',
    name: 'vue-orgchart',
    file: 'dist/vue-orgchart.common.js'
  },
  {
    min: false,
    format: 'es',
    name: 'vue-orgchart',
    file: 'dist/vue-orgchart.esm.js'
  }
]

async function build(item) {
  const vueSettings = item.min
  ? { css: 'dist/style.min.css', postcss: [autoprefixer, cssnano] }
  : { css: 'dist/style.css', postcss: [autoprefixer] }

  const inputOptions = {
    input: 'src/index.js',
    plugins: [
      vue(vueSettings),
      resolve({
        extensions: ['.js', '.vue']
      }),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers']
      })
    ]
  }
  if (item.min) inputOptions.plugins.push(uglify())

  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(item)
}

outputOptions.forEach(item => {
  build(item)
    .then(() => item.min
      ? console.log(`rollup: ${item.name}.${item.format}.min built successfully`)
      : console.log(`rollup: ${item.name}.${item.format} built successfully`))
    .catch(err => console.error(err))
})
