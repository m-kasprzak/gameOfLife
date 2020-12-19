"use strict";

var _crocks = require("crocks");

var _List = _interopRequireDefault(require("crocks/List"));

var _Maybe = _interopRequireDefault(require("crocks/Maybe"));

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { identity } from 'crocks/combinators'
var generateNumber = _crocks.Reader.ask(function (max) {
  return Math.floor(Math.random() * Math.floor(max));
});

var initializeState = function initializeState(rows, cols) {
  return (0, _List["default"])(new Array(rows).fill(2).map(function () {
    return new Array(cols).fill(2).map(generateNumber.runWith);
  }));
};

var initialState = initializeState(10, 10);

var idGenerator = function idGenerator() {
  var startValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function () {
    return startValue++;
  };
};

var sumAll = (0, _ramda.curry)((0, _ramda.nAry)(8, (0, _ramda.unapply)(_ramda.sum)));

var getCellState = function getCellState(n, c) {
  var value = (0, _ramda.cond)([[function (n, c) {
    return c === 1 && n >= 2 && n <= 3;
  }, (0, _ramda.always)(1)], [function (n, c) {
    return c === 0 && n === 3;
  }, (0, _ramda.always)(1)], [(0, _ramda.always)(true), (0, _ramda.always)(0)]])(n, c);
  return value;
};

var livingNeighborsCount = function livingNeighborsCount(rowId, previousState) {
  return function (cell, cellIdx) {
    return (0, _ramda.converge)(sumAll, [getCell(rowId - 1, cellIdx - 1), getCell(rowId - 1, cellIdx), getCell(rowId - 1, cellIdx + 1), getCell(rowId, cellIdx - 1), getCell(rowId, cellIdx + 1), getCell(rowId + 1, cellIdx - 1), getCell(rowId + 1, cellIdx), getCell(rowId + 1, cellIdx + 1)])(previousState);
  };
};

var getCell = function getCell(row, col) {
  return (0, _ramda.compose)((0, _ramda.ifElse)(_ramda.isNil, (0, _ramda.always)(0), _ramda.identity), (0, _ramda.compose)((0, _ramda.prop)(col + ''), (0, _ramda.prop)(row + '')));
};

var calculateNewState = function calculateNewState(row) {
  return function (previousState) {
    return function (idGenerator) {
      var id = idGenerator();
      var generateNextState = (0, _ramda.addIndex)(_ramda.map)((0, _ramda.converge)(getCellState, [livingNeighborsCount(id, previousState.toArray()), _ramda.identity])); // console.log(generateNextState)

      return generateNextState(row);
    };
  };
};

var loop = function loop(state) {
  console.table(state.toArray());
  var newState = (0, _crocks.liftA3)(calculateNewState, state, _List["default"].of(state), _List["default"].of(idGenerator()));
  setTimeout(function () {
    return loop(newState);
  }, 300);
};

console.log('HELLO'); // loop(initialState)
// console.log(Reader.of(4).map((x) => x + 3).runWith(33))
// console.table(initialState.toArray())
// console.table(result.toArray())
// console.log(initialState.toArray()[-4], getCell('-4', '-5')(initialState.toArray()))
// console.log(compose(prop(-))(initialState.toArray()))
