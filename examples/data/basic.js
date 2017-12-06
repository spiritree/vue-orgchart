export default {
  name: '基础树形关系图(Basic orgchart)',
  type: 'basic',
    data: [
      {
        name: 'Basic orgchart',
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
