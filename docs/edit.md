## Editable OrgChart

```html
/*vue*/
<template>
  <div>
    <vo-edit :data="chartData" :draggable=true></vo-edit>
    <div id="edit-panel" class="view-state edit-container">
    <div class="item item-half">
      <div class="input-node-container">
        <label class="selected-node-group">Selected Node</label>
        <input type="text" id="selected-node" class="selected-node-group new-node">
      </div>
      <div>
        <label>New Node</label>
        <ul id="new-nodelist">
          <li><input type="text" class="new-node"></li>
        </ul>
      </div>
    </div>
    <div id="node-type-panel" class="radio-panel item">
      <input type="radio" name="node-type" id="rd-parent" value="parent" class=""><label for="rd-parent">Root</label>
      <input type="radio" name="node-type" id="rd-child" value="children"><label for="rd-child">Child</label>
      <input type="radio" name="node-type" id="rd-sibling" value="siblings"><label for="rd-sibling">Sibling</label>
    </div>
    <div class="item">
      <button @click="addNodes">Add</button>
      <button @click="deleteNodes">Delete</button>
      <button @click="exportJSON">Export JSON</button>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  created() {
    this.chartData = {
      name: 'JavaScript',
        children: [
          {
            name: 'Angular',
            children: [{ name: '?' }]
          },
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
  },
  mounted() {
    this.$nextTick(
      this.mountOrgchart()
    )
  },
  methods: {
    mountOrgchart() {
      this.$children.forEach((item) => {
        item.orgchart !== undefined ? this.orgchart = item.orgchart : null
      })
    },
    addNodes() {
      let chartContainer = document.getElementById('chart-container')
      let nodeVals = []

      Array.from(document.getElementById('new-nodelist').querySelectorAll('.new-node'))
        .forEach(item => {
          let validVal = item.value.trim()

          if (validVal) {
            nodeVals.push(validVal)
          }
        })
      let selectedNode = document.getElementById(document.getElementById('selected-node').dataset.node)

      if (!nodeVals.length) {
        alert('Please input value for new node')
        return
      }
      let nodeType = document.querySelector('input[name="node-type"]:checked')

      if (!nodeType) {
        alert('Please select a node type')
        return
      }
      if (nodeType.value !== 'parent' && !document.querySelector('.orgchart')) {
        alert('Please creat the root node firstly when you want to build up the orgchart from the scratch')
        return
      }
      if (nodeType.value !== 'parent' && !selectedNode) {
        alert('Please select one node in orgchart')
        return
      }
      /* eslint-disable */
      if (nodeType.value === 'parent') {
        if (!chartContainer.children.length) {// if the original chart has been deleted
          this.orgchart = new OrgChart({
            'chartContainer': '#chart-container',
            'data': { 'name': nodeVals[0] },
            'parentNodeSymbol': 'fa-th-large',
            'createNode': function (node, data) {
              node.id = this.getId()
            }
          })
          this.orgchart.chart.classList.add('view-state')
        } else {
          this.orgchart.addParent(chartContainer.querySelector('.node'), { 'name': nodeVals[0], 'Id': this.getId() })
        }
      } else if (nodeType.value === 'siblings') {
        this.orgchart.addSiblings(selectedNode, {
          'siblings': nodeVals.map(item => {
            return { 'name': item, 'relationship': '110', 'Id': this.getId() }
          })
        })
      } else {
        let hasChild = selectedNode.parentNode.colSpan > 1

        if (!hasChild) {
          let rel = nodeVals.length > 1 ? '110' : '100'

          this.orgchart.addChildren(selectedNode, {
            'children': nodeVals.map(item => {
              return { 'name': item, 'relationship': rel, 'Id': this.getId() }
            })
          })
        } else {
          this.orgchart.addSiblings(closest(selectedNode, el => el.nodeName === 'TABLE').querySelector('.nodes').querySelector('.node'),
            { 'siblings': nodeVals.map(function (item) { return { 'name': item, 'relationship': '110', 'Id': this.getId() } })
            })
        }
      }
    },
    deleteNodes() {
      let sNodeInput = document.getElementById('selected-node')
      let sNode = document.getElementById(sNodeInput.dataset.node)

      if (!sNode) {
        alert('Please select one node in orgchart')
        return
      } else if (sNode === document.querySelector('.orgchart').querySelector('.node')) {
        if (!window.confirm('Are you sure you want to delete the whole chart?')) {
          return
        }
      }
      this.orgchart.removeNodes(sNode)
      sNodeInput.value = ''
      sNodeInput.dataset.node = ''
    },
    exportJSON() {
      let datasourceJSON = {}
      let ChartJSON = this.orgchart.getChartJSON()
      datasourceJSON = JSON.stringify(ChartJSON, null, 2)
      if(document.getElementsByTagName('code')[1]) {
        let code = document.getElementsByTagName('code')[1]
        code.innerHTML = datasourceJSON
      }
      return datasourceJSON
    },
    getId() {
      return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001)
    }
  }
}
</script>
```
```json
```
