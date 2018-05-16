### Vue-OrgChart props

### Example

`<vo-basic :data="chartData" :draggable=true></vo-basic>`

`<vo-edit :data="chartData" :draggable=true></vo-edit>`

### Props

<table>
  <thead>
    <tr><th>Name</th><th>Type</th><th>Required</th><th>Default</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td><td>json or string</td><td>yes</td><td></td><td>datasource usded to build out structure of orgchart. It could be a json object or a string containing the URL to which the ajax request is sent.</td>
    </tr>
    <tr>
      <td>pan</td><td>boolean</td><td>no</td><td>false</td><td>Users could pan the orgchart by mouse drag&drop if they enable this option.</td>
    </tr>
    <tr>
      <td>zoom</td><td>boolean</td><td>no</td><td>false</td><td>Users could zoomin/zoomout the orgchart by mouse wheel if they enable this option.</td>
    </tr>
    <tr>
      <td>direction</td><td>string</td><td>no</td><td>"t2b"</td><td>The available values are t2b(implies "top to bottom", it's default value), b2t(implies "bottom to top"), l2r(implies "left to right"), r2l(implies "right to left").</td>
    </tr>
    <tr>
      <td>verticalDepth</td><td>integer</td><td>no</td><td></td><td>Users can make use of this option to align the nodes vertically from the specified depth.</td>
    </tr>
    <tr>
      <td>toggleSiblingsResp</td><td>boolean</td><td>no</td><td>false</td><td>Once enable this option, users can show/hide left/right sibling nodes respectively by clicking left/right arrow.</td>
    </tr>
    <tr>
      <td>toggleCollapse</td><td>boolean</td><td>no</td><td>true</td><td>Show the arrow and you can click it to collapse the node</td>
    </tr>
    <tr>
      <td>ajaxURL</td><td>json</td><td>no</td><td></td><td>It inclueds four properites -- parent, children, siblings, families(ask for parent node and siblings nodes). As their names imply, different propety provides the URL to which ajax request for different nodes is sent.</td>
    </tr>
    <tr>
      <td>depth</td><td>positive integer</td><td>no</td><td>999</td><td>It indicates the level that at the very beginning orgchart is expanded to.</td>
    </tr>
    <tr>
      <td>nodeTitle</td><td>string</td><td>no</td><td>"name"</td><td>It sets one property of datasource as text content of title section of orgchart node. In fact, users can create a simple orghcart with only nodeTitle option.</td>
    </tr>
    <tr>
      <td>parentNodeSymbol</td><td>string</td><td>no</td><td>" "</td><td>Using font awesome icon to imply that the node has child nodes.</td>
    </tr>
    <tr>
      <td>nodeContent</td><td>string</td><td>no</td><td></td><td>It sets one property of datasource as text content of content section of orgchart node.</td>
    </tr>
    <tr>
      <td>nodeId</td><td>string</td><td>no</td><td>"id"</td><td>It sets one property of datasource as unique identifier of every orgchart node.</td>
    </tr>
    <tr>
      <td>createNode</td><td>function</td><td>no</td><td></td><td>It's a callback function used to customize every orgchart node. It recieves two parament: "$node" stands for jquery object of single node div; "data" stands for datasource of single node.</td>
    </tr>
    <tr>
      <td>exportButton</td><td>boolean</td><td>no</td><td>false</td><td>It enable the export button for orgchart.</td>
    </tr>
    <tr>
      <td>exportButtonName</td><td>string</td><td>no</td><td></td><td>the name for export Button</td>
    </tr>
    <tr>
      <td>exportFilename</td><td>string</td><td>no</td><td>"Orgchart"</td><td>It's filename when you export current orgchart as a picture.</td>
    </tr>
    <tr>
      <td>chartClass</td><td>string</td><td>no</td><td>""</td><td>when you wanna instantiate multiple orgcharts on one page, you should add diffent classname to them in order to distinguish them.</td>
    </tr>
    <tr>
      <td>draggable</td><td>boolean</td><td>no</td><td>false</td><td>Users can drag & drop the nodes of orgchart if they enable this option. **Note**: this feature doesn't work on IE due to its poor support for HTML5 drag & drop API.</td>
    </tr>
    <tr>
      <td>dropCriteria</td><td>function</td><td>no</td><td></td><td>Users can construct their own criteria to limit the relationships between dragged node and drop zone. Furtherly, this function accept three arguments(draggedNode, dragZone, dropZone) and just only return boolen values.</td>
    </tr>
  </tbody>
</table>
