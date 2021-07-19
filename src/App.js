import { useState } from 'react'
import './App.css'
import Game from './Game'

const KEYBOARD_PROFILES = [
  { left: 'left', up: 'up', right: 'right', down: 'down' },
  { a: 'left', w: 'up', d: 'right', s: 'down' }
]
const BASIC_GAME_OPTIONS = { width: 25, height: 25, tickInterval: 100, foodAmount: 4, keyboardProfile: KEYBOARD_PROFILES[0] }

function generateNewGame(options) {
  let game = {
    options: options,
    board: {
      width: options.width,
      height: options.height,
    },
    tickInterval: options.tickInterval,
    paused: true,
    over: false,
    foods: [],
    foodAmount: options.foodAmount,
    snake: {
      head: { x: 12, y: 12 },
      body: [{ x: 11, y: 12 }, { x: 10, y: 12 }, { x: 9, y: 12 }, { x: 8, y: 12 }],
      velocity: { x: 1, y: 0 },
      keyboardProfile: options.keyboardProfile,
      alive: true
    },
  }
  game.foods = Array(game.foodAmount).fill()
    .map(() => getRandomEmptyPosition(game.board, [game.snake.head, ...game.snake.body]))
  return game
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function isSamePosition(a, b) {
  return a.x === b.x && a.y === b.y
}

function isTakenPosition(position, takenPositions) {
  return takenPositions.find(takenPosition => isSamePosition(takenPosition, position))
}

function getRandomPosition(board) {
  return { x: getRandomInt(0, board.width - 1), y: getRandomInt(0, board.height - 1) }
}

function getRandomEmptyPosition(board, takenPositions = []) {
  let position
  do {
    position = getRandomPosition(board)
  } while (isTakenPosition(position, takenPositions))
  return position
}

function App() {
  const [game, setGame] = useState(generateNewGame(BASIC_GAME_OPTIONS))
  return (
    <div className="App">
      <header className="App-header">
        <h2 className="text-3xl">Snake Game</h2>
      </header>
      {game && <Game
        game={game}
        setGame={setGame}
        getRandomEmptyPosition={getRandomEmptyPosition}
      />}
    </div>
  )
}

export default App
