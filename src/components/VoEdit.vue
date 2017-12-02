<template>
<div id="chart-container"></div>
</template>

<script>
import OrgChart from '../lib/orgchart'
export default {
  name: 'orgchart',
  props: {
    options: {
      type: Object
    }
  },
  data () {
    return {
      orgchart: null,
      defaultOptions: {
        'chartContainer': '#chart-container'
      }
    }
  },
  mounted() {
    this.initOrgChart();
  },
  methods: {
    initOrgChart() {
      const options = Object.assign(this.defaultOptions, this.options)
      this.orgchart = new OrgChart(options)
    }
  }
}
</script>
