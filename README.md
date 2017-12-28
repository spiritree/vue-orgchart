<p align="center">
  <a href="https://spiritree.github.io/vue-orgchart">
    <img src="/assets/vue-orgchart.jpg" alt="vue-orgchart logo">
  </a>
</p>

<p align="center">
A Vue wrapper for OrgChart.js.
</p>

<p align="center">
<a href="https://travis-ci.org/spiritree/vue-orgchart"><img alt="Travis Status" src="https://img.shields.io/travis/spiritree/vue-orgchart/master.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/vue-orgchart"><img alt="npm" src="https://img.shields.io/npm/v/vue-orgchart.svg?style=flat-square"></a>

</p>

## Intro

- First of all, thanks a lot for dabeng's great work -- [OrgChart.js](https://github.com/dabeng/OrgChart.js)
- If you prefer the Vue.js Wrapper for Orgchart.js,you could try [my project](https://github.com/spiritree/vue-orgchart)

## Links

- [Documentation](https://spiritree.github.io/vue-orgchart)

### Feature

- Support import and export JSON
- Supports exporting chart as a picture
- draggable Orgchart
- Editable Orgchart

...
## Install
```shell
npm install vue-orgchart -S
```
## Quick Start

> In `main.js`

`import 'vue-orgchart/dist/style.min.css'`

> In `*.vue`

```javascript
<template>
  <div>
    <vo-basic :data="chartData"></vo-basic>
  </div>
</template>

<script>
import { VoBasic } from 'vue-orgchart'
export default {
  components: { VoBasic }
  created () {
    this.chartData = {
      name: 'JavaScript',
        children: [
          { name: 'Angular' },
          {
            name: 'React',
            children: [{ name: 'Preact' }]
          },
          {
            name: 'Vue',
            children: [{ name: 'Moon' }]
          }
        ]
    }
}
</script>
```
## Development

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8999
npm run dev

# unit test
npm run test

# build by rollup
npm run rollup
```

## License

MIT
