import React, { useState, useEffect, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

interface SnakeGameProps {
  onClose: () => void
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<string>('right')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const BOARD_SIZE = 20
  const CELL_SIZE = 20

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    }
    setFood(newFood)
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setDirection('right')
    setGameOver(false)
    setScore(0)
    setGameStarted(false)
    generateFood()
  }

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return

    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }

      switch (direction) {
        case 'up':
          head.y = (head.y - 1 + BOARD_SIZE) % BOARD_SIZE
          break
        case 'down':
          head.y = (head.y + 1) % BOARD_SIZE
          break
        case 'left':
          head.x = (head.x - 1 + BOARD_SIZE) % BOARD_SIZE
          break
        case 'right':
          head.x = (head.x + 1) % BOARD_SIZE
          break
      }

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return prevSnake
      }

      newSnake.unshift(head)

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        generateFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, gameOver, gameStarted, food, generateFood])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true)
        }
        return
      }

      switch (e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up')
          break
        case 's':
        case 'S':
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down')
          break
        case 'a':
        case 'A':
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left')
          break
        case 'd':
        case 'D':
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right')
          break
        case 'r':
        case 'R':
          resetGame()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameStarted])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(moveSnake, 150)
      return () => clearInterval(interval)
    }
  }, [moveSnake, gameStarted, gameOver])

  const renderBoard = () => {
    const board = []
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y)
        const isFood = food.x === x && food.y === y
        const isHead = snake[0]?.x === x && snake[0]?.y === y

        let cellClass = 'border border-gray-600'
        if (isSnake) {
          cellClass += isHead ? ' bg-cyan-400' : ' bg-cyan-600'
        } else if (isFood) {
          cellClass += ' bg-red-500'
        } else {
          cellClass += ' bg-gray-800'
        }

        board.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              position: 'absolute',
              left: x * CELL_SIZE,
              top: y * CELL_SIZE
            }}
          />
        )
      }
    }
    return board
  }

  return (
    <div className="bg-black text-cyan-400 p-4 rounded-lg border border-cyan-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🐍 Snake Game</h2>
        <div className="text-sm">
          Score: <span className="text-cyan-300 font-bold">{score}</span>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center mb-4">
          <div className="text-lg mb-2">Press SPACE to start</div>
          <div className="text-sm text-gray-400">
            Use WASD or Arrow Keys to move
          </div>
        </div>
      ) : gameOver ? (
        <div className="text-center mb-4">
          <div className="text-xl text-red-400 mb-2">Game Over!</div>
          <div className="text-sm">Press R to restart</div>
        </div>
      ) : null}

      <div className="relative bg-gray-900 border-2 border-cyan-500 rounded overflow-hidden"
           style={{ width: BOARD_SIZE * CELL_SIZE, height: BOARD_SIZE * CELL_SIZE }}>
        {renderBoard()}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <div>Controls: WASD or Arrow Keys</div>
        <div>Restart: R | Close: ESC</div>
      </div>

      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-cyan-600 text-black rounded hover:bg-cyan-500 transition-colors"
      >
        Close Game
      </button>
    </div>
  )
}

export default SnakeGame 