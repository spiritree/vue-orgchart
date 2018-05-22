var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var OrgChart$1 = function () {
  function OrgChart(options) {
    classCallCheck(this, OrgChart);

    this._name = 'OrgChart';
    Promise.prototype.finally = function (callback) {
      var P = this.constructor;

      return this.then(function (value) {
        return P.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return P.resolve(callback()).then(function () {
          throw reason;
        });
      });
    };

    var that = this,
        defaultOptions = {
      'nodeTitle': 'name',
      'nodeId': 'id',
      'toggleSiblingsResp': false,
      'depth': 999,
      'chartClass': '',
      'exportButton': false,
      'exportButtonName': 'Export',
      'exportFilename': 'OrgChart',
      'parentNodeSymbol': '',
      'draggable': false,
      'direction': 't2b',
      'pan': false,
      'zoom': false,
      'toggleCollapse': true
    },
        opts = _extends(defaultOptions, options),
        data = opts.data,
        chart = document.createElement('div'),
        chartContainer = document.querySelector(opts.chartContainer);

    this.options = opts;
    delete this.options.data;
    this.chart = chart;
    this.chartContainer = chartContainer;
    chart.dataset.options = JSON.stringify(opts);
    chart.setAttribute('class', 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') + (opts.direction !== 't2b' ? ' ' + opts.direction : ''));
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
      // local json datasource
      this.buildHierarchy(chart, opts.ajaxURL ? data : this._attachRel(data, '00'), 0);
    } else if (typeof data === 'string' && data.startsWith('#')) {
      // ul datasource
      this.buildHierarchy(chart, this._buildJsonDS(document.querySelector(data).children[0]), 0);
    } else {
      // ajax datasource
      var spinner = document.createElement('i');

      spinner.setAttribute('class', 'fa fa-circle-o-notch fa-spin spinner');
      chart.appendChild(spinner);
      this._getJSON(data).then(function (resp) {
        that.buildHierarchy(chart, opts.ajaxURL ? resp : that._attachRel(resp, '00'), 0);
      }).catch(function (err) {
        console.error('failed to fetch datasource for orgchart', err);
      }).finally(function () {
        var spinner = chart.querySelector('.spinner');

        spinner.parentNode.removeChild(spinner);
      });
    }
    chart.addEventListener('click', this._clickChart.bind(this));
    // append the export button to the chart-container
    if (opts.exportButton && !chartContainer.querySelector('.oc-export-btn')) {
      var exportBtn = document.createElement('button'),
          downloadBtn = document.createElement('a');

      exportBtn.setAttribute('class', 'oc-export-btn' + (opts.chartClass !== '' ? ' ' + opts.chartClass : ''));
      opts.exportButtonName === 'Export' ? exportBtn.innerHTML = 'Export' : exportBtn.innerHTML = '' + opts.exportButtonName;
      exportBtn.addEventListener('click', this._clickExportButton.bind(this));
      downloadBtn.setAttribute('class', 'oc-download-btn' + (opts.chartClass !== '' ? ' ' + opts.chartClass : ''));
      downloadBtn.setAttribute('download', opts.exportFilename + '.png');
      chartContainer.appendChild(exportBtn);
      chartContainer.appendChild(downloadBtn);
    }

    if (opts.pan) {
      chartContainer.style.overflow = 'hidden';
      chart.addEventListener('mousedown', this._onPanStart.bind(this));
      chart.addEventListener('touchstart', this._onPanStart.bind(this));
      document.body.addEventListener('mouseup', this._onPanEnd.bind(this));
      document.body.addEventListener('touchend', this._onPanEnd.bind(this));
    }

    if (opts.zoom) {
      chartContainer.addEventListener('wheel', this._onWheeling.bind(this));
      chartContainer.addEventListener('touchstart', this._onTouchStart.bind(this));
      document.body.addEventListener('touchmove', this._onTouchMove.bind(this));
      document.body.addEventListener('touchend', this._onTouchEnd.bind(this));
    }

    chartContainer.appendChild(chart);
  }

  createClass(OrgChart, [{
    key: '_closest',
    value: function _closest(el, fn) {
      return el && (fn(el) && el !== this.chart ? el : this._closest(el.parentNode, fn));
    }
  }, {
    key: '_siblings',
    value: function _siblings(el, expr) {
      return Array.from(el.parentNode.children).filter(function (child) {
        if (child !== el) {
          if (expr) {
            return el.matches(expr);
          }
          return true;
        }
        return false;
      });
    }
  }, {
    key: '_prevAll',
    value: function _prevAll(el, expr) {
      var sibs = [],
          prevSib = el.previousElementSibling;

      while (prevSib) {
        if (!expr || prevSib.matches(expr)) {
          sibs.push(prevSib);
        }
        prevSib = prevSib.previousElementSibling;
      }
      return sibs;
    }
  }, {
    key: '_nextAll',
    value: function _nextAll(el, expr) {
      var sibs = [];
      var nextSib = el.nextElementSibling;

      while (nextSib) {
        if (!expr || nextSib.matches(expr)) {
          sibs.push(nextSib);
        }
        nextSib = nextSib.nextElementSibling;
      }
      return sibs;
    }
  }, {
    key: '_isVisible',
    value: function _isVisible(el) {
      return el.offsetParent !== null;
    }
  }, {
    key: '_addClass',
    value: function _addClass(elements, classNames) {
      elements.forEach(function (el) {
        if (classNames.indexOf(' ') > 0) {
          classNames.split(' ').forEach(function (className) {
            return el.classList.add(className);
          });
        } else {
          el.classList.add(classNames);
        }
      });
    }
  }, {
    key: '_removeClass',
    value: function _removeClass(elements, classNames) {
      elements.forEach(function (el) {
        if (classNames.indexOf(' ') > 0) {
          classNames.split(' ').forEach(function (className) {
            return el.classList.remove(className);
          });
        } else {
          el.classList.remove(classNames);
        }
      });
    }
  }, {
    key: '_css',
    value: function _css(elements, prop, val) {
      elements.forEach(function (el) {
        el.style[prop] = val;
      });
    }
  }, {
    key: '_removeAttr',
    value: function _removeAttr(elements, attr) {
      elements.forEach(function (el) {
        el.removeAttribute(attr);
      });
    }
  }, {
    key: '_one',
    value: function _one(el, type, listener, self) {
      var one = function one(event) {
        try {
          listener.call(self, event);
        } finally {
          el.removeEventListener(type, one);
        }
      };

      el && el.addEventListener(type, one);
    }
  }, {
    key: '_getDescElements',
    value: function _getDescElements(ancestors, selector) {
      var results = [];

      ancestors.forEach(function (el) {
        return results.push.apply(results, toConsumableArray(el.querySelectorAll(selector)));
      });
      return results;
    }
  }, {
    key: '_getJSON',
    value: function _getJSON(url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        function handler() {
          if (this.readyState !== 4) {
            return;
          }
          if (this.status === 200) {
            resolve(JSON.parse(this.response));
          } else {
            reject(new Error(this.statusText));
          }
        }
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        // xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
      });
    }
  }, {
    key: '_buildJsonDS',
    value: function _buildJsonDS(li) {
      var _this = this;

      var subObj = {
        'name': li.firstChild.textContent.trim(),
        'relationship': (li.parentNode.parentNode.nodeName === 'LI' ? '1' : '0') + (li.parentNode.children.length > 1 ? 1 : 0) + (li.children.length ? 1 : 0)
      };

      if (li.id) {
        subObj.id = li.id;
      }
      if (li.querySelector('ul')) {
        Array.from(li.querySelector('ul').children).forEach(function (el) {
          if (!subObj.children) {
            subObj.children = [];
          }
          subObj.children.push(_this._buildJsonDS(el));
        });
      }
      return subObj;
    }
  }, {
    key: '_attachRel',
    value: function _attachRel(data, flags) {
      data.relationship = flags + (data.children && data.children.length > 0 ? 1 : 0);
      if (data.children) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = data.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            this._attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return data;
    }
  }, {
    key: '_repaint',
    value: function _repaint(node) {
      if (node) {
        node.style.offsetWidth = node.offsetWidth;
      }
    }
    // whether the cursor is hovering over the node

  }, {
    key: '_isInAction',
    value: function _isInAction(node) {
      return node.querySelector(':scope > .edge').className.indexOf('fa-') > -1;
    }
    // detect the exist/display state of related node

  }, {
    key: '_getNodeState',
    value: function _getNodeState(node, relation) {
      var _this2 = this;

      var criteria = void 0,
          state = { 'exist': false, 'visible': false };

      if (relation === 'parent') {
        criteria = this._closest(node, function (el) {
          return el.classList && el.classList.contains('nodes');
        });
        if (criteria) {
          state.exist = true;
        }
        if (state.exist && this._isVisible(criteria.parentNode.children[0])) {
          state.visible = true;
        }
      } else if (relation === 'children') {
        criteria = this._closest(node, function (el) {
          return el.nodeName === 'TR';
        }).nextElementSibling;
        if (criteria) {
          state.exist = true;
        }
        if (state.exist && this._isVisible(criteria)) {
          state.visible = true;
        }
      } else if (relation === 'siblings') {
        criteria = this._siblings(this._closest(node, function (el) {
          return el.nodeName === 'TABLE';
        }).parentNode);
        if (criteria.length) {
          state.exist = true;
        }
        if (state.exist && criteria.some(function (el) {
          return _this2._isVisible(el);
        })) {
          state.visible = true;
        }
      }

      return state;
    }
    // find the related nodes

  }, {
    key: 'getRelatedNodes',
    value: function getRelatedNodes(node, relation) {
      if (relation === 'parent') {
        return this._closest(node, function (el) {
          return el.classList.contains('nodes');
        }).parentNode.children[0].querySelector('.node');
      } else if (relation === 'children') {
        return Array.from(this._closest(node, function (el) {
          return el.nodeName === 'TABLE';
        }).lastChild.children).map(function (el) {
          return el.querySelector('.node');
        });
      } else if (relation === 'siblings') {
        return this._siblings(this._closest(node, function (el) {
          return el.nodeName === 'TABLE';
        }).parentNode).map(function (el) {
          return el.querySelector('.node');
        });
      }
      return [];
    }
  }, {
    key: '_switchHorizontalArrow',
    value: function _switchHorizontalArrow(node) {
      var opts = this.options,
          leftEdge = node.querySelector('.leftEdge'),
          rightEdge = node.querySelector('.rightEdge'),
          temp = this._closest(node, function (el) {
        return el.nodeName === 'TABLE';
      }).parentNode;

      if (opts.toggleSiblingsResp && (typeof opts.ajaxURL === 'undefined' || this._closest(node, function (el) {
        return el.classList.contains('.nodes');
      }).dataset.siblingsLoaded)) {
        var prevSib = temp.previousElementSibling,
            nextSib = temp.nextElementSibling;

        if (prevSib) {
          if (prevSib.classList.contains('hidden')) {
            leftEdge.classList.add('fa-chevron-left');
            leftEdge.classList.remove('fa-chevron-right');
          } else {
            leftEdge.classList.add('fa-chevron-right');
            leftEdge.classList.remove('fa-chevron-left');
          }
        }
        if (nextSib) {
          if (nextSib.classList.contains('hidden')) {
            rightEdge.classList.add('fa-chevron-right');
            rightEdge.classList.remove('fa-chevron-left');
          } else {
            rightEdge.classList.add('fa-chevron-left');
            rightEdge.classList.remove('fa-chevron-right');
          }
        }
      } else {
        var sibs = this._siblings(temp),
            sibsVisible = sibs.length ? !sibs.some(function (el) {
          return el.classList.contains('hidden');
        }) : false;

        leftEdge.classList.toggle('fa-chevron-right', sibsVisible);
        leftEdge.classList.toggle('fa-chevron-left', !sibsVisible);
        rightEdge.classList.toggle('fa-chevron-left', sibsVisible);
        rightEdge.classList.toggle('fa-chevron-right', !sibsVisible);
      }
    }
  }, {
    key: '_hoverNode',
    value: function _hoverNode(event) {
      var node = event.target,
          flag = false,
          topEdge = node.querySelector(':scope > .topEdge'),
          bottomEdge = node.querySelector(':scope > .bottomEdge'),
          leftEdge = node.querySelector(':scope > .leftEdge');

      if (event.type === 'mouseenter') {
        if (topEdge) {
          flag = this._getNodeState(node, 'parent').visible;
          topEdge.classList.toggle('fa-chevron-up', !flag);
          topEdge.classList.toggle('fa-chevron-down', flag);
        }
        if (bottomEdge) {
          flag = this._getNodeState(node, 'children').visible;
          bottomEdge.classList.toggle('fa-chevron-down', !flag);
          bottomEdge.classList.toggle('fa-chevron-up', flag);
        }
        if (leftEdge) {
          this._switchHorizontalArrow(node);
        }
      } else {
        Array.from(node.querySelectorAll(':scope > .edge')).forEach(function (el) {
          el.classList.remove('fa-chevron-up', 'fa-chevron-down', 'fa-chevron-right', 'fa-chevron-left');
        });
      }
    }
    // define node click event handler

  }, {
    key: '_clickNode',
    value: function _clickNode(event) {
      var clickedNode = event.currentTarget,
          focusedNode = this.chart.querySelector('.focused');

      if (focusedNode) {
        focusedNode.classList.remove('focused');
      }
      clickedNode.classList.add('focused');
    }
    // build the parent node of specific node

  }, {
    key: '_buildParentNode',
    value: function _buildParentNode(currentRoot, nodeData, callback) {
      var that = this,
          table = document.createElement('table');

      nodeData.relationship = nodeData.relationship || '001';
      this._createNode(nodeData, 0).then(function (nodeDiv) {
        var chart = that.chart;

        nodeDiv.classList.remove('slide-up');
        nodeDiv.classList.add('slide-down');
        var parentTr = document.createElement('tr'),
            superiorLine = document.createElement('tr'),
            inferiorLine = document.createElement('tr'),
            childrenTr = document.createElement('tr');

        parentTr.setAttribute('class', 'hidden');
        parentTr.innerHTML = '<td colspan="2"></td>';
        table.appendChild(parentTr);
        superiorLine.setAttribute('class', 'lines hidden');
        superiorLine.innerHTML = '<td colspan="2"><div class="downLine"></div></td>';
        table.appendChild(superiorLine);
        inferiorLine.setAttribute('class', 'lines hidden');
        inferiorLine.innerHTML = '<td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td>';
        table.appendChild(inferiorLine);
        childrenTr.setAttribute('class', 'nodes');
        childrenTr.innerHTML = '<td colspan="2"></td>';
        table.appendChild(childrenTr);
        table.querySelector('td').appendChild(nodeDiv);
        chart.insertBefore(table, chart.children[0]);
        table.children[3].children[0].appendChild(chart.lastChild);
        callback();
      }).catch(function (err) {
        console.error('Failed to create parent node', err);
      });
    }
  }, {
    key: '_switchVerticalArrow',
    value: function _switchVerticalArrow(arrow) {
      arrow.classList.toggle('fa-chevron-up');
      arrow.classList.toggle('fa-chevron-down');
    }
    // show the parent node of the specified node

  }, {
    key: 'showParent',
    value: function showParent(node) {
      // just show only one superior level
      var temp = this._prevAll(this._closest(node, function (el) {
        return el.classList.contains('nodes');
      }));

      this._removeClass(temp, 'hidden');
      // just show only one line
      this._addClass(Array(temp[0].children).slice(1, -1), 'hidden');
      // show parent node with animation
      var parent = temp[2].querySelector('.node');

      this._one(parent, 'transitionend', function () {
        parent.classList.remove('slide');
        if (this._isInAction(node)) {
          this._switchVerticalArrow(node.querySelector(':scope > .topEdge'));
        }
      }, this);
      this._repaint(parent);
      parent.classList.add('slide');
      parent.classList.remove('slide-down');
    }
    // show the sibling nodes of the specified node

  }, {
    key: 'showSiblings',
    value: function showSiblings(node, direction) {
      var _this3 = this;

      // firstly, show the sibling td tags
      var siblings = [],
          temp = this._closest(node, function (el) {
        return el.nodeName === 'TABLE';
      }).parentNode;

      if (direction) {
        siblings = direction === 'left' ? this._prevAll(temp) : this._nextAll(temp);
      } else {
        siblings = this._siblings(temp);
      }
      this._removeClass(siblings, 'hidden');
      // secondly, show the lines
      var upperLevel = this._prevAll(this._closest(node, function (el) {
        return el.classList.contains('nodes');
      }));

      temp = Array.from(upperLevel[0].querySelectorAll(':scope > .hidden'));
      if (direction) {
        this._removeClass(temp.slice(0, siblings.length * 2), 'hidden');
      } else {
        this._removeClass(temp, 'hidden');
      }
      // thirdly, do some cleaning stuff
      if (!this._getNodeState(node, 'parent').visible) {
        this._removeClass(upperLevel, 'hidden');
        var parent = upperLevel[2].querySelector('.node');

        this._one(parent, 'transitionend', function (event) {
          event.target.classList.remove('slide');
        }, this);
        this._repaint(parent);
        parent.classList.add('slide');
        parent.classList.remove('slide-down');
      }
      // lastly, show the sibling nodes with animation
      siblings.forEach(function (sib) {
        Array.from(sib.querySelectorAll('.node')).forEach(function (node) {
          if (_this3._isVisible(node)) {
            node.classList.add('slide');
            node.classList.remove('slide-left', 'slide-right');
          }
        });
      });
      this._one(siblings[0].querySelector('.slide'), 'transitionend', function () {
        var _this4 = this;

        siblings.forEach(function (sib) {
          _this4._removeClass(Array.from(sib.querySelectorAll('.slide')), 'slide');
        });
        if (this._isInAction(node)) {
          this._switchHorizontalArrow(node);
          node.querySelector('.topEdge').classList.remove('fa-chevron-up');
          node.querySelector('.topEdge').classList.add('fa-chevron-down');
        }
      }, this);
    }
    // hide the sibling nodes of the specified node

  }, {
    key: 'hideSiblings',
    value: function hideSiblings(node, direction) {
      var _this5 = this;

      var nodeContainer = this._closest(node, function (el) {
        return el.nodeName === 'TABLE';
      }).parentNode,
          siblings = this._siblings(nodeContainer);

      siblings.forEach(function (sib) {
        if (sib.querySelector('.spinner')) {
          _this5.chart.dataset.inAjax = false;
        }
      });

      if (!direction || direction && direction === 'left') {
        var preSibs = this._prevAll(nodeContainer);

        preSibs.forEach(function (sib) {
          Array.from(sib.querySelectorAll('.node')).forEach(function (node) {
            if (_this5._isVisible(node)) {
              node.classList.add('slide', 'slide-right');
            }
          });
        });
      }
      if (!direction || direction && direction !== 'left') {
        var nextSibs = this._nextAll(nodeContainer);

        nextSibs.forEach(function (sib) {
          Array.from(sib.querySelectorAll('.node')).forEach(function (node) {
            if (_this5._isVisible(node)) {
              node.classList.add('slide', 'slide-left');
            }
          });
        });
      }

      var animatedNodes = [];

      this._siblings(nodeContainer).forEach(function (sib) {
        Array.prototype.push.apply(animatedNodes, Array.from(sib.querySelectorAll('.slide')));
      });
      var lines = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = animatedNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _node = _step2.value;

          var temp = this._closest(_node, function (el) {
            return el.classList.contains('nodes');
          }).previousElementSibling;

          lines.push(temp);
          lines.push(temp.previousElementSibling);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      lines = [].concat(toConsumableArray(new Set(lines)));
      lines.forEach(function (line) {
        line.style.visibility = 'hidden';
      });

      this._one(animatedNodes[0], 'transitionend', function (event) {
        var _this6 = this;

        lines.forEach(function (line) {
          line.removeAttribute('style');
        });
        var sibs = [];

        if (direction) {
          if (direction === 'left') {
            sibs = this._prevAll(nodeContainer, ':not(.hidden)');
          } else {
            sibs = this._nextAll(nodeContainer, ':not(.hidden)');
          }
        } else {
          sibs = this._siblings(nodeContainer);
        }
        var temp = Array.from(this._closest(nodeContainer, function (el) {
          return el.classList.contains('nodes');
        }).previousElementSibling.querySelectorAll(':scope > :not(.hidden)'));

        var someLines = temp.slice(1, direction ? sibs.length * 2 + 1 : -1);

        this._addClass(someLines, 'hidden');
        this._removeClass(animatedNodes, 'slide');
        sibs.forEach(function (sib) {
          Array.from(sib.querySelectorAll('.node')).slice(1).forEach(function (node) {
            if (_this6._isVisible(node)) {
              node.classList.remove('slide-left', 'slide-right');
              node.classList.add('slide-up');
            }
          });
        });
        sibs.forEach(function (sib) {
          _this6._addClass(Array.from(sib.querySelectorAll('.lines')), 'hidden');
          _this6._addClass(Array.from(sib.querySelectorAll('.nodes')), 'hidden');
          _this6._addClass(Array.from(sib.querySelectorAll('.verticalNodes')), 'hidden');
        });
        this._addClass(sibs, 'hidden');

        if (this._isInAction(node)) {
          this._switchHorizontalArrow(node);
        }
      }, this);
    }
    // recursively hide the ancestor node and sibling nodes of the specified node

  }, {
    key: 'hideParent',
    value: function hideParent(node) {
      var temp = Array.from(this._closest(node, function (el) {
        return el.classList.contains('nodes');
      }).parentNode.children).slice(0, 3);

      if (temp[0].querySelector('.spinner')) {
        this.chart.dataset.inAjax = false;
      }
      // hide the sibling nodes
      if (this._getNodeState(node, 'siblings').visible) {
        this.hideSiblings(node);
      }
      // hide the lines
      var lines = temp.slice(1);

      this._css(lines, 'visibility', 'hidden');
      // hide the superior nodes with transition
      var parent = temp[0].querySelector('.node'),
          grandfatherVisible = this._getNodeState(parent, 'parent').visible;

      if (parent && this._isVisible(parent)) {
        parent.classList.add('slide', 'slide-down');
        this._one(parent, 'transitionend', function () {
          parent.classList.remove('slide');
          this._removeAttr(lines, 'style');
          this._addClass(temp, 'hidden');
        }, this);
      }
      // if the current node has the parent node, hide it recursively
      if (parent && grandfatherVisible) {
        this.hideParent(parent);
      }
    }
    // exposed method

  }, {
    key: 'addParent',
    value: function addParent(currentRoot, data) {
      var that = this;

      this._buildParentNode(currentRoot, data, function () {
        if (!currentRoot.querySelector(':scope > .topEdge')) {
          var topEdge = document.createElement('i');

          topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
          currentRoot.appendChild(topEdge);
        }
        that.showParent(currentRoot);
      });
    }
    // start up loading status for requesting new nodes

  }, {
    key: '_startLoading',
    value: function _startLoading(arrow, node) {
      var opts = this.options,
          chart = this.chart;

      if (typeof chart.dataset.inAjax !== 'undefined' && chart.dataset.inAjax === 'true') {
        return false;
      }

      arrow.classList.add('hidden');
      var spinner = document.createElement('i');

      spinner.setAttribute('class', 'fa fa-circle-o-notch fa-spin spinner');
      node.appendChild(spinner);
      this._addClass(Array.from(node.querySelectorAll(':scope > *:not(.spinner)')), 'hazy');
      chart.dataset.inAjax = true;

      var exportBtn = this.chartContainer.querySelector('.oc-export-btn' + (opts.chartClass !== '' ? '.' + opts.chartClass : ''));

      if (exportBtn) {
        exportBtn.disabled = true;
      }
      return true;
    }
    // terminate loading status for requesting new nodes

  }, {
    key: '_endLoading',
    value: function _endLoading(arrow, node) {
      var opts = this.options;

      arrow.classList.remove('hidden');
      node.querySelector(':scope > .spinner').remove();
      this._removeClass(Array.from(node.querySelectorAll(':scope > .hazy')), 'hazy');
      this.chart.dataset.inAjax = false;
      var exportBtn = this.chartContainer.querySelector('.oc-export-btn' + (opts.chartClass !== '' ? '.' + opts.chartClass : ''));

      if (exportBtn) {
        exportBtn.disabled = false;
      }
    }
    // define click event handler for the top edge

  }, {
    key: '_clickTopEdge',
    value: function _clickTopEdge(event) {
      event.stopPropagation();
      var that = this,
          topEdge = event.target,
          node = topEdge.parentNode,
          parentState = this._getNodeState(node, 'parent'),
          opts = this.options;

      if (parentState.exist) {
        var temp = this._closest(node, function (el) {
          return el.classList.contains('nodes');
        });
        var parent = temp.parentNode.firstChild.querySelector('.node');

        if (parent.classList.contains('slide')) {
          return;
        }
        // hide the ancestor nodes and sibling nodes of the specified node
        if (parentState.visible) {
          this.hideParent(node);
          this._one(parent, 'transitionend', function () {
            if (this._isInAction(node)) {
              this._switchVerticalArrow(topEdge);
              this._switchHorizontalArrow(node);
            }
          }, this);
        } else {
          // show the ancestors and siblings
          this.showParent(node);
        }
      } else {
        // load the new parent node of the specified node by ajax request
        var nodeId = topEdge.parentNode.id;

        // start up loading status
        if (this._startLoading(topEdge, node)) {
          // load new nodes
          this._getJSON(typeof opts.ajaxURL.parent === 'function' ? opts.ajaxURL.parent(node.dataset.source) : opts.ajaxURL.parent + nodeId).then(function (resp) {
            if (that.chart.dataset.inAjax === 'true') {
              if (Object.keys(resp).length) {
                that.addParent(node, resp);
              }
            }
          }).catch(function (err) {
            console.error('Failed to get parent node data.', err);
          }).finally(function () {
            that._endLoading(topEdge, node);
          });
        }
      }
    }
    // recursively hide the descendant nodes of the specified node

  }, {
    key: 'hideChildren',
    value: function hideChildren(node) {
      var that = this,
          temp = this._nextAll(node.parentNode.parentNode),
          lastItem = temp[temp.length - 1],
          lines = [];

      if (lastItem.querySelector('.spinner')) {
        this.chart.dataset.inAjax = false;
      }
      var descendants = Array.from(lastItem.querySelectorAll('.node')).filter(function (el) {
        return that._isVisible(el);
      }),
          isVerticalDesc = lastItem.classList.contains('verticalNodes');

      if (!isVerticalDesc) {
        descendants.forEach(function (desc) {
          Array.prototype.push.apply(lines, that._prevAll(that._closest(desc, function (el) {
            return el.classList.contains('nodes');
          }), '.lines'));
        });
        lines = [].concat(toConsumableArray(new Set(lines)));
        this._css(lines, 'visibility', 'hidden');
      }
      this._one(descendants[0], 'transitionend', function (event) {
        this._removeClass(descendants, 'slide');
        if (isVerticalDesc) {
          that._addClass(temp, 'hidden');
        } else {
          lines.forEach(function (el) {
            el.removeAttribute('style');
            el.classList.add('hidden');
            el.parentNode.lastChild.classList.add('hidden');
          });
          this._addClass(Array.from(lastItem.querySelectorAll('.verticalNodes')), 'hidden');
        }
        if (this._isInAction(node)) {
          this._switchVerticalArrow(node.querySelector('.bottomEdge'));
        }
      }, this);
      this._addClass(descendants, 'slide slide-up');
    }
    // show the children nodes of the specified node

  }, {
    key: 'showChildren',
    value: function showChildren(node) {
      var _this7 = this;

      var that = this,
          temp = this._nextAll(node.parentNode.parentNode),
          descendants = [];

      this._removeClass(temp, 'hidden');
      if (temp.some(function (el) {
        return el.classList.contains('verticalNodes');
      })) {
        temp.forEach(function (el) {
          Array.prototype.push.apply(descendants, Array.from(el.querySelectorAll('.node')).filter(function (el) {
            return that._isVisible(el);
          }));
        });
      } else {
        Array.from(temp[2].children).forEach(function (el) {
          Array.prototype.push.apply(descendants, Array.from(el.querySelector('tr').querySelectorAll('.node')).filter(function (el) {
            return that._isVisible(el);
          }));
        });
      }
      // the two following statements are used to enforce browser to repaint
      this._repaint(descendants[0]);
      this._one(descendants[0], 'transitionend', function (event) {
        _this7._removeClass(descendants, 'slide');
        if (_this7._isInAction(node)) {
          _this7._switchVerticalArrow(node.querySelector('.bottomEdge'));
        }
      }, this);
      this._addClass(descendants, 'slide');
      this._removeClass(descendants, 'slide-up');
    }
    // build the child nodes of specific node

  }, {
    key: '_buildChildNode',
    value: function _buildChildNode(appendTo, nodeData, callback) {
      var data = nodeData.children || nodeData.siblings;

      appendTo.querySelector('td').setAttribute('colSpan', data.length * 2);
      this.buildHierarchy(appendTo, { 'children': data }, 0, callback);
    }
    // exposed method

  }, {
    key: 'addChildren',
    value: function addChildren(node, data) {
      var that = this,
          opts = this.options,
          count = 0;

      this.chart.dataset.inEdit = 'addChildren';
      this._buildChildNode.call(this, this._closest(node, function (el) {
        return el.nodeName === 'TABLE';
      }), data, function () {
        if (++count === data.children.length) {
          if (!node.querySelector('.bottomEdge')) {
            var bottomEdge = document.createElement('i');

            bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
            node.appendChild(bottomEdge);
          }
          if (!node.querySelector('.symbol')) {
            var symbol = document.createElement('i');

            symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
            node.querySelector(':scope > .title').appendChild(symbol);
          }
          that.showChildren(node);
          that.chart.dataset.inEdit = '';
        }
      });
    }
    // bind click event handler for the bottom edge

  }, {
    key: '_clickBottomEdge',
    value: function _clickBottomEdge(event) {
      var _this8 = this;

      event.stopPropagation();
      var that = this,
          opts = this.options,
          bottomEdge = event.target,
          node = bottomEdge.parentNode,
          childrenState = this._getNodeState(node, 'children');

      if (childrenState.exist) {
        var temp = this._closest(node, function (el) {
          return el.nodeName === 'TR';
        }).parentNode.lastChild;

        if (Array.from(temp.querySelectorAll('.node')).some(function (node) {
          return _this8._isVisible(node) && node.classList.contains('slide');
        })) {
          return;
        }
        // hide the descendant nodes of the specified node
        if (childrenState.visible) {
          this.hideChildren(node);
        } else {
          // show the descendants
          this.showChildren(node);
        }
      } else {
        // load the new children nodes of the specified node by ajax request
        var nodeId = bottomEdge.parentNode.id;

        if (this._startLoading(bottomEdge, node)) {
          this._getJSON(typeof opts.ajaxURL.children === 'function' ? opts.ajaxURL.children(node.dataset.source) : opts.ajaxURL.children + nodeId).then(function (resp) {
            if (that.chart.dataset.inAjax === 'true') {
              if (resp.children.length) {
                that.addChildren(node, resp);
              }
            }
          }).catch(function (err) {
            console.error('Failed to get children nodes data', err);
          }).finally(function () {
            that._endLoading(bottomEdge, node);
          });
        }
      }
    }
    // subsequent processing of build sibling nodes

  }, {
    key: '_complementLine',
    value: function _complementLine(oneSibling, siblingCount, existingSibligCount) {
      var temp = oneSibling.parentNode.parentNode.children;

      temp[0].children[0].setAttribute('colspan', siblingCount * 2);
      temp[1].children[0].setAttribute('colspan', siblingCount * 2);
      for (var i = 0; i < existingSibligCount; i++) {
        var rightLine = document.createElement('td'),
            leftLine = document.createElement('td');

        rightLine.setAttribute('class', 'rightLine topLine');
        rightLine.innerHTML = '&nbsp;';
        temp[2].insertBefore(rightLine, temp[2].children[1]);
        leftLine.setAttribute('class', 'leftLine topLine');
        leftLine.innerHTML = '&nbsp;';
        temp[2].insertBefore(leftLine, temp[2].children[1]);
      }
    }
    // build the sibling nodes of specific node

  }, {
    key: '_buildSiblingNode',
    value: function _buildSiblingNode(nodeChart, nodeData, callback) {
      var _this9 = this;

      var that = this,
          newSiblingCount = nodeData.siblings ? nodeData.siblings.length : nodeData.children.length,
          existingSibligCount = nodeChart.parentNode.nodeName === 'TD' ? this._closest(nodeChart, function (el) {
        return el.nodeName === 'TR';
      }).children.length : 1,
          siblingCount = existingSibligCount + newSiblingCount,
          insertPostion = siblingCount > 1 ? Math.floor(siblingCount / 2 - 1) : 0;

      // just build the sibling nodes for the specific node
      if (nodeChart.parentNode.nodeName === 'TD') {
        var temp = this._prevAll(nodeChart.parentNode.parentNode);

        temp[0].remove();
        temp[1].remove();
        var childCount = 0;

        that._buildChildNode.call(that, that._closest(nodeChart.parentNode, function (el) {
          return el.nodeName === 'TABLE';
        }), nodeData, function () {
          if (++childCount === newSiblingCount) {
            var siblingTds = Array.from(that._closest(nodeChart.parentNode, function (el) {
              return el.nodeName === 'TABLE';
            }).lastChild.children);

            if (existingSibligCount > 1) {
              var _temp = nodeChart.parentNode.parentNode;

              Array.from(_temp.children).forEach(function (el) {
                siblingTds[0].parentNode.insertBefore(el, siblingTds[0]);
              });
              _temp.remove();
              that._complementLine(siblingTds[0], siblingCount, existingSibligCount);
              that._addClass(siblingTds, 'hidden');
              siblingTds.forEach(function (el) {
                that._addClass(el.querySelectorAll('.node'), 'slide-left');
              });
            } else {
              var _temp2 = nodeChart.parentNode.parentNode;

              siblingTds[insertPostion].parentNode.insertBefore(nodeChart.parentNode, siblingTds[insertPostion + 1]);
              _temp2.remove();
              that._complementLine(siblingTds[insertPostion], siblingCount, 1);
              that._addClass(siblingTds, 'hidden');
              that._addClass(that._getDescElements(siblingTds.slice(0, insertPostion + 1), '.node'), 'slide-right');
              that._addClass(that._getDescElements(siblingTds.slice(insertPostion + 1), '.node'), 'slide-left');
            }
            callback();
          }
        });
      } else {
        // build the sibling nodes and parent node for the specific ndoe
        var nodeCount = 0;

        that.buildHierarchy.call(that, that.chart, nodeData, 0, function () {
          if (++nodeCount === siblingCount) {
            var _temp3 = nodeChart.nextElementSibling.children[3].children[insertPostion],
                td = document.createElement('td');

            td.setAttribute('colspan', 2);
            td.appendChild(nodeChart);
            _temp3.parentNode.insertBefore(td, _temp3.nextElementSibling);
            that._complementLine(_temp3, siblingCount, 1);

            var temp2 = that._closest(nodeChart, function (el) {
              return el.classList && el.classList.contains('nodes');
            }).parentNode.children[0];

            temp2.classList.add('hidden');
            that._addClass(Array.from(temp2.querySelectorAll('.node')), 'slide-down');

            var temp3 = _this9._siblings(nodeChart.parentNode);

            that._addClass(temp3, 'hidden');
            that._addClass(that._getDescElements(temp3.slice(0, insertPostion), '.node'), 'slide-right');
            that._addClass(that._getDescElements(temp3.slice(insertPostion), '.node'), 'slide-left');
            callback();
          }
        });
      }
    }
  }, {
    key: 'addSiblings',
    value: function addSiblings(node, data) {
      var that = this;

      this.chart.dataset.inEdit = 'addSiblings';
      this._buildSiblingNode.call(this, this._closest(node, function (el) {
        return el.nodeName === 'TABLE';
      }), data, function () {
        that._closest(node, function (el) {
          return el.classList && el.classList.contains('nodes');
        }).dataset.siblingsLoaded = true;
        if (!node.querySelector('.leftEdge')) {
          var rightEdge = document.createElement('i'),
              leftEdge = document.createElement('i');

          rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
          node.appendChild(rightEdge);
          leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
          node.appendChild(leftEdge);
        }
        that.showSiblings(node);
        that.chart.dataset.inEdit = '';
      });
    }
  }, {
    key: 'removeNodes',
    value: function removeNodes(node) {
      var parent = this._closest(node, function (el) {
        return el.nodeName === 'TABLE';
      }).parentNode,
          sibs = this._siblings(parent.parentNode);

      if (parent.nodeName === 'TD') {
        if (this._getNodeState(node, 'siblings').exist) {
          sibs[2].querySelector('.topLine').nextElementSibling.remove();
          sibs[2].querySelector('.topLine').remove();
          sibs[0].children[0].setAttribute('colspan', sibs[2].children.length);
          sibs[1].children[0].setAttribute('colspan', sibs[2].children.length);
          parent.remove();
        } else {
          sibs[0].children[0].removeAttribute('colspan');
          sibs[0].querySelector('.bottomEdge').remove();
          this._siblings(sibs[0]).forEach(function (el) {
            return el.remove();
          });
        }
      } else {
        Array.from(parent.parentNode.children).forEach(function (el) {
          return el.remove();
        });
      }
    }
    // bind click event handler for the left and right edges

  }, {
    key: '_clickHorizontalEdge',
    value: function _clickHorizontalEdge(event) {
      var _this10 = this;

      event.stopPropagation();
      var that = this,
          opts = this.options,
          hEdge = event.target,
          node = hEdge.parentNode,
          siblingsState = this._getNodeState(node, 'siblings');

      if (siblingsState.exist) {
        var temp = this._closest(node, function (el) {
          return el.nodeName === 'TABLE';
        }).parentNode,
            siblings = this._siblings(temp);

        if (siblings.some(function (el) {
          var node = el.querySelector('.node');

          return _this10._isVisible(node) && node.classList.contains('slide');
        })) {
          return;
        }
        if (opts.toggleSiblingsResp) {
          var prevSib = this._closest(node, function (el) {
            return el.nodeName === 'TABLE';
          }).parentNode.previousElementSibling,
              nextSib = this._closest(node, function (el) {
            return el.nodeName === 'TABLE';
          }).parentNode.nextElementSibling;

          if (hEdge.classList.contains('leftEdge')) {
            if (prevSib && prevSib.classList.contains('hidden')) {
              this.showSiblings(node, 'left');
            } else {
              this.hideSiblings(node, 'left');
            }
          } else {
            if (nextSib && nextSib.classList.contains('hidden')) {
              this.showSiblings(node, 'right');
            } else {
              this.hideSiblings(node, 'right');
            }
          }
        } else {
          if (siblingsState.visible) {
            this.hideSiblings(node);
          } else {
            this.showSiblings(node);
          }
        }
      } else {
        // load the new sibling nodes of the specified node by ajax request
        var nodeId = hEdge.parentNode.id,
            url = this._getNodeState(node, 'parent').exist ? typeof opts.ajaxURL.siblings === 'function' ? opts.ajaxURL.siblings(JSON.parse(node.dataset.source)) : opts.ajaxURL.siblings + nodeId : typeof opts.ajaxURL.families === 'function' ? opts.ajaxURL.families(JSON.parse(node.dataset.source)) : opts.ajaxURL.families + nodeId;

        if (this._startLoading(hEdge, node)) {
          this._getJSON(url).then(function (resp) {
            if (that.chart.dataset.inAjax === 'true') {
              if (resp.siblings || resp.children) {
                that.addSiblings(node, resp);
              }
            }
          }).catch(function (err) {
            console.error('Failed to get sibling nodes data', err);
          }).finally(function () {
            that._endLoading(hEdge, node);
          });
        }
      }
    }
    // event handler for toggle buttons in Hybrid(horizontal + vertical) OrgChart

  }, {
    key: '_clickToggleButton',
    value: function _clickToggleButton(event) {
      var that = this,
          toggleBtn = event.target,
          descWrapper = toggleBtn.parentNode.nextElementSibling,
          descendants = Array.from(descWrapper.querySelectorAll('.node')),
          children = Array.from(descWrapper.children).map(function (item) {
        return item.querySelector('.node');
      });

      if (children.some(function (item) {
        return item.classList.contains('slide');
      })) {
        return;
      }
      toggleBtn.classList.toggle('fa-plus-square');
      toggleBtn.classList.toggle('fa-minus-square');
      if (descendants[0].classList.contains('slide-up')) {
        descWrapper.classList.remove('hidden');
        this._repaint(children[0]);
        this._addClass(children, 'slide');
        this._removeClass(children, 'slide-up');
        this._one(children[0], 'transitionend', function () {
          that._removeClass(children, 'slide');
        });
      } else {
        this._addClass(descendants, 'slide slide-up');
        this._one(descendants[0], 'transitionend', function () {
          that._removeClass(descendants, 'slide');
          descendants.forEach(function (desc) {
            var ul = that._closest(desc, function (el) {
              return el.nodeName === 'UL';
            });

            ul.classList.add('hidden');
          });
        });

        descendants.forEach(function (desc) {
          var subTBs = Array.from(desc.querySelectorAll('.toggleBtn'));

          that._removeClass(subTBs, 'fa-minus-square');
          that._addClass(subTBs, 'fa-plus-square');
        });
      }
    }
  }, {
    key: '_dispatchClickEvent',
    value: function _dispatchClickEvent(event) {
      var classList = event.target.classList;

      if (classList.contains('topEdge')) {
        this._clickTopEdge(event);
      } else if (classList.contains('rightEdge') || classList.contains('leftEdge')) {
        this._clickHorizontalEdge(event);
      } else if (classList.contains('bottomEdge')) {
        this._clickBottomEdge(event);
      } else if (classList.contains('toggleBtn')) {
        this._clickToggleButton(event);
      } else {
        this._clickNode(event);
      }
    }
  }, {
    key: '_onDragStart',
    value: function _onDragStart(event) {
      var nodeDiv = event.target,
          opts = this.options,
          isFirefox = /firefox/.test(window.navigator.userAgent.toLowerCase());

      if (isFirefox) {
        event.dataTransfer.setData('text/html', 'hack for firefox');
      }
      // if users enable zoom or direction options
      if (this.chart.style.transform) {
        var ghostNode = void 0,
            nodeCover = void 0;

        if (!document.querySelector('.ghost-node')) {
          ghostNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          ghostNode.classList.add('ghost-node');
          nodeCover = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          ghostNode.appendChild(nodeCover);
          this.chart.appendChild(ghostNode);
        } else {
          ghostNode = this.chart.querySelector(':scope > .ghost-node');
          nodeCover = ghostNode.children[0];
        }
        var transValues = this.chart.style.transform.split(','),
            scale = Math.abs(window.parseFloat(opts.direction === 't2b' || opts.direction === 'b2t' ? transValues[0].slice(transValues[0].indexOf('(') + 1) : transValues[1]));

        ghostNode.setAttribute('width', nodeDiv.offsetWidth);
        ghostNode.setAttribute('height', nodeDiv.offsetHeight);
        nodeCover.setAttribute('x', 5 * scale);
        nodeCover.setAttribute('y', 5 * scale);
        nodeCover.setAttribute('width', 120 * scale);
        nodeCover.setAttribute('height', 40 * scale);
        nodeCover.setAttribute('rx', 4 * scale);
        nodeCover.setAttribute('ry', 4 * scale);
        nodeCover.setAttribute('stroke-width', 1 * scale);
        var xOffset = event.offsetX * scale,
            yOffset = event.offsetY * scale;

        if (opts.direction === 'l2r') {
          xOffset = event.offsetY * scale;
          yOffset = event.offsetX * scale;
        } else if (opts.direction === 'r2l') {
          xOffset = nodeDiv.offsetWidth - event.offsetY * scale;
          yOffset = event.offsetX * scale;
        } else if (opts.direction === 'b2t') {
          xOffset = nodeDiv.offsetWidth - event.offsetX * scale;
          yOffset = nodeDiv.offsetHeight - event.offsetY * scale;
        }
        if (isFirefox) {
          // hack for old version of Firefox(< 48.0)
          var ghostNodeWrapper = document.createElement('img');

          ghostNodeWrapper.src = 'data:image/svg+xml;utf8,' + new XMLSerializer().serializeToString(ghostNode);
          event.dataTransfer.setDragImage(ghostNodeWrapper, xOffset, yOffset);
          nodeCover.setAttribute('fill', 'rgb(255, 255, 255)');
          nodeCover.setAttribute('stroke', 'rgb(191, 0, 0)');
        } else {
          event.dataTransfer.setDragImage(ghostNode, xOffset, yOffset);
        }
      }
      var dragged = event.target;
      var closestDraggedNodes = this._closest(dragged, function (el) {
        return el.classList && el.classList.contains('nodes');
      });
      var dragZone = null;
      closestDraggedNodes !== null ? dragZone = this._closest(dragged, function (el) {
        return el.classList && el.classList.contains('nodes');
      }).parentNode.children[0].querySelector('.node') : null;
      var dragHier = Array.from(this._closest(dragged, function (el) {
        return el.nodeName === 'TABLE';
      }).querySelectorAll('.node'));

      this.dragged = dragged;
      Array.from(this.chart.querySelectorAll('.node')).forEach(function (node) {
        if (!dragHier.includes(node)) {
          if (opts.dropCriteria) {
            if (opts.dropCriteria(dragged, dragZone, node)) {
              node.classList.add('allowedDrop');
            }
          } else {
            node.classList.add('allowedDrop');
          }
        }
      });
    }
  }, {
    key: '_onDragOver',
    value: function _onDragOver(event) {
      event.preventDefault();
      var dropZone = event.currentTarget;

      if (!dropZone.classList.contains('allowedDrop')) {
        event.dataTransfer.dropEffect = 'none';
      }
    }
  }, {
    key: '_onDragEnd',
    value: function _onDragEnd(event) {
      Array.from(this.chart.querySelectorAll('.allowedDrop')).forEach(function (el) {
        el.classList.remove('allowedDrop');
      });
    }
  }, {
    key: '_onDrop',
    value: function _onDrop(event) {
      var dropZone = event.currentTarget,
          chart = this.chart,
          dragged = this.dragged,
          dragZone = this._closest(dragged, function (el) {
        return el.classList && el.classList.contains('nodes');
      }).parentNode.children[0].children[0];

      this._removeClass(Array.from(chart.querySelectorAll('.allowedDrop')), 'allowedDrop');
      // firstly, deal with the hierarchy of drop zone
      if (!dropZone.parentNode.parentNode.nextElementSibling) {
        // if the drop zone is a leaf node
        var bottomEdge = document.createElement('i');

        bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
        dropZone.appendChild(bottomEdge);
        dropZone.parentNode.setAttribute('colspan', 2);
        var table = this._closest(dropZone, function (el) {
          return el.nodeName === 'TABLE';
        }),
            upperTr = document.createElement('tr'),
            lowerTr = document.createElement('tr'),
            nodeTr = document.createElement('tr');

        upperTr.setAttribute('class', 'lines');
        upperTr.innerHTML = '<td colspan="2"><div class="downLine"></div></td>';
        table.appendChild(upperTr);
        lowerTr.setAttribute('class', 'lines');
        lowerTr.innerHTML = '<td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td>';
        table.appendChild(lowerTr);
        nodeTr.setAttribute('class', 'nodes');
        table.appendChild(nodeTr);
        Array.from(dragged.querySelectorAll('.horizontalEdge')).forEach(function (hEdge) {
          dragged.removeChild(hEdge);
        });
        var draggedTd = this._closest(dragged, function (el) {
          return el.nodeName === 'TABLE';
        }).parentNode;

        nodeTr.appendChild(draggedTd);
      } else {
        var dropColspan = window.parseInt(dropZone.parentNode.colSpan) + 2;

        dropZone.parentNode.setAttribute('colspan', dropColspan);
        dropZone.parentNode.parentNode.nextElementSibling.children[0].setAttribute('colspan', dropColspan);
        if (!dragged.querySelector('.horizontalEdge')) {
          var rightEdge = document.createElement('i'),
              leftEdge = document.createElement('i');

          rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
          dragged.appendChild(rightEdge);
          leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
          dragged.appendChild(leftEdge);
        }
        var temp = dropZone.parentNode.parentNode.nextElementSibling.nextElementSibling,
            leftline = document.createElement('td'),
            rightline = document.createElement('td');

        leftline.setAttribute('class', 'leftLine topLine');
        leftline.innerHTML = '&nbsp;';
        temp.insertBefore(leftline, temp.children[1]);
        rightline.setAttribute('class', 'rightLine topLine');
        rightline.innerHTML = '&nbsp;';
        temp.insertBefore(rightline, temp.children[2]);
        temp.nextElementSibling.appendChild(this._closest(dragged, function (el) {
          return el.nodeName === 'TABLE';
        }).parentNode);

        var dropSibs = this._siblings(this._closest(dragged, function (el) {
          return el.nodeName === 'TABLE';
        }).parentNode).map(function (el) {
          return el.querySelector('.node');
        });

        if (dropSibs.length === 1) {
          var _rightEdge = document.createElement('i'),
              _leftEdge = document.createElement('i');

          _rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
          dropSibs[0].appendChild(_rightEdge);
          _leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
          dropSibs[0].appendChild(_leftEdge);
        }
      }
      // secondly, deal with the hierarchy of dragged node
      var dragColSpan = window.parseInt(dragZone.colSpan);

      if (dragColSpan > 2) {
        dragZone.setAttribute('colspan', dragColSpan - 2);
        dragZone.parentNode.nextElementSibling.children[0].setAttribute('colspan', dragColSpan - 2);
        var _temp4 = dragZone.parentNode.nextElementSibling.nextElementSibling;

        _temp4.children[1].remove();
        _temp4.children[1].remove();

        var dragSibs = Array.from(dragZone.parentNode.parentNode.children[3].children).map(function (td) {
          return td.querySelector('.node');
        });

        if (dragSibs.length === 1) {
          dragSibs[0].querySelector('.leftEdge').remove();
          dragSibs[0].querySelector('.rightEdge').remove();
        }
      } else {
        dragZone.removeAttribute('colspan');
        dragZone.querySelector('.node').removeChild(dragZone.querySelector('.bottomEdge'));
        Array.from(dragZone.parentNode.parentNode.children).slice(1).forEach(function (tr) {
          return tr.remove();
        });
      }
      var customE = new CustomEvent('nodedropped.orgchart', { 'detail': {
          'draggedNode': dragged,
          'dragZone': dragZone.children[0],
          'dropZone': dropZone
        } });

      chart.dispatchEvent(customE);
    }
    // create node

  }, {
    key: '_createNode',
    value: function _createNode(nodeData, level) {
      var that = this,
          opts = this.options;

      return new Promise(function (resolve, reject) {
        if (nodeData.children) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = nodeData.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var child = _step3.value;

              child.parentId = nodeData.id;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }

        // construct the content of node
        var nodeDiv = document.createElement('div');

        delete nodeData.children;
        nodeDiv.dataset.source = JSON.stringify(nodeData);
        if (nodeData[opts.nodeId]) {
          nodeDiv.id = nodeData[opts.nodeId];
        }
        var inEdit = that.chart.dataset.inEdit,
            isHidden = void 0;

        if (inEdit) {
          isHidden = inEdit === 'addChildren' ? ' slide-up' : '';
        } else {
          isHidden = level >= opts.depth ? ' slide-up' : '';
        }
        nodeDiv.setAttribute('class', 'node ' + (nodeData.className || '') + isHidden);
        if (opts.draggable) {
          nodeDiv.setAttribute('draggable', true);
        }
        if (nodeData.parentId) {
          nodeDiv.setAttribute('data-parent', nodeData.parentId);
        }
        nodeDiv.innerHTML = '\n        <div class="title">' + nodeData[opts.nodeTitle] + '</div>\n        ' + (opts.nodeContent ? '<div class="content">' + nodeData[opts.nodeContent] + '</div>' : '') + '\n      ';
        // append 4 direction arrows or expand/collapse buttons
        var flags = nodeData.relationship || '';

        if (opts.verticalDepth && level + 2 > opts.verticalDepth) {
          if (level + 1 >= opts.verticalDepth && Number(flags.substr(2, 1))) {
            var toggleBtn = document.createElement('i'),
                icon = level + 1 >= opts.depth ? 'plus' : 'minus';

            toggleBtn.setAttribute('class', 'toggleBtn fa fa-' + icon + '-square');
            nodeDiv.appendChild(toggleBtn);
          }
        } else {
          if (Number(flags.substr(0, 1))) {
            var topEdge = document.createElement('i');

            topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
            nodeDiv.appendChild(topEdge);
          }
          if (Number(flags.substr(1, 1))) {
            var rightEdge = document.createElement('i'),
                leftEdge = document.createElement('i');

            rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
            nodeDiv.appendChild(rightEdge);
            leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
            nodeDiv.appendChild(leftEdge);
          }
          if (Number(flags.substr(2, 1))) {
            var bottomEdge = document.createElement('i'),
                symbol = document.createElement('i'),
                title = nodeDiv.querySelector(':scope > .title');

            bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
            nodeDiv.appendChild(bottomEdge);
            symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
            title.insertBefore(symbol, title.children[0]);
          }
        }
        if (opts.toggleCollapse) {
          nodeDiv.addEventListener('mouseenter', that._hoverNode.bind(that));
          nodeDiv.addEventListener('mouseleave', that._hoverNode.bind(that));
          nodeDiv.addEventListener('click', that._dispatchClickEvent.bind(that));
        }
        if (opts.draggable) {
          nodeDiv.addEventListener('dragstart', that._onDragStart.bind(that));
          nodeDiv.addEventListener('dragover', that._onDragOver.bind(that));
          nodeDiv.addEventListener('dragend', that._onDragEnd.bind(that));
          nodeDiv.addEventListener('drop', that._onDrop.bind(that));
        }
        // allow user to append dom modification after finishing node create of orgchart
        if (opts.createNode) {
          opts.createNode(nodeDiv, nodeData);
        }

        resolve(nodeDiv);
      });
    }
  }, {
    key: 'buildHierarchy',
    value: function buildHierarchy(appendTo, nodeData, level, callback) {
      // Construct the node
      var that = this,
          opts = this.options,
          nodeWrapper = void 0,
          childNodes = nodeData.children,
          isVerticalNode = opts.verticalDepth && level + 1 >= opts.verticalDepth;

      if (Object.keys(nodeData).length > 1) {
        // if nodeData has nested structure
        nodeWrapper = isVerticalNode ? appendTo : document.createElement('table');
        if (!isVerticalNode) {
          appendTo.appendChild(nodeWrapper);
        }
        this._createNode(nodeData, level).then(function (nodeDiv) {
          if (isVerticalNode) {
            nodeWrapper.insertBefore(nodeDiv, nodeWrapper.firstChild);
          } else {
            var tr = document.createElement('tr');

            tr.innerHTML = '\n            <td ' + (childNodes ? 'colspan="' + childNodes.length * 2 + '"' : '') + '>\n            </td>\n          ';
            tr.children[0].appendChild(nodeDiv);
            nodeWrapper.insertBefore(tr, nodeWrapper.children[0] ? nodeWrapper.children[0] : null);
          }
          if (callback) {
            callback();
          }
        }).catch(function (err) {
          console.error('Failed to creat node', err);
        });
      }
      // Construct the inferior nodes and connectiong lines
      if (childNodes && childNodes.length !== 0) {
        if (Object.keys(nodeData).length === 1) {
          // if nodeData is just an array
          nodeWrapper = appendTo;
        }
        var isHidden = void 0,
            isVerticalLayer = opts.verticalDepth && level + 2 >= opts.verticalDepth,
            inEdit = that.chart.dataset.inEdit;

        if (inEdit) {
          isHidden = inEdit === 'addSiblings' ? '' : ' hidden';
        } else {
          isHidden = level + 1 >= opts.depth ? ' hidden' : '';
        }

        // draw the line close to parent node
        if (!isVerticalLayer) {
          var tr = document.createElement('tr');

          tr.setAttribute('class', 'lines' + isHidden);
          tr.innerHTML = '\n          <td colspan="' + childNodes.length * 2 + '">\n            <div class="downLine"></div>\n          </td>\n        ';
          nodeWrapper.appendChild(tr);
        }
        // draw the lines close to children nodes
        var lineLayer = document.createElement('tr');

        lineLayer.setAttribute('class', 'lines' + isHidden);
        lineLayer.innerHTML = '\n        <td class="rightLine">&nbsp;</td>\n        ' + childNodes.slice(1).map(function () {
          return '\n          <td class="leftLine topLine">&nbsp;</td>\n          <td class="rightLine topLine">&nbsp;</td>\n          ';
        }).join('') + '\n        <td class="leftLine">&nbsp;</td>\n      ';
        var nodeLayer = void 0;

        if (isVerticalLayer) {
          nodeLayer = document.createElement('ul');
          if (isHidden) {
            nodeLayer.classList.add(isHidden.trim());
          }
          if (level + 2 === opts.verticalDepth) {
            var _tr = document.createElement('tr');

            _tr.setAttribute('class', 'verticalNodes' + isHidden);
            _tr.innerHTML = '<td></td>';
            _tr.firstChild.appendChild(nodeLayer);
            nodeWrapper.appendChild(_tr);
          } else {
            nodeWrapper.appendChild(nodeLayer);
          }
        } else {
          nodeLayer = document.createElement('tr');
          nodeLayer.setAttribute('class', 'nodes' + isHidden);
          nodeWrapper.appendChild(lineLayer);
          nodeWrapper.appendChild(nodeLayer);
        }
        // recurse through children nodes
        childNodes.forEach(function (child) {
          var nodeCell = void 0;

          if (isVerticalLayer) {
            nodeCell = document.createElement('li');
          } else {
            nodeCell = document.createElement('td');
            nodeCell.setAttribute('colspan', 2);
          }
          nodeLayer.appendChild(nodeCell);
          that.buildHierarchy(nodeCell, child, level + 1, callback);
        });
      }
    }
  }, {
    key: '_clickChart',
    value: function _clickChart(event) {
      var closestNode = this._closest(event.target, function (el) {
        return el.classList && el.classList.contains('node');
      });

      if (!closestNode && this.chart.querySelector('.node.focused')) {
        this.chart.querySelector('.node.focused').classList.remove('focused');
      }
    }
  }, {
    key: '_clickExportButton',
    value: function _clickExportButton() {
      var opts = this.options,
          chartContainer = this.chartContainer,
          mask = chartContainer.querySelector(':scope > .mask'),
          sourceChart = chartContainer.querySelector('.orgchart:not(.hidden)'),
          flag = opts.direction === 'l2r' || opts.direction === 'r2l';

      if (!mask) {
        mask = document.createElement('div');
        mask.setAttribute('class', 'mask');
        mask.innerHTML = '<i class="fa fa-circle-o-notch fa-spin spinner"></i>';
        chartContainer.appendChild(mask);
      } else {
        mask.classList.remove('hidden');
      }
      chartContainer.classList.add('canvasContainer');
      window.html2canvas(sourceChart, {
        'width': flag ? sourceChart.clientHeight : sourceChart.clientWidth,
        'height': flag ? sourceChart.clientWidth : sourceChart.clientHeight,
        'onclone': function onclone(cloneDoc) {
          var canvasContainer = cloneDoc.querySelector('.canvasContainer');

          canvasContainer.style.overflow = 'visible';
          canvasContainer.querySelector('.orgchart:not(.hidden)').transform = '';
        }
      }).then(function (canvas) {
        var downloadBtn = chartContainer.querySelector('.oc-download-btn');

        chartContainer.querySelector('.mask').classList.add('hidden');
        downloadBtn.setAttribute('href', canvas.toDataURL());
        downloadBtn.click();
      }).catch(function (err) {
        console.error('Failed to export the curent orgchart!', err);
      }).finally(function () {
        chartContainer.classList.remove('canvasContainer');
      });
    }
  }, {
    key: '_loopChart',
    value: function _loopChart(chart) {
      var _this11 = this;

      var subObj = { 'id': chart.querySelector('.node').id };

      if (chart.children[3]) {
        Array.from(chart.children[3].children).forEach(function (el) {
          if (!subObj.children) {
            subObj.children = [];
          }
          subObj.children.push(_this11._loopChart(el.firstChild));
        });
      }
      return subObj;
    }
  }, {
    key: '_loopChartDataset',
    value: function _loopChartDataset(chart) {
      var _this12 = this;

      var _subObj = JSON.parse(chart.querySelector('.node').dataset.source);
      if (chart.children[3]) {
        Array.from(chart.children[3].children).forEach(function (el) {
          if (!_subObj.children) {
            _subObj.children = [];
          }
          _subObj.children.push(_this12._loopChartDataset(el.firstChild));
        });
      }
      return _subObj;
    }
  }, {
    key: 'getChartJSON',
    value: function getChartJSON() {
      if (!this.chart.querySelector('.node').id) {
        return 'Error: Nodes of orghcart to be exported must have id attribute!';
      }
      return this._loopChartDataset(this.chart.querySelector('table'));
    }
  }, {
    key: 'getHierarchy',
    value: function getHierarchy() {
      if (!this.chart.querySelector('.node').id) {
        return 'Error: Nodes of orghcart to be exported must have id attribute!';
      }
      return this._loopChart(this.chart.querySelector('table'));
    }
  }, {
    key: '_onPanStart',
    value: function _onPanStart(event) {
      var chart = event.currentTarget;

      if (this._closest(event.target, function (el) {
        return el.classList && el.classList.contains('node');
      }) || event.touches && event.touches.length > 1) {
        chart.dataset.panning = false;
        return;
      }
      chart.style.cursor = 'move';
      chart.dataset.panning = true;

      var lastX = 0,
          lastY = 0,
          lastTf = window.getComputedStyle(chart).transform;

      if (lastTf !== 'none') {
        var temp = lastTf.split(',');

        if (!lastTf.includes('3d')) {
          lastX = Number.parseInt(temp[4], 10);
          lastY = Number.parseInt(temp[5], 10);
        } else {
          lastX = Number.parseInt(temp[12], 10);
          lastY = Number.parseInt(temp[13], 10);
        }
      }
      var startX = 0,
          startY = 0;

      if (!event.targetTouches) {
        // pan on desktop
        startX = event.pageX - lastX;
        startY = event.pageY - lastY;
      } else if (event.targetTouches.length === 1) {
        // pan on mobile device
        startX = event.targetTouches[0].pageX - lastX;
        startY = event.targetTouches[0].pageY - lastY;
      } else if (event.targetTouches.length > 1) {
        return;
      }
      chart.dataset.panStart = JSON.stringify({ 'startX': startX, 'startY': startY });
      chart.addEventListener('mousemove', this._onPanning.bind(this));
      chart.addEventListener('touchmove', this._onPanning.bind(this));
    }
  }, {
    key: '_onPanning',
    value: function _onPanning(event) {
      var chart = event.currentTarget;

      if (chart.dataset.panning === 'false') {
        return;
      }
      var newX = 0,
          newY = 0,
          panStart = JSON.parse(chart.dataset.panStart),
          startX = panStart.startX,
          startY = panStart.startY;

      if (!event.targetTouches) {
        // pand on desktop
        newX = event.pageX - startX;
        newY = event.pageY - startY;
      } else if (event.targetTouches.length === 1) {
        // pan on mobile device
        newX = event.targetTouches[0].pageX - startX;
        newY = event.targetTouches[0].pageY - startY;
      } else if (event.targetTouches.length > 1) {
        return;
      }
      var lastTf = window.getComputedStyle(chart).transform;

      if (lastTf === 'none') {
        if (!lastTf.includes('3d')) {
          chart.style.transform = 'matrix(1, 0, 0, 1, ' + newX + ', ' + newY + ')';
        } else {
          chart.style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + newX + ', ' + newY + ', 0, 1)';
        }
      } else {
        var matrix = lastTf.split(',');

        if (!lastTf.includes('3d')) {
          matrix[4] = newX;
          matrix[5] = newY + ')';
        } else {
          matrix[12] = newX;
          matrix[13] = newY;
        }
        chart.style.transform = matrix.join(',');
      }
    }
  }, {
    key: '_onPanEnd',
    value: function _onPanEnd(event) {
      var chart = this.chart;

      if (chart.dataset.panning === 'true') {
        chart.dataset.panning = false;
        chart.style.cursor = 'default';
        document.body.removeEventListener('mousemove', this._onPanning);
        document.body.removeEventListener('touchmove', this._onPanning);
      }
    }
  }, {
    key: '_setChartScale',
    value: function _setChartScale(chart, newScale) {
      var lastTf = window.getComputedStyle(chart).transform;

      if (lastTf === 'none') {
        chart.style.transform = 'scale(' + newScale + ',' + newScale + ')';
      } else {
        var matrix = lastTf.split(',');

        if (!lastTf.includes('3d')) {
          matrix[0] = 'matrix(' + newScale;
          matrix[3] = newScale;
          chart.style.transform = lastTf + ' scale(' + newScale + ',' + newScale + ')';
        } else {
          chart.style.transform = lastTf + ' scale3d(' + newScale + ',' + newScale + ', 1)';
        }
      }
      chart.dataset.scale = newScale;
    }
  }, {
    key: '_onWheeling',
    value: function _onWheeling(event) {
      event.preventDefault();

      var newScale = event.deltaY > 0 ? 0.8 : 1.2;

      this._setChartScale(this.chart, newScale);
    }
  }, {
    key: '_getPinchDist',
    value: function _getPinchDist(event) {
      return Math.sqrt((event.touches[0].clientX - event.touches[1].clientX) * (event.touches[0].clientX - event.touches[1].clientX) + (event.touches[0].clientY - event.touches[1].clientY) * (event.touches[0].clientY - event.touches[1].clientY));
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(event) {
      var chart = this.chart;

      if (event.touches && event.touches.length === 2) {
        var dist = this._getPinchDist(event);

        chart.dataset.pinching = true;
        chart.dataset.pinchDistStart = dist;
      }
    }
  }, {
    key: '_onTouchMove',
    value: function _onTouchMove(event) {
      var chart = this.chart;

      if (chart.dataset.pinching) {
        var dist = this._getPinchDist(event);

        chart.dataset.pinchDistEnd = dist;
      }
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(event) {
      var chart = this.chart;

      if (chart.dataset.pinching) {
        chart.dataset.pinching = false;
        var diff = chart.dataset.pinchDistEnd - chart.dataset.pinchDistStart;

        if (diff > 0) {
          this._setChartScale(chart, 1);
        } else if (diff < 0) {
          this._setChartScale(chart, -1);
        }
      }
    }
  }, {
    key: 'name',
    get: function get$$1() {
      return this._name;
    }
  }]);
  return OrgChart;
}();

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

