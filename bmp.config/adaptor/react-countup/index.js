'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var PropTypes = require('prop-types')
var React = require('react')
var warning = require('warning')
var CountUp$1 = require('countup.js')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var PropTypes__default = /*#__PURE__*/ _interopDefaultLegacy(PropTypes)
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React)
var warning__default = /*#__PURE__*/ _interopDefaultLegacy(warning)
var CountUp__default = /*#__PURE__*/ _interopDefaultLegacy(CountUp$1)

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    }

    keys.push.apply(keys, symbols)
  }

  return keys
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
      })
    }
  }

  return target
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }

  return obj
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true,
    },
  })
  if (superClass) _setPrototypeOf(subClass, superClass)
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }

  return _setPrototypeOf(o, p)
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}))
    return true
  } catch (e) {
    return false
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  }

  return self
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === 'object' || typeof call === 'function')) {
    return call
  }

  return _assertThisInitialized(self)
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct()

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor

      result = Reflect.construct(Super, arguments, NewTarget)
    } else {
      result = Super.apply(this, arguments)
    }

    return _possibleConstructorReturn(this, result)
  }
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest()
  )
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) || arr['@@iterator']

  if (_i == null) return
  var _arr = []
  var _n = true
  var _d = false

  var _s, _e

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value)

      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }

  return _arr
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen)
  var n = Object.prototype.toString.call(o).slice(8, -1)
  if (n === 'Object' && o.constructor) n = o.constructor.name
  if (n === 'Map' || n === 'Set') return Array.from(o)
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen)
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]

  return arr2
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  )
}

var createCountUpInstance = function createCountUpInstance(el, props) {
  var decimal = props.decimal,
    decimals = props.decimals,
    duration = props.duration,
    easingFn = props.easingFn,
    end = props.end,
    formattingFn = props.formattingFn,
    prefix = props.prefix,
    separator = props.separator,
    start = props.start,
    suffix = props.suffix,
    useEasing = props.useEasing
  return new CountUp__default['default'](el, start, end, decimals, duration, {
    decimal: decimal,
    easingFn: easingFn,
    formattingFn: formattingFn,
    separator: separator,
    prefix: prefix,
    suffix: suffix,
    useEasing: useEasing,
    useGrouping: !!separator,
  })
}

