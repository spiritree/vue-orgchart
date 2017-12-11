## Export Picture OrgChart

```html
/*vue*/
<template>
  <vo-basic :data="chartData" :export-button=true export-filename="testpic"></vo-basic>
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
