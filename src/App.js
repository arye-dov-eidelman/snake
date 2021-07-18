import './App.css';
import { useState, useEffect, useMemo } from 'react'

const BOARD_WIDTH = 25;
const BOARD_HEIGHT = 25;
const TICK_INTERVAL_MS = 100;

const LEFT_KEY = 37
const UP_KEY = 38
const RIGHT_KEY = 39
const DOWN_KEY = 40

const VELOCITIES = {
  [LEFT_KEY]: { x: -1, y: 0 },
  [UP_KEY]: { x: 0, y: -1 },
  [RIGHT_KEY]: { x: 1, y: 0 },
  [DOWN_KEY]: { x: 0, y: 1 },
}

function App() {
  const [snake, setSnake] = useState({
    head: { x: 12, y: 12 },
    body: [{ x: 11, y: 12 }, { x: 10, y: 12 }, { x: 9, y: 12 }, { x: 8, y: 12 }],
    velocity: { x: 1, y: 0 },
    alive: true
  })

  const board = useMemo(() => {
    const board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill())
    board[snake.head.y][snake.head.x] = { snake: true, head: true, alive: snake.alive }
    for (const limb of snake.body) {
      board[limb.y][limb.x] = { snake: true, body: true, alive: snake.alive }
    }
    return board
  }, [snake])

  // moves snakes to next position each game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSnake(snake => {
        if (!snake.alive) { return snake }
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
            return { ...snake, alive: false }
          }
        }
        // kill if crashed wall
        if (nextSnake.head.x < 0
          || nextSnake.head.x >= BOARD_WIDTH
          || nextSnake.head.y < 0
          || nextSnake.head.y >= BOARD_HEIGHT
        ) {
          return { ...snake, alive: false }
        }

        return nextSnake
      })
    }, TICK_INTERVAL_MS)
    return () => { clearInterval(interval) }
  }, [])

  const handleKeyDown = e => {
    const velocity = VELOCITIES[e.keyCode]
    if (velocity) {
      setSnake(snake => {
        if (Math.abs((snake.head.x - snake.body[0].x) - velocity.x) > 1
          || Math.abs((snake.head.y - snake.body[0].y) - velocity.y) > 1) {
          return snake
        }
        return { ...snake, velocity }
      })
    }
  }

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex="-1">
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
                  'w-4 h-4 border-2 border-gray-500 border-opacity-25 '
                  + (cell
                    ? cell.alive
                      ? 'border-red-900 ' + (cell.body ? 'bg-red-400 ' : cell.head ? 'bg-red-600 ' : '')
                      : 'border-gray-900 ' + (cell.body ? 'bg-gray-400 ' : cell.head ? 'bg-gray-600 ' : '')
                    : ''
                  )

                }>
              </div>
            )
          }))}
        </div>
      </div>
    </div>
  );
}

export default App;
