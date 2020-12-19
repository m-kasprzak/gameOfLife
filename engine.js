
import { Reader, liftA3, List } from 'crocks'
import { compose, map, addIndex, prop, isNil, ifElse, identity, always, converge, nAry, unapply, sum, cond } from 'ramda'

const generateNumber = Reader.ask((max) => Math.floor(Math.random() * Math.floor(max)))

const idGenerator = (startValue = 0) => () => startValue++

const sumAll = nAry(8, unapply(sum))

const getCellState = cond([
  [(neighbors, cell) => cell === 1 && neighbors >= 2 && neighbors <= 3, always(1)],
  [(n, c) => c === 0 && n === 3, always(1)],
  [always(true), always(0)]
])

const livingNeighborsCount = (rowId, previousState) => (cell, cellIdx) => converge(sumAll, [
  getCell(rowId - 1, cellIdx - 1),
  getCell(rowId - 1, cellIdx),
  getCell(rowId - 1, cellIdx + 1),
  getCell(rowId, cellIdx - 1),
  getCell(rowId, cellIdx + 1),
  getCell(rowId + 1, cellIdx - 1),
  getCell(rowId + 1, cellIdx),
  getCell(rowId + 1, cellIdx + 1),
])(previousState)

const getCell = (row, col) => compose(ifElse(isNil, always(0), identity), prop(col + ''), prop(row + ''))

const calculateNewState = (row) => (previousState) => (rowIdxGenerator) => {
  const rowIdx = rowIdxGenerator()
  const generateNextState = addIndex(map)(converge(getCellState, [livingNeighborsCount(rowIdx, previousState.toArray()), identity]))
  return generateNextState(row)
}

export const getNewState = (state) => liftA3(calculateNewState, List(state), List.of(List(state)), List.of(idGenerator())).toArray()
export const initializeState = (rows, cols) => new Array(rows).fill(2).map(() => new Array(cols).fill(2).map(generateNumber.runWith))


