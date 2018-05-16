<template>
<div id="chart-container" class="vo-edit"></div>
</template>

<script>
import OrgChart from '../lib/orgchart'
import { mergeOptions } from '../lib/lodash.js'
import { bindEventHandler, clickNode, clickChart, getId } from '../lib/utils'

export default {
  name: 'VoEdit',
  props: {
    data: { type: Object },
    pan: { type: Boolean, default: false },
    zoom: { type: Boolean, default: false },
    direction: { type: String, default: 't2b' },
    verticalDepth: { type: Number },
    toggleSiblingsResp: { type: Boolean, default: false },
    ajaxURL: { type: Object },
    depth: { type: Number, default: 999 },
    nodeTitle: { type: String, default: 'name' },
    parentNodeSymbol: { type: String, default: '' },
    nodeContent: { type: String },
    nodeId: { type: String, default: 'id' },
    createNode: { type: Function },
    exportButton: { type: Boolean, default: false },
    exportButtonName: { type: String, default: 'Export' },
    exportFilename: { type: String },
    chartClass: { type: String, default: '' },
    draggable: { type: Boolean, default: false },
    dropCriteria: { type: Function },
    toggleCollapse: { type: Boolean, default: true }
  },
  data () {
    return {
      newData: null,
      orgchart: null,
      defaultOptions: {
        chartContainer: '#chart-container',
        createNode: function(node, data) {
          node.id = getId()
        }
      },
    }
  },
  mounted() {
    this.newData === null ? this.initOrgChart() : null
    this.$nextTick(() => {
      bindEventHandler('.node', 'click', clickNode, '#chart-container')
      bindEventHandler('.orgchart', 'click', clickChart, '#chart-container')
    })
  },
  methods: {
    initOrgChart() {
      const opts = mergeOptions(this.defaultOptions, this.$props)
      this.orgchart = new OrgChart(opts)
    }
  },
  watch: {
    data(newVal) {
      this.newData = newVal
      const promise = new Promise((resolve) => {
        if (newVal) {
          resolve()
        }
      })
      promise.then(() => {
        const opts = mergeOptions(this.defaultOptions, this.$props)
        this.orgchart = new OrgChart(opts)
      })
    }
  }
}
</script>