var CountUp = /*#__PURE__*/ (function (_Component) {
  _inherits(CountUp, _Component)

  var _super = _createSuper(CountUp)

  function CountUp() {
    var _this

    _classCallCheck(this, CountUp)

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))

    _defineProperty(_assertThisInitialized(_this), 'checkProps', function (updatedProps) {
      var _this$props = _this.props,
        start = _this$props.start,
        suffix = _this$props.suffix,
        prefix = _this$props.prefix,
        redraw = _this$props.redraw,
        duration = _this$props.duration,
        separator = _this$props.separator,
        decimals = _this$props.decimals,
        decimal = _this$props.decimal,
        className = _this$props.className
      var hasPropsChanged =
        duration !== updatedProps.duration ||
        start !== updatedProps.start ||
        suffix !== updatedProps.suffix ||
        prefix !== updatedProps.prefix ||
        separator !== updatedProps.separator ||
        decimals !== updatedProps.decimals ||
        decimal !== updatedProps.decimal ||
        className !== updatedProps.className
      return hasPropsChanged || redraw
    })

    _defineProperty(_assertThisInitialized(_this), 'createInstance', function () {
      if (typeof _this.props.children === 'function') {
        // Warn when user didn't use containerRef at all
        warning__default['default'](
          _this.containerRef.current &&
            (_this.containerRef.current instanceof HTMLElement ||
              _this.containerRef.current instanceof SVGTextElement ||
              _this.containerRef.current instanceof SVGTSpanElement),
          'Couldn\'t find attached element to hook the CountUp instance into! Try to attach "containerRef" from the render prop to a an HTMLElement, eg. <span ref={containerRef} />.',
        )
      }

      return createCountUpInstance(_this.containerRef.current, _this.props)
    })

    _defineProperty(_assertThisInitialized(_this), 'pauseResume', function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
        reset = _assertThisInitialize.reset,
        start = _assertThisInitialize.restart,
        update = _assertThisInitialize.update

      var onPauseResume = _this.props.onPauseResume

      _this.instance.pauseResume()

      onPauseResume({
        reset: reset,
        start: start,
        update: update,
      })
    })

    _defineProperty(_assertThisInitialized(_this), 'reset', function () {
      var _assertThisInitialize2 = _assertThisInitialized(_this),
        pauseResume = _assertThisInitialize2.pauseResume,
        start = _assertThisInitialize2.restart,
        update = _assertThisInitialize2.update

      var onReset = _this.props.onReset

      _this.instance.reset()

      onReset({
        pauseResume: pauseResume,
        start: start,
        update: update,
      })
    })

    _defineProperty(_assertThisInitialized(_this), 'restart', function () {
      _this.reset()

      _this.start()
    })

    _defineProperty(_assertThisInitialized(_this), 'start', function () {
      var _assertThisInitialize3 = _assertThisInitialized(_this),
        pauseResume = _assertThisInitialize3.pauseResume,
        reset = _assertThisInitialize3.reset,
        start = _assertThisInitialize3.restart,
        update = _assertThisInitialize3.update

      var _this$props2 = _this.props,
        delay = _this$props2.delay,
        onEnd = _this$props2.onEnd,
        onStart = _this$props2.onStart

      var run = function run() {
        return _this.instance.start(function () {
          return onEnd({
            pauseResume: pauseResume,
            reset: reset,
            start: start,
            update: update,
          })
        })
      } // Delay start if delay prop is properly set

      if (delay > 0) {
        _this.timeoutId = setTimeout(run, delay * 1000)
      } else {
        run()
      }

      onStart({
        pauseResume: pauseResume,
        reset: reset,
        update: update,
      })
    })

    _defineProperty(_assertThisInitialized(_this), 'update', function (newEnd) {
      var _assertThisInitialize4 = _assertThisInitialized(_this),
        pauseResume = _assertThisInitialize4.pauseResume,
        reset = _assertThisInitialize4.reset,
        start = _assertThisInitialize4.restart

      var onUpdate = _this.props.onUpdate

      _this.instance.update(newEnd)

      onUpdate({
        pauseResume: pauseResume,
        reset: reset,
        start: start,
      })
    })

    _defineProperty(_assertThisInitialized(_this), 'containerRef', /*#__PURE__*/ React__default['default'].createRef())

    return _this
  }

  _createClass(CountUp, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this$props3 = this.props,
          children = _this$props3.children,
          delay = _this$props3.delay
        this.instance = this.createInstance() // Don't invoke start if component is used as a render prop

        if (typeof children === 'function' && delay !== 0) return // Otherwise just start immediately

        this.start()
      },
    },
    {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var end = this.props.end
        return this.checkProps(nextProps) || end !== nextProps.end
      },
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        // If duration, suffix, prefix, separator or start has changed
        // there's no way to update the values.
        // So we need to re-create the CountUp instance in order to
        // restart it.
        var _this$props4 = this.props,
          end = _this$props4.end,
          preserveValue = _this$props4.preserveValue

        if (this.checkProps(prevProps)) {
          this.instance.reset()
          this.instance = this.createInstance()
          this.start()
        } // Only end value has changed, so reset and and re-animate with the updated
        // end value.

        if (end !== prevProps.end) {
          if (!preserveValue) {
            this.instance.reset()
          }

          this.instance.update(end)
        }
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
        }

        this.instance.reset()
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this$props5 = this.props,
          children = _this$props5.children,
          className = _this$props5.className,
          style = _this$props5.style
        var containerRef = this.containerRef,
          pauseResume = this.pauseResume,
          reset = this.reset,
          restart = this.restart,
          update = this.update

        if (typeof children === 'function') {
          return children({
            countUpRef: containerRef,
            pauseResume: pauseResume,
            reset: reset,
            start: restart,
            update: update,
          })
        }

        return /*#__PURE__*/ React__default['default'].createElement('view', {
          className: className,
          ref: containerRef,
          style: style,
        })
      },
    },
  ])

  return CountUp
})(React.Component)

