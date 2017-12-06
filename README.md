<div align="center">
  <img src="/assets/vue-orgchart.jpg" alt="vue-orgchart logo">
</div>

# vue-orgchart
<a href="https://travis-ci.org/spiritree/vue-orgchart"><img alt="Travis Status" src="https://img.shields.io/travis/spiritree/vue-orgchart/master.svg?style=flat-square"></a>
> A vue wrapper for OrgChart.js

## Install
```shell
npm install vue-orgchart -S
```
## Quick Start
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

# build for production with minification
npm run rollup
```
