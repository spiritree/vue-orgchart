<template>
  <vo-edit :data="chartData"></vo-edit>
</template>

<script>
import { VoEdit } from '../../../../dist/vue-orgchart.common.min.js'
export default {
  components: { VoEdit },
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
