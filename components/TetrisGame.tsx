import React, { useState, useEffect, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

interface Tetromino {
  shape: number[][]
  position: Position
  color: string
}

interface TetrisGameProps {
  onClose: () => void
}

const TetrisGame: React.FC<TetrisGameProps> = ({ onClose }) => {
  const [board, setBoard] = useState<number[][]>(Array(20).fill(null).map(() => Array(10).fill(0)))
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [linesCleared, setLinesCleared] = useState(0)

  const BOARD_WIDTH = 10
  const BOARD_HEIGHT = 20
  const CELL_SIZE = 25

  const TETROMINOS = {
    I: {
      shape: [[1, 1, 1, 1]],
      color: 'bg-cyan-400'
    },
    O: {
      shape: [[1, 1], [1, 1]],
      color: 'bg-yellow-400'
    },
    T: {
      shape: [[0, 1, 0], [1, 1, 1]],
      color: 'bg-purple-400'
    },
    S: {
      shape: [[0, 1, 1], [1, 1, 0]],
      color: 'bg-green-400'
    },
    Z: {
      shape: [[1, 1, 0], [0, 1, 1]],
      color: 'bg-red-400'
    },
    J: {
      shape: [[1, 0, 0], [1, 1, 1]],
      color: 'bg-blue-400'
    },
    L: {
      shape: [[0, 0, 1], [1, 1, 1]],
      color: 'bg-orange-400'
    }
  }

  const generateNewPiece = useCallback((): Tetromino => {
    const pieces = Object.keys(TETROMINOS)
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    const tetromino = TETROMINOS[randomPiece as keyof typeof TETROMINOS]
    
    return {
      shape: tetromino.shape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2), y: 0 },
      color: tetromino.color
    }
  }, [])

  const isValidMove = useCallback((piece: Tetromino, newPosition: Position): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = newPosition.x + x
          const newY = newPosition.y + y
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false
          }
        }
      }
    }
    return true
  }, [board])

  const placePiece = useCallback(() => {
    if (!currentPiece) return

    const newBoard = board.map(row => [...row])
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.position.y + y
          const boardX = currentPiece.position.x + x
          
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1
          }
        }
      }
    }

    setBoard(newBoard)
    setCurrentPiece(generateNewPiece())
  }, [currentPiece, board, generateNewPiece])

  const clearLines = useCallback(() => {
    const newBoard = board.filter(row => row.some(cell => cell === 0))
    const linesToAdd = BOARD_HEIGHT - newBoard.length
    
    if (linesToAdd > 0) {
      const newLines = Array(linesToAdd).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
      setBoard([...newLines, ...newBoard])
      setLinesCleared(prev => prev + linesToAdd)
      setScore(prev => prev + linesToAdd * 100 * level)
      
      if (linesCleared + linesToAdd >= level * 10) {
        setLevel(prev => prev + 1)
      }
    }
  }, [board, linesCleared, level])

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentPiece || gameOver) return

    const newPosition = { ...currentPiece.position }
    
    switch (direction) {
      case 'left':
        newPosition.x -= 1
        break
      case 'right':
        newPosition.x += 1
        break
      case 'down':
        newPosition.y += 1
        break
    }

    if (isValidMove(currentPiece, newPosition)) {
      setCurrentPiece({ ...currentPiece, position: newPosition })
    } else if (direction === 'down') {
      placePiece()
      clearLines()
    }
  }, [currentPiece, gameOver, isValidMove, placePiece, clearLines])

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver) return

    const rotatedShape = currentPiece.shape[0].map((_, i) => 
      currentPiece.shape.map(row => row[i]).reverse()
    )

    const rotatedPiece = { ...currentPiece, shape: rotatedShape }
    
    if (isValidMove(rotatedPiece, currentPiece.position)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [currentPiece, gameOver, isValidMove])

  const resetGame = () => {
    setBoard(Array(20).fill(null).map(() => Array(10).fill(0)))
    setScore(0)
    setLevel(1)
    setLinesCleared(0)
    setGameOver(false)
    setGameStarted(false)
    setCurrentPiece(null)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true)
          setCurrentPiece(generateNewPiece())
        }
        return
      }

      if (gameOver) {
        if (e.key === 'r' || e.key === 'R') {
          resetGame()
        }
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePiece('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePiece('right')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          movePiece('down')
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          rotatePiece()
          break
        case 'r':
        case 'R':
          resetGame()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, movePiece, rotatePiece, generateNewPiece])

  useEffect(() => {
    if (gameStarted && !gameOver && currentPiece) {
      const interval = setInterval(() => {
        movePiece('down')
      }, Math.max(100, 1000 - level * 50))
      
      return () => clearInterval(interval)
    }
  }, [gameStarted, gameOver, currentPiece, movePiece, level])

  useEffect(() => {
    if (currentPiece && !isValidMove(currentPiece, currentPiece.position)) {
      setGameOver(true)
    }
  }, [currentPiece, isValidMove])

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.position.y + y
            const boardX = currentPiece.position.x + x
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 2 // Special value for current piece
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => 
      row.map((cell, x) => (
        <div
          key={`${x}-${y}`}
          className={`border border-gray-600 ${
            cell === 0 ? 'bg-gray-800' : 
            cell === 1 ? 'bg-cyan-600' : 
            currentPiece?.color || 'bg-cyan-400'
          }`}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE
          }}
        />
      ))
    )
  }

  return (
    <div className="bg-black text-cyan-400 p-4 rounded-lg border border-cyan-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🟦 Tetris</h2>
        <div className="text-sm space-y-1">
          <div>Score: <span className="text-cyan-300 font-bold">{score}</span></div>
          <div>Level: <span className="text-cyan-300 font-bold">{level}</span></div>
          <div>Lines: <span className="text-cyan-300 font-bold">{linesCleared}</span></div>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center mb-4">
          <div className="text-lg mb-2">Press SPACE to start</div>
          <div className="text-sm text-gray-400">
            Use Arrow Keys or WASD to move and rotate
          </div>
        </div>
      ) : gameOver ? (
        <div className="text-center mb-4">
          <div className="text-xl text-red-400 mb-2">Game Over!</div>
          <div className="text-sm">Press R to restart</div>
        </div>
      ) : null}

      <div className="flex gap-4">
        <div className="grid grid-cols-10 gap-0 bg-gray-900 border-2 border-cyan-500 rounded overflow-hidden"
             style={{ width: BOARD_WIDTH * CELL_SIZE, height: BOARD_HEIGHT * CELL_SIZE }}>
          {renderBoard()}
        </div>
        
        <div className="text-sm text-gray-400 space-y-2">
          <div className="font-bold text-cyan-300">Controls:</div>
          <div>← → Move</div>
          <div>↓ Drop</div>
          <div>↑ Rotate</div>
          <div>R Restart</div>
          <div>ESC Close</div>
        </div>
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

export default TetrisGame 