import { initializeState, getNewState } from './engine'

const noRows = 50
const noCols = 50

var canvas = document.getElementById('stage');
const cellWidth = canvas.clientWidth / noCols
const cellHeight = canvas.clientHeight / noRows

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

const draw = (state) => {
  state.forEach((rows, rowIdx) => {
    rows.forEach((cell, cellIdx) => {
      ctx.fillStyle = cell ? 'black' : 'white'
      ctx.fillRect(cellIdx * cellWidth, rowIdx * cellHeight, cellWidth, cellHeight)
    })
  })
}

const loop = (newState) => {
  draw(newState)
  setTimeout(() => loop(getNewState(newState)), 50)
}

loop(initializeState(noRows, noCols))

