import { useEffect, useMemo } from 'react'
import _ from 'lodash'
import KeyboardEventHandler from 'react-keyboard-event-handler'

const VELOCITIES = {
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
}

function Game({ game, setGame, getRandomEmptyPositions, restart }) {
  const board = useMemo(() => {
    const board = Array(game.boardSize).fill().map(() => Array(game.boardSize).fill({}))
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
  const inputKeys = useMemo(() => {
    return [
      ...Object.keys(game.snake.inputControls.keyMap),
      'p',
      'enter'
    ].map(key => [key, 'ctrl+' + key, 'shift+' + key, 'meta+' + key, 'alt+' + key]).flat()
  }, [game.snake.inputControls.keyMap])

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

        // kill if crashing into self
        for (const limb of nextSnake.body) {
          if (nextSnake.head.x === limb.x && nextSnake.head.y === limb.y) {
            return { ...game, over: true, snake: { ...snake, alive: false } }
          }
        }

        // kill if crashing into wall
        if (nextSnake.head.x < 0
          || nextSnake.head.x >= game.boardSize
          || nextSnake.head.y < 0
          || nextSnake.head.y >= game.boardSize
        ) {
          return { ...game, over: true, snake: { ...snake, alive: false } }
        }

        // grow if eating food
        for (const food of foods) {
          if (nextSnake.head.x === food.x && nextSnake.head.y === food.y) {
            return {
              ...game,
              snake: { ...nextSnake, body: [snake.head, ...snake.body] },
              foods: [
                ...foods.filter(food => !_.isEqual(food, nextSnake.head)),
                getRandomEmptyPositions(game.boardSize, [snake.head, ...snake.body, ...foods])[0]
              ]
            }
          }
        }

        // move to next cell
        return { ...game, snake: nextSnake }
      })
    }, game.tickInterval)
    return () => { clearInterval(interval) }
  }, [game.tickInterval, game.paused, game.over, getRandomEmptyPositions, setGame])

  const handleKeyDown = (key, e) => {
    const plainKey = key.split('+').pop()
    console.log(key, plainKey, e)
    setGame(game => {
      const { snake } = game
      // new game if over
      if (plainKey === 'enter') {
        if (game.over) { restart() }
        return game
      }
      // pause
      if (plainKey === 'p') {
        return { ...game, paused: !game.paused, started: true }
      }
      // move
      if (snake.inputControls.keyMap[plainKey]) {
        const velocity = VELOCITIES[snake.inputControls.keyMap[plainKey]]
        if (!velocity
          || Math.abs((snake.head.x - snake.body[0].x) - velocity.x) > 1
          || Math.abs((snake.head.y - snake.body[0].y) - velocity.y) > 1
          || (game.paused && game.started)) {
          return game
        }
        return { ...game, snake: { ...snake, velocity }, paused: false, started: true }
      }
    })
  }

  // tailwind jit use: grid-cols-25, grid-cols-25, grid-cols-25
  return (
    <div className="game" onKeyDown={handleKeyDown}>
      <KeyboardEventHandler handleKeys={inputKeys} onKeyEvent={handleKeyDown} />
      <div className={`grid grid-cols-${game.boardSize} grid-flow-row bg-gray-900` + ((game.paused && game.started) || game.over ? ' opacity-40' : '')} >
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
  )
}

export default Game
