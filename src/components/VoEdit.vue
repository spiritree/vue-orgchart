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
      orgchart: null
    }
  },
  mounted() {
    this.initOrgChart();
  },
  methods: {
    initOrgChart() {
      this.orgchart = new OrgChart(this.options)
    }
  }
}
</script>
