<template>
<div>
  <vo-edit style="background: #fff"
    :data="chartData"
    :exportButton=true
    exportFilename="test"
  >
  </vo-edit>
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
      <button id="btn-add-nodes">Add</button>
      <button id="btn-delete-nodes">Delete</button>
      <button id="btn-reset">Reset</button>
    </div>
  </div>
</div>
</template>

<script>
import { VoEdit } from '../dist/vue-orgchart.min.js'
export default {
  components: { VoEdit },
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
}
</script>
<style>
html {
  background: #f0f2f5;
}
@media (min-width: 768px) {
  .input-node-container {
    margin-top:-20px;
    margin-bottom:15px;
  }
}
.edit-container {
  border-radius: 5px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.edit-container .item {
  flex: 1;
}
.edit-container .item-half {
  height: 24px;
  flex: 0 0 45%;
  text-align: center;
}
@media (max-width: 768px) {
  .edit-container {
    height: 140px;
    flex-direction: column;
    flex: 1;
  }
  .edit-container .item {
    flex: auto;
  }
}
.json-container {
  margin-right: 15px;
  float: right;
  border-radius: 5px;
}
.json {
  margin-top: -12.5px;
  margin-left: 10px;
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #383a42;
  background: #fff;
}
</style>