var defineProperty$1 = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty$1) {
    defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;
var allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Built-in value references. */
var Buffer$1 = moduleExports$1 ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
var objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag$1 = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$2 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
  return defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

var mergeOptions = function mergeOptions(obj, src) {
  return merge(obj, src);
};

var VoBasic = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vo-basic", attrs: { "id": "chart-container" } });
  }, staticRenderFns: [],
  name: 'orgchart',
  props: {
    data: { type: Object, default: function _default() {
        return {};
      }
    },
    pan: { type: Boolean, default: false },
    zoom: { type: Boolean, default: false },
    direction: { type: String, default: 't2b' },
    verticalDepth: { type: Number },
    toggleSiblingsResp: { type: Boolean, default: false },
    ajaxURL: { type: Object },
    depth: { type: Number, default: 999 },
    nodeTitle: { type: String, default: 'name' },
    parentNodeSymbol: { type: String, default: '' },
    nodeContent: { type: String },
    nodeId: { type: String, default: 'id' },
    createNode: { type: Function },
    exportButton: { type: Boolean, default: false },
    exportButtonName: { type: String, default: 'Export' },
    exportFilename: { type: String },
    chartClass: { type: String, default: '' },
    draggable: { type: Boolean, default: false },
    dropCriteria: { type: Function },
    toggleCollapse: { type: Boolean, default: true }
  },
  data: function data() {
    return {
      newData: null,
      orgchart: null,
      defaultOptions: {
        'chartContainer': '#chart-container'
      }
    };
  },
  mounted: function mounted() {
    this.newData === null ? this.initOrgChart() : null;
  },

  methods: {
    initOrgChart: function initOrgChart() {
      var opts = mergeOptions(this.defaultOptions, this.$props);
      this.orgchart = new OrgChart$1(opts);
    }
  },
  watch: {
    data: function data(newVal) {
      var _this = this;

      this.newData = newVal;
      var promise = new Promise(function (resolve) {
        if (newVal) {
          resolve();
        }
      });
      promise.then(function () {
        var opts = mergeOptions(_this.defaultOptions, _this.$props);
        _this.orgchart = new OrgChart$1(opts);
      });
    }
  }
};

