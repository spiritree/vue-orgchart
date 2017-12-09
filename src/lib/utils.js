export const closest = (el, fn) => {
  return el && ((fn(el) && el !== document.querySelector('.orgchart')) ? el : closest(el.parentNode, fn))
}

export const addClass = (elements, classNames) => {
  elements.forEach((el) => {
    if (classNames.includes(' ')) {
      classNames.split(' ').forEach((className) => el.classList.add(className))
    } else {
      el.classList.add(classNames)
    }
  })
}

export const removeClass = (elements, classNames) => {
  elements.forEach((el) => {
    if (classNames.includes(' ')) {
      classNames.split(' ').forEach((className) => el.classList.remove(className))
    } else {
      el.classList.remove(classNames)
    }
  })
}

export const bindEventHandler = (selector, type, fn, parentSelector) => {
  if (parentSelector) {
    document.querySelector(parentSelector).addEventListener(type, function (event) {
      if ((event.target.classList && event.target.classList.contains(selector.slice(1))) ||
        closest(event.target, el => el.classList && el.classList.contains(selector.slice(1)))) {
        fn(event)
      }
    })
  } else {
    document.querySelectorAll(selector).forEach(element => {
      element.addEventListener(type, fn)
    })
  }
}

export const clickNode = (event) => {
  let sNode = closest(event.target, el => el.classList && el.classList.contains('node'))
  let sNodeInput = document.getElementById('selected-node')

  sNodeInput.value = sNode.querySelector('.title').textContent
  sNodeInput.dataset.node = sNode.id
}

export const clickChart = (event) => {
  if (!closest(event.target, el => el.classList && el.classList.contains('node'))) {
    document.getElementById('selected-node').textContent = ''
  }
}

export const addInputs = () => {
  let newNode = document.createElement('li')
  newNode.innerHTML = `<input type="text" class="new-node">`
  document.getElementById('new-nodelist').appendChild(newNode)
}

export const removeInputs = () => {
  let inputs = Array.from(document.getElementById('new-nodelist').children)
  if (inputs.length > 1) {
    inputs.pop().remove()
  }
}

export const addNodes = (orgchart) => {
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
      orgchart = new OrgChart({
        'chartContainer': '#chart-container',
        'data': { 'name': nodeVals[0] },
        'parentNodeSymbol': 'fa-th-large',
        'createNode': function (node, data) {
          node.id = getId()
        }
      })
      orgchart.chart.classList.add('view-state')
    } else {
      orgchart.addParent(chartContainer.querySelector('.node'), { 'name': nodeVals[0], 'Id': getId() })
    }
  } else if (nodeType.value === 'siblings') {
    orgchart.addSiblings(selectedNode, {
      'siblings': nodeVals.map(item => {
        return { 'name': item, 'relationship': '110', 'Id': getId() }
      })
    })
  } else {
    let hasChild = selectedNode.parentNode.colSpan > 1

    if (!hasChild) {
      let rel = nodeVals.length > 1 ? '110' : '100'

      orgchart.addChildren(selectedNode, {
        'children': nodeVals.map(item => {
          return { 'name': item, 'relationship': rel, 'Id': getId() }
        })
      })
    } else {
      orgchart.addSiblings(closest(selectedNode, el => el.nodeName === 'TABLE').querySelector('.nodes').querySelector('.node'),
        { 'siblings': nodeVals.map(function (item) { return { 'name': item, 'relationship': '110', 'Id': getId() } })
        })
    }
  }
}

export const deleteNodes = (orgchart) => {
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
  orgchart.removeNodes(sNode)
  sNodeInput.value = ''
  sNodeInput.dataset.node = ''
}

export const resetPanel = () => {
  let fNode = document.querySelector('.orgchart').querySelector('.focused')

  if (fNode) {
    fNode.classList.remove('focused')
  }
  document.getElementById('selected-node').value = ''
  document.getElementById('new-nodelist').querySelector('input').value = ''
  Array.from(document.getElementById('new-nodelist').children).slice(1).forEach(item => item.remove())
  document.getElementById('node-type-panel').querySelectorAll('input').forEach(item => {
    item.checked = false
  })
}

export const getId = () => {
  return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001)
}

export const exportJSON = (orgchart) => {
  let datasourceJSON = {}
  let ChartJSON = orgchart.getChartJSON()
  datasourceJSON = JSON.stringify(ChartJSON, null, 2)
  if(document.getElementsByTagName('code')[1]) {
    let code = document.getElementsByTagName('code')[1]
    code.innerHTML = datasourceJSON
  }
  return datasourceJSON
}
