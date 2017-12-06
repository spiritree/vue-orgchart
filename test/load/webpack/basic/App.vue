<template>
  <vo-basic :data="chartData"></vo-basic>
</template>

<script>
import { VoBasic } from '../../../../dist/vue-orgchart.common.min.js'
export default {
  components: { VoBasic },
  created() {
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
}
</script>