var closest = function closest(el, fn) {
  return el && (fn(el) && el !== document.querySelector('.orgchart') ? el : closest(el.parentNode, fn));
};





var bindEventHandler = function bindEventHandler(selector, type, fn, parentSelector) {
  if (parentSelector) {
    document.querySelector(parentSelector).addEventListener(type, function (event) {
      if (event.target.classList && event.target.classList.contains(selector.slice(1)) || closest(event.target, function (el) {
        return el.classList && el.classList.contains(selector.slice(1));
      })) {
        fn(event);
      }
    });
  } else {
    document.querySelectorAll(selector).forEach(function (element) {
      element.addEventListener(type, fn);
    });
  }
};

var clickNode = function clickNode(event) {
  var sNode = closest(event.target, function (el) {
    return el.classList && el.classList.contains('node');
  });
  var sNodeInput = document.getElementById('selected-node');

  sNodeInput.value = sNode.querySelector('.title').textContent;
  sNodeInput.dataset.node = sNode.id;
};

var clickChart = function clickChart(event) {
  if (!closest(event.target, function (el) {
    return el.classList && el.classList.contains('node');
  })) {
    document.getElementById('selected-node').textContent = '';
  }
};











var getId = function getId() {
  return new Date().getTime() * 1000 + Math.floor(Math.random() * 1001);
};

