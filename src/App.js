import './App.css'
import { useState, useEffect, useMemo } from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler'


const BOARD_WIDTH = 25
const BOARD_HEIGHT = 25
const TICK_INTERVAL_MS = 100
const FOOD_AMOUNT = 4

const KEYBOARD_PROFILES = [
  { left: 'left', up: 'up', right: 'right', down: 'down' },
  { a: 'left', w: 'up', d: 'right', s: 'down' }
]

const KEYBOARD_KEYS = [
  ...KEYBOARD_PROFILES.map(profile => Object.keys(profile)).flat(),
  'p',
  'enter'
].map(key => [key, 'ctrl+' + key, 'shift+' + key, 'meta+' + key, 'alt+' + key]).flat()

const VELOCITIES = {
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
}

const NEW_GAME_SETUP = {
  paused: false,
  over: false,
  foods: Array(FOOD_AMOUNT).fill().map(() => getRandomPosition()),
  snake: {
    head: { x: 12, y: 12 },
    body: [{ x: 11, y: 12 }, { x: 10, y: 12 }, { x: 9, y: 12 }, { x: 8, y: 12 }],
    velocity: { x: 1, y: 0 },
    keyboardProfile: KEYBOARD_PROFILES[0],
    alive: true
  },
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomPosition() {
  return { x: getRandomInt(0, BOARD_WIDTH - 1), y: getRandomInt(0, BOARD_HEIGHT - 1) }
}

function App() {
  const [game, setGame] = useState(NEW_GAME_SETUP)

  const board = useMemo(() => {
    const board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill({}))
    const { snake, foods } = game
    board[snake.head.y][snake.head.x] = { snake: true, head: true, alive: snake.alive }
    for (const food of foods) {
      board[food.y][food.x] = { food: true }
    }
    for (const limb of snake.body) {
      board[limb.y][limb.x] = { snake: true, body: true, alive: snake.alive }
    }
    return board
  }, [game])

  // moves snakes to next position each game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(game => {
        const { snake, foods, paused } = game
        if (paused) { return game }
        if (!snake.alive) { return game }
        const nextSnake = {
          ...snake,
          head: {
            x: snake.head.x + snake.velocity.x,
            y: snake.head.y + snake.velocity.y
          },
          body: [snake.head, ...snake.body.slice(0, -1)]
        }

        // kill if crashed self
        for (const limb of nextSnake.body) {
          if (nextSnake.head.x === limb.x && nextSnake.head.y === limb.y) {
            return { ...game, over: true, snake: { ...snake, alive: false } }
          }
        }

        // kill if crashed wall
        if (nextSnake.head.x < 0
          || nextSnake.head.x >= BOARD_WIDTH
          || nextSnake.head.y < 0
          || nextSnake.head.y >= BOARD_HEIGHT
        ) {
          return { ...game, over: true, snake: { ...snake, alive: false } }
        }

        // grow if eat food
        for (const food of foods) {
          if (nextSnake.head.x === food.x && nextSnake.head.y === food.y) {
            return {
              ...game,
              snake: { ...nextSnake, body: [snake.head, ...snake.body] },
              foods: [...foods.filter(f => nextSnake.head.x !== f.x || nextSnake.head.y !== f.y), getRandomPosition()]
            }
          }
        }

        // move
        return { ...game, snake: nextSnake }
      })
    }, TICK_INTERVAL_MS)
    return () => { clearInterval(interval) }
  }, [])

  const handleKeyDown = (key, e) => {
    const plainKey = key.split('+').pop()
    console.log(key, plainKey, e)
    setGame(game => {
      const { snake } = game
      // new game if over
      if (plainKey === 'enter') {
        if (game.over) {
          return NEW_GAME_SETUP
        }
        return game
      }
      // pause
      if (plainKey === 'p') {
        return { ...game, paused: !game.paused }
      }
      // move
      if (snake.keyboardProfile[plainKey]) {
        const velocity = VELOCITIES[snake.keyboardProfile[plainKey]]
        if (!velocity
          || Math.abs((snake.head.x - snake.body[0].x) - velocity.x) > 1
          || Math.abs((snake.head.y - snake.body[0].y) - velocity.y) > 1) {
          return game
        }
        return { ...game, snake: { ...snake, velocity } }
      }
    })
  }

  return (
    <div className="App">
      <KeyboardEventHandler
        handleKeys={KEYBOARD_KEYS}
        onKeyEvent={handleKeyDown}
      />
      <header className="App-header">
        <h2 className="text-3xl bg-[#916a6a]">Snake</h2>
      </header>
      <div className="game inline-block" onKeyDown={handleKeyDown}>
        <div className="grid grid-cols-25 grid-flow-row bg-gray-900">
          {board && board.map((row, y) => row.map((cell, x) => {
            return (
              <div
                key={`${x}-${y}`}
                className={
                  'w-4 h-4 border-2 border-gray-500 border-opacity-25 ' +
                  (cell.food ? 'bg-yellow-300'
                    : cell.snake
                      ? (cell.alive
                        ? 'border-red-900 ' + (cell.body ? 'bg-red-400 ' : cell.head ? 'bg-red-600 ' : '')
                        : 'border-gray-900 ' + (cell.body ? 'bg-gray-400 ' : cell.head ? 'bg-gray-600 ' : '')
                      ) : ''
                  )

                }>
              </div>
            )
          }))}
        </div>
      </div>
    </div>
  )
}

export default App
