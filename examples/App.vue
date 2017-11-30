<template>
<orgchart :options="{chartContainer: '#chart-container',
  data: this.datasource}"></orgchart>
</template>

<script>
import orgchart from '../dist/vue-orgchart.min.js'

export default {
  components: { orgchart },
  created () {
    this.datasource = {
      name: 'JavaScript',
        children: [
          { 'name': 'Angular' },
          { 'name': 'React' },
          { 'name': 'Vue' }
        ]
    }
  }
}
</script>
