<template>
<div id="chart-container" class="vo-edit"></div>
</template>

<script>
import OrgChart from '../lib/orgchart'
import { mergeOptions } from '../lib/lodash.js'
import { bindEventHandler, clickNode, clickChart, getId, addNodes, deleteNodes, resetPanel, exportJSON } from '../lib/utils'

export default {
  name: 'orgchart',
  props: {
    data: { type: Object, default () { return {} } },
    pan: { type: Boolean, default: false },
    pan: { type: Boolean, default: false },
    direction: { type: String, default: 't2b' },
    verticalDepth: { type: Number },
    toggleSiblingsResp: { type: Boolean, default: false },
    ajaxURL: { type: Object },
    depth: { type: Number, default: 999 },
    nodeTitle: { type: String, default: 'name' },
    parentNodeSymbol: { type: String, default: 'fa-users' },
    nodeContent: { type: String },
    nodeId: { type: String, default: 'id' },
    createNode: { type: Function },
    exportButton: { type: Boolean, default: false },
    exportFilename: { type: String },
    chartClass: { type: String, default: '' },
    draggable: { type: Boolean, default: false },
    dropCriteria: { type: Function }
  },
  data () {
    return {
      orgchart: null,
      defaultOptions: {
        chartContainer: '#chart-container',
        createNode: function(node, data) {
          node.id = getId()
        }
      }
    }
  },
  mounted() {
    this.initOrgChart()
    this.$nextTick(
      bindEventHandler('.node', 'click', clickNode, '#chart-container'),
      bindEventHandler('.orgchart', 'click', clickChart, '#chart-container'),
      document.getElementById('btn-add-nodes').addEventListener('click', () => addNodes(this.orgchart)),
      document.getElementById('btn-delete-nodes').addEventListener('click', () => deleteNodes(this.orgchart)),
      document.getElementById('btn-reset').addEventListener('click', resetPanel),
      document.getElementById('btn-export').addEventListener('click', () => exportJSON(this.orgchart))
    )
  },
  methods: {
    initOrgChart() {
      const opts = mergeOptions(this.defaultOptions, this.$props)
      this.orgchart = new OrgChart(opts)
    }
  }
}
</script>
