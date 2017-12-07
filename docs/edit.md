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
      <button id="btn-add-nodes">Add</button>
      <button id="btn-delete-nodes">Delete</button>
      <button id="btn-reset">Reset</button>
      <button id="btn-export">ExportJSON</button>
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
  }
}
</script>
```
```json
```
