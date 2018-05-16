### 图表属性

### 例子

`<vo-basic :data="chartData" :draggable=true></vo-basic>`

`<vo-edit :data="chartData" :draggable=true></vo-edit>`

!> 在非webpack等编译打包环境中，注意将camelCase (驼峰式命名) 的 prop 需要转换为相对应的 kebab-case (短横线分隔式命名)，如`chartName`=>`chart-name`

### 属性

<table>
  <thead>
    <tr><th>配置项</th><th>类型</th><th style="width:90px">需要</th><th>默认</th><th>描述</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td><td>Object,String</td><td>yes</td><td></td><td>图表数据</td>
    </tr>
    <tr>
      <td>pan</td><td>Boolean</td><td>no</td><td>false</td><td>鼠标拖放来平移该组织图</td>
    </tr>
    <tr>
      <td>zoom</td><td>Boolean</td><td>no</td><td>false</td><td>通过鼠标滚轮放大/缩小组织图</td>
    </tr>
    <tr>
      <td>direction</td><td>String</td><td>no</td><td>"t2b"</td><td>t2b(表示 "top to bottom", it's default value), b2t(表示 "bottom to top"), l2r(表示 "left to right"), r2l(表示 "right to left").</td>
    </tr>
    <tr>
      <td>verticalDepth</td><td>Interger</td><td>no</td><td></td><td>垂直深度</td>
    </tr>
    <tr>
      <td>toggleSiblingsResp</td><td>Boolean</td><td>no</td><td>false</td><td>一旦启用此选项，用户可以显示/隐藏左/右兄弟节点分别点击左/右箭头</td>
    </tr>
    <tr>
      <td>toggleCollapse</td><td>Boolean</td><td>no</td><td>true</td><td>你可以设值为false来关闭节点的箭头图标</td>
    </tr>
    <tr>
      <td>ajaxURL</td><td>String</td><td>no</td><td></td><td>Ajax获取JSON数据</td>
    </tr>
    <tr>
      <td>depth</td><td>Positive Interger</td><td>no</td><td>999</td><td>最大级别</td>
    </tr>
    <tr>
      <td>nodeTitle</td><td>String</td><td>no</td><td>"name"</td><td>树形组织图中的元素名称</td>
    </tr>
    <tr>
      <td>parentNodeSymbol</td><td>String</td><td>no</td><td>""</td><td>父元素节点的图标class</td>
    </tr>
    <tr>
      <td>nodeContent</td><td>String</td><td>no</td><td></td><td>树形组织图中二级元素名称</td>
    </tr>
    <tr>
      <td>nodeId</td><td>String</td><td>no</td><td>"id"</td><td>节点的ID值</td>
    </tr>
    <tr>
      <td>createNode</td><td>Function</td><td>no</td><td></td><td>一个回调函数来定制创造节点的规则</td>
    </tr>
    <tr>
      <td>exportButton</td><td>Boolean</td><td>no</td><td>false</td><td>导出图片</td>
    </tr>
    <tr>
      <td>exportButtonName</td><td>string</td><td>no</td><td></td><td>导出图片按钮标题</td>
    </tr>
    <tr>
      <td>exportFilename</td><td>String</td><td>no</td><td>"Orgchart"</td><td>导出图片名称</td>
    </tr>
    <tr>
      <td>chartClass</td><td>String</td><td>no</td><td>""</td><td>图标的class</td>
    </tr>
    <tr>
      <td>draggable</td><td>Boolean</td><td>no</td><td>false</td><td>可拖拉选项</td>
    </tr>
    <tr>
      <td>dropCriteria</td><td>Function</td><td>no</td><td></td><td>可以通过函数来限制拖拽节点和放置区之间的关系。另外，这个函数接受三个参数（draggedNode，dragZone，dropZone），只返回boolean值。</td>
    </tr>
  </tbody>
</table>