_defineProperty(CountUp, 'propTypes', {
  decimal: PropTypes__default['default'].string,
  decimals: PropTypes__default['default'].number,
  delay: PropTypes__default['default'].number,
  easingFn: PropTypes__default['default'].func,
  end: PropTypes__default['default'].number.isRequired,
  formattingFn: PropTypes__default['default'].func,
  onEnd: PropTypes__default['default'].func,
  onStart: PropTypes__default['default'].func,
  prefix: PropTypes__default['default'].string,
  redraw: PropTypes__default['default'].bool,
  separator: PropTypes__default['default'].string,
  start: PropTypes__default['default'].number,
  startOnMount: PropTypes__default['default'].bool,
  suffix: PropTypes__default['default'].string,
  style: PropTypes__default['default'].object,
  useEasing: PropTypes__default['default'].bool,
  preserveValue: PropTypes__default['default'].bool,
})

_defineProperty(CountUp, 'defaultProps', {
  decimal: '.',
  decimals: 0,
  delay: null,
  duration: null,
  easingFn: null,
  formattingFn: null,
  onEnd: function onEnd() {},
  onPauseResume: function onPauseResume() {},
  onReset: function onReset() {},
  onStart: function onStart() {},
  onUpdate: function onUpdate() {},
  prefix: '',
  redraw: false,
  separator: '',
  start: 0,
  startOnMount: true,
  suffix: '',
  style: undefined,
  useEasing: true,
  preserveValue: false,
})

// and just sets the innerHTML of the element.

var MOCK_ELEMENT = {
  innerHTML: null,
}

var useCountUp = function useCountUp(props) {
  var _props = _objectSpread2(_objectSpread2({}, CountUp.defaultProps), props)

  var start = _props.start,
    formattingFn = _props.formattingFn

  var _useState = React.useState(typeof formattingFn === 'function' ? formattingFn(start) : start),
    _useState2 = _slicedToArray(_useState, 2),
    count = _useState2[0],
    setCount = _useState2[1]

  var countUpRef = React.useRef(null)
  var timerRef = React.useRef(null)

  var createInstance = function createInstance() {
    var countUp = createCountUpInstance(MOCK_ELEMENT, _props)
    var formattingFnRef = countUp.options.formattingFn

    countUp.options.formattingFn = function () {
      var result = formattingFnRef.apply(void 0, arguments)
      setCount(result)
    }

    return countUp
  }

  var getCountUp = function getCountUp() {
    var countUp = countUpRef.current

    if (countUp !== null) {
      return countUp
    }

    var newCountUp = createInstance()
    countUpRef.current = newCountUp
    return newCountUp
  }

  var reset = function reset() {
    var onReset = _props.onReset
    getCountUp().reset()
    onReset({
      pauseResume: pauseResume,
      start: restart,
      update: update,
    })
  }

  var restart = function restart() {
    var onStart = _props.onStart,
      onEnd = _props.onEnd
    getCountUp().reset()
    getCountUp().start(function () {
      onEnd({
        pauseResume: pauseResume,
        reset: reset,
        start: restart,
        update: update,
      })
    })
    onStart({
      pauseResume: pauseResume,
      reset: reset,
      update: update,
    })
  }

  var pauseResume = function pauseResume() {
    var onPauseResume = _props.onPauseResume
    getCountUp().pauseResume()
    onPauseResume({
      reset: reset,
      start: restart,
      update: update,
    })
  }

  var update = function update(newEnd) {
    var onUpdate = _props.onUpdate
    getCountUp().update(newEnd)
    onUpdate({
      pauseResume: pauseResume,
      reset: reset,
      start: restart,
    })
  }

  React.useEffect(function () {
    var delay = _props.delay,
      onStart = _props.onStart,
      onEnd = _props.onEnd,
      startOnMount = _props.startOnMount

    if (startOnMount) {
      timerRef.current = setTimeout(function () {
        onStart({
          pauseResume: pauseResume,
          reset: reset,
          update: update,
        })
        getCountUp().start(function () {
          clearTimeout(timerRef.current)
          onEnd({
            pauseResume: pauseResume,
            reset: reset,
            start: restart,
            update: update,
          })
        })
      }, delay * 1000)
    }

    return function () {
      clearTimeout(timerRef.current)
      reset()
    }
  }, [])
  return {
    countUp: count,
    start: restart,
    pauseResume: pauseResume,
    reset: reset,
    update: update,
  }
}

exports.default = CountUp
exports.useCountUp = useCountUp
