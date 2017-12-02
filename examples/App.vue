<template>
<div>
  <vo-edit :options="{ data: this.datasource }"></vo-edit>
</div>
</template>

<script>
import { VoBasic, VoEdit } from '../dist/vue-orgchart.min.js'

export default {
  components: { VoBasic, VoEdit },
  created () {
    this.datasource = {
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
