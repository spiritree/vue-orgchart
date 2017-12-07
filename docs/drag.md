## Draggable OrgChart

```html
/*vue*/
<template>
  <vo-basic :data="chartData" :draggable=true></vo-basic>
</template>

<script>
export default {
  created() {
    this.chartData = {
      name: 'JavaScript',
        children: [
          { name: 'Angular' },
          { name: 'React'},
          {
            name: 'Vue',
            children: [
              { name: 'Moon' },
              { name: 'San' }
            ]
          }
        ]
    }
  }
}
</script>
```