var VoEdit = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vo-edit", attrs: { "id": "chart-container" } });
  }, staticRenderFns: [],
  name: 'VoEdit',
  props: {
    data: { type: Object },
    pan: { type: Boolean, default: false },
    zoom: { type: Boolean, default: false },
    direction: { type: String, default: 't2b' },
    verticalDepth: { type: Number },
    toggleSiblingsResp: { type: Boolean, default: false },
    ajaxURL: { type: Object },
    depth: { type: Number, default: 999 },
    nodeTitle: { type: String, default: 'name' },
    parentNodeSymbol: { type: String, default: '' },
    nodeContent: { type: String },
    nodeId: { type: String, default: 'id' },
    createNode: { type: Function },
    exportButton: { type: Boolean, default: false },
    exportButtonName: { type: String, default: 'Export' },
    exportFilename: { type: String },
    chartClass: { type: String, default: '' },
    draggable: { type: Boolean, default: false },
    dropCriteria: { type: Function },
    toggleCollapse: { type: Boolean, default: true }
  },
  data: function data() {
    return {
      newData: null,
      orgchart: null,
      defaultOptions: {
        chartContainer: '#chart-container',
        createNode: function createNode(node, data) {
          node.id = getId();
        }
      }
    };
  },
  mounted: function mounted() {
    this.newData === null ? this.initOrgChart() : null;
    this.$nextTick(function () {
      bindEventHandler('.node', 'click', clickNode, '#chart-container');
      bindEventHandler('.orgchart', 'click', clickChart, '#chart-container');
    });
  },

  methods: {
    initOrgChart: function initOrgChart() {
      var opts = mergeOptions(this.defaultOptions, this.$props);
      this.orgchart = new OrgChart$1(opts);
    }
  },
  watch: {
    data: function data(newVal) {
      var _this = this;

      this.newData = newVal;
      var promise = new Promise(function (resolve) {
        if (newVal) {
          resolve();
        }
      });
      promise.then(function () {
        var opts = mergeOptions(_this.defaultOptions, _this.$props);
        _this.orgchart = new OrgChart$1(opts);
      });
    }
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('vo-basic', VoBasic);
  window.Vue.component('vo-edit', VoEdit);
}

export { VoBasic, VoEdit };
