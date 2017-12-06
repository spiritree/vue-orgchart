export default {
  name: '可编辑树形关系图(Editable orgchart)',
  type: 'edit',
    data: [
      {
        name: 'Editable orgchart',
        data: {
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
    ]
}
