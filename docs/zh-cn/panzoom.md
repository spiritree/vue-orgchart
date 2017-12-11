## 缩放组织树图


```html
/*vue*/
<template>
  <vo-basic :data="chartData" :pan=true :zoom=true></vo-basic>
</template>

<script>
export default {
  created() {
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
```
