"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Terminal, Wifi, Battery, Volume2, X, Minus, Square, Folder, FileText, User, Briefcase, Code, Mail, Settings, Home, Zap, Eye, EyeOff, Lock, Unlock, Download, Upload, Database, Cpu, HardDrive } from "lucide-react"
import SnakeGame from "@/components/SnakeGame"
import TetrisGame from "@/components/TetrisGame"

interface Window {
  id: string
  title: string
  content: React.ReactNode
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

interface DesktopIcon {
  id: string
  title: string
  icon: React.ReactNode
  windowId: string
  position: { x: number; y: number }
}

interface TerminalCommand {
  command: string
  output: string
  timestamp: Date
}

export default function OSPortfolio() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [matrixChars, setMatrixChars] = useState<string[]>([])
  const [windows, setWindows] = useState<Window[]>([])
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([])
  const [terminalCursor, setTerminalCursor] = useState(true)
  const [showTerminal, setShowTerminal] = useState(true)
  const [currentDirectory, setCurrentDirectory] = useState("root")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("")
  const [revealOpacity, setRevealOpacity] = useState(0)
  const [bootProgress, setBootProgress] = useState(0)
  const [systemStatus, setSystemStatus] = useState("SECURE")
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [networkActivity, setNetworkActivity] = useState(0)
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [showMatrix, setShowMatrix] = useState(false)
  const [activeGame, setActiveGame] = useState<string | null>(null)



  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)

  // Loading sequence
  useEffect(() => {
    const loadingSteps = [
      { progress: 25, text: "INITIALIZING CORE SYSTEMS..." },
      { progress: 50, text: "LOADING INTERFACE COMPONENTS..." },
      { progress: 75, text: "ESTABLISHING SECURE CONNECTION..." },
      { progress: 100, text: "SYSTEM READY - WELCOME, MUNEEB" }
    ]

    let currentStep = 0
    const loadingInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep]
        setLoadingProgress(step.progress)
        setLoadingText(step.text)
        currentStep++
      } else {
        clearInterval(loadingInterval)
        setTimeout(() => {
          setIsLoading(false)
          // Start the system boot reveal effect
          const bootInterval = setInterval(() => {
            setBootProgress(prev => {
              if (prev >= 100) {
                clearInterval(bootInterval)
                // Add welcome message to terminal after boot
                const welcomeCommand: TerminalCommand = {
                  command: "",
                  output: "SYSTEM READY - Terminal ready. Type 'help' for available commands.",
                  timestamp: new Date()
                }
                setTerminalHistory([welcomeCommand])
                return 100
              }
              return prev + 2
            })
          }, 30)
        }, 100)
      }
    }, 200)

    return () => clearInterval(loadingInterval)
  }, [])

    // Initialize desktop icons
  useEffect(() => {
    const icons: DesktopIcon[] = [
      {
        id: "about-icon",
        title: "About Me",
        icon: <User className="w-8 h-8" />,
        windowId: "about",
        position: { x: 50, y: 120 }
      },
      {
        id: "skills-icon",
        title: "Skills",
        icon: <Code className="w-8 h-8" />,
        windowId: "skills",
        position: { x: 50, y: 190 }
      },
      {
        id: "projects-icon",
        title: "Projects",
        icon: <Folder className="w-8 h-8" />,
        windowId: "projects",
        position: { x: 50, y: 260 }
      },
      {
        id: "experience-icon",
        title: "Experience",
        icon: <Briefcase className="w-8 h-8" />,
        windowId: "experience",
        position: { x: 50, y: 330 }
      },
      {
        id: "contact-icon",
        title: "Contact",
        icon: <Mail className="w-8 h-8" />,
        windowId: "contact",
        position: { x: 50, y: 400 }
      },
      {
        id: "system-icon",
        title: "System",
        icon: <Cpu className="w-8 h-8" />,
        windowId: "system",
        position: { x: 50, y: 540 }
      }
    ]
    setDesktopIcons(icons)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)



    // Terminal cursor blink
    const cursorTimer = setInterval(() => {
      setTerminalCursor(prev => !prev)
    }, 500)

    // System metrics simulation
    const systemTimer = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 10)
      setMemoryUsage(Math.floor(Math.random() * 20) + 60)
      setNetworkActivity(Math.floor(Math.random() * 100))
    }, 2000)

    // Glitch effect
    const glitchTimer = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearInterval(cursorTimer)
      clearInterval(systemTimer)
      clearInterval(glitchTimer)
    }
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  // Focus terminal input when terminal window is opened or becomes active
  useEffect(() => {
    const terminalWindow = windows.find(w => w.id === "terminal" && !w.isMinimized)
    if (terminalWindow && inputRef.current) {
      // Use a longer timeout to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [windows, activeWindowId])



  const skills = {
    languages: [
      "Python", "C/C++", "SQL (SQLite)", "JavaScript", "HTML/CSS", "Assembly", "Swift", "C#"
    ],
    frameworks: [
      "React", "Node.js", "Flask", "Vite"
    ],
    gameEngines: [
      "Unity", "Unreal Engine"
    ],
    devTools: [
      "Git", "GitHub", "TravisCI", "VS Code", "Visual Studio", "PyCharm", "Jupyter", "Linux", "Cursor", "ClaudeAI", "Figma"
    ],
    libraries: [
      "pandas", "NumPy", "Matplotlib", "OpenCV", "Tailwind CSS"
    ]
  }

  const experience = [
    {
      role: "Computer Science Peer Tutor",
      company: "Simon Fraser University",
      period: "May 2024 – Present",
      location: "Burnaby, BC",
      bullets: [
        "Tutor undergraduate students in CMPT 125, CMPT 210, CMPT 225, CMPT 295, and MACM 101 by explaining core concepts in programming, algorithms, and discrete math.",
        "Guide students through debugging and code review sessions to build robust problem-solving skills and coding best practices.",
        "Develop targeted practice problems and review guides to reinforce learning and prepare students for exams and assignments."
      ]
    },
    {
      role: "Backend Game Developer",
      company: "Horizon Expeditions",
      period: "Oct 2024 – Jan 2025",
      location: "Hybrid",
      bullets: [
        "Developed and maintained a global inventory system to ensure in-game collected items are consistently accessible to players.",
        "Optimized backend processes using Unity and C#, improving performance and scalability for seamless gameplay.",
        "Collaborated with cross-functional teams to integrate backend services with core game mechanics and UI components."
      ]
    },
    {
      role: "Web Development Intern",
      company: "Tankit",
      period: "Feb. 2021 – May 2021",
      location: "Dubai, UAE",
      bullets: [
        "Performed detailed website evaluations and UX audits to identify performance bottlenecks and design inconsistencies.",
        "Developed responsive frontend components using React.js, HTML, and CSS, integrating seamlessly with backend RESTful APIs.",
        "Implemented robust testing protocols—including unit and integration tests—to ensure high-quality, bug-free code."
      ]
    }
  ]

  const projects = [
    {
      name: "HeatSpace (JourneyHacks Winner)",
      tech: "Next.js, React, TailwindCSS, Flask, OpenCV, NumPy, SciPy",
      period: "Feb 2025",
      bullets: [
        "Developed a smart heat optimization system that simulates heat propagation to enhance heating efficiency.",
        "Built a dynamic frontend using Next.js and TailwindCSS, allowing users to upload 3D floor plans and visualize heat distribution.",
        "Implemented a Flask backend integrated with OpenCV and NumPy to process layouts and detect cold spots."
      ]
    },
    {
      name: "TripWise Travel Planner",
      tech: "React, TypeScript, Node.js, Express, RapidAPI, REST",
      period: "April 2025",
      bullets: [
        "Developed a full-stack travel planner that allows users to search hotels by location and view live reviews via the Skyscanner API.",
        "Designed a modular backend with Express.js, implementing RESTful routes and controllers to handle hotel search and review retrieval.",
        "Built a responsive React frontend with TypeScript, featuring a two-step flow and dynamic rendering of API results."
      ]
    }
  ]

  const education = {
    school: "Simon Fraser University",
    degree: "BSc in Applied Science",
    major: "Computer Science",
    location: "Burnaby, BC",
    grad: "June 2027"
  }



  const executeCommand = (command: string) => {
    try {
      const cmd = command.toLowerCase().trim()
      let output = ""



    switch (cmd) {
      case "help":
        if (currentDirectory === "root") {
          output = `Available commands:

📁 navigation - Navigate to portfolio sections
🔧 utilities - Access terminal utilities
🎮 games - Play terminal games
📂 cd [directory] - Change directory
📋 ls - List available directories
🎲 fortune - Get a random fortune
🌤️ weather - Check weather (simulated)
💻 neofetch - System information
📊 top - Process monitor
🌐 ping - Network test`
        } else if (currentDirectory === "navigation") {
          output = `📁 NAVIGATION COMMANDS:

about - Open about window
skills - Open skills window
projects - Open projects window
experience - Open experience window
contact - Open contact window

cd .. - Go back to root`
        } else if (currentDirectory === "utilities") {
          output = `🔧 UTILITY COMMANDS:

help - Show this help message
clear - Clear terminal
whoami - Show user info
date - Show current date/time
💻 neofetch - System information
📊 top - Process monitor
🌐 ping - Network test
exit - Close terminal

cd .. - Go back to root`
        } else if (currentDirectory === "games") {
          output = `🎮 GAME COMMANDS:

help - Show this help message
cd .. - Go back to root
🐍 snake - Play Snake game
🟦 tetris - Play Tetris
🎯 hangman - Play Hangman
🎲 number - Number guessing game
✂️ rps - Rock, Paper, Scissors
🎲 dice - Roll dice
🪙 coin - Flip coin`
        }
        break
              case "clear":
          setTerminalHistory([])
          return
        case "navigation":
          setCurrentDirectory("navigation")
          output = "📁 Navigation directory - Type 'help' to see available commands"
          break
        case "utilities":
          setCurrentDirectory("utilities")
          output = "🔧 Utilities directory - Type 'help' to see available commands"
          break
        case "games":
          setCurrentDirectory("games")
          output = "🎮 Games directory - Type 'help' to see available games"
          break
        case "ls":
          if (currentDirectory === "root") {
            output = `📁 Available directories:
navigation/ - Portfolio sections
utilities/ - Terminal utilities
games/ - Terminal games`
          } else if (currentDirectory === "games") {
            output = `🎮 Available games:
snake - Classic Snake game
tetris - Tetris block game
hangman - Word guessing game
number - Number guessing
rps - Rock, Paper, Scissors
dice - Roll dice
coin - Flip coin`
          } else {
            output = "Use 'cd ..' to go back to root"
          }
          break
              case "cd":
          if (currentDirectory === "root") {
            output = "Usage: cd [directory]\nAvailable: navigation, utilities"
          } else {
            output = "Usage: cd .. (to go back)"
          }
          break
        case "about":
          if (currentDirectory === "navigation") {
            openWindow("about")
            output = "Opening About Me window..."
          } else {
            output = "Command not available in current directory. Use 'cd navigation' first."
          }
          break
        case "skills":
          if (currentDirectory === "navigation") {
            openWindow("skills")
            output = "Opening Skills window..."
          } else {
            output = "Command not available in current directory. Use 'cd navigation' first."
          }
          break
        case "projects":
          if (currentDirectory === "navigation") {
            openWindow("projects")
            output = "Opening Projects window..."
          } else {
            output = "Command not available in current directory. Use 'cd navigation' first."
          }
          break
        case "experience":
          if (currentDirectory === "navigation") {
            openWindow("experience")
            output = "Opening Experience window..."
          } else {
            output = "Command not available in current directory. Use 'cd navigation' first."
          }
          break
        case "contact":
          if (currentDirectory === "navigation") {
            openWindow("contact")
            output = "Opening Contact window..."
          } else {
            output = "Command not available in current directory. Use 'cd navigation' first."
          }
          break
              case "whoami":
          if (currentDirectory === "utilities") {
            output = `User: Muneeb Kamran
Role: Computer Science Student
Location: Burnaby, BC
Institution: Simon Fraser University
Status: Available for Internships`
          } else {
            output = "Command not available in current directory. Use 'cd utilities' first."
          }
          break
        case "date":
          if (currentDirectory === "utilities") {
            output = currentTime.toLocaleString()
          } else {
            output = "Command not available in current directory. Use 'cd utilities' first."
          }
          break
        case "fortune":
          const fortunes = [
            "A bug in the hand is better than one as yet undetected.",
            "A computer scientist is someone who fixes things that aren't broken.",
            "Any program that runs right is obsolete.",
            "Computers are like air conditioners: they stop working when you open Windows.",
            "The best way to predict the future is to implement it.",
            "There are 10 types of people: those who understand binary and those who don't.",
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "A clean code is a happy code.",
            "The only way to learn a new programming language is by writing programs in it.",
            "Debugging is twice as hard as writing the code in the first place."
          ]
          output = fortunes[Math.floor(Math.random() * fortunes.length)]
          break
        case "weather":
          const conditions = ["☀️ Sunny", "🌧️ Rainy", "⛅ Partly Cloudy", "🌩️ Stormy", "❄️ Snowy", "🌫️ Foggy"]
          const temps = Math.floor(Math.random() * 40) + 10
          const condition = conditions[Math.floor(Math.random() * conditions.length)]
          output = `Current Weather: ${condition} | Temperature: ${temps}°C | Humidity: ${Math.floor(Math.random() * 60) + 20}%`
          break
        case "neofetch":
          output = `root@ai-system
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OS: AI System v3.0
Kernel: Linux 6.0.0-ai
Shell: /bin/bash
CPU: Intel i9-13900K (16) @ 5.8GHz
Memory: 32GB DDR5
GPU: NVIDIA RTX 4090
Disk: 2TB NVMe SSD
Network: 1Gbps Ethernet
Uptime: 24/7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          break
        case "top":
          output = `Process Monitor:
PID  USER     CPU%  MEM%  COMMAND
1    root     0.1   0.2   systemd
2    root     0.0   0.0   kthreadd
3    root     0.0   0.0   rcu_gp
4    root     0.0   0.0   rcu_par_gp
5    root     0.0   0.0   kworker/0:0
6    root     0.0   0.0   kworker/0:0H
7    root     0.0   0.0   kworker/u2:0
8    root     0.0   0.0   migration/0
9    root     0.0   0.0   rcu_bh
10   root     0.0   0.0   rcuob/0`
          break
        case "ping":
          output = `PING google.com (142.250.190.78) 56(84) bytes of data.
64 bytes from google.com (142.250.190.78): icmp_seq=1 time=12.3 ms
64 bytes from google.com (142.250.190.78): icmp_seq=2 time=11.8 ms
64 bytes from google.com (142.250.190.78): icmp_seq=3 time=13.1 ms
64 bytes from google.com (142.250.190.78): icmp_seq=4 time=12.5 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3003ms
rtt min/avg/max/mdev = 11.800/12.425/13.100/0.500 ms`
          break
      case "exit":
        closeWindow("terminal")
        return
      case "":
        return
      default:
        // Handle cd command with arguments
        if (cmd.startsWith("cd ")) {
          const targetDir = command.substring(3).trim()
          if (targetDir === ".." && currentDirectory !== "root") {
            setCurrentDirectory("root")
            output = "📂 Back to root directory"
          } else if (targetDir === "navigation" && currentDirectory === "root") {
            setCurrentDirectory("navigation")
            output = "📁 Navigation directory - Type 'help' to see available commands"
          } else if (targetDir === "utilities" && currentDirectory === "root") {
            setCurrentDirectory("utilities")
            output = "🔧 Utilities directory - Type 'help' to see available commands"
          } else if (targetDir === "games" && currentDirectory === "root") {
            setCurrentDirectory("games")
            output = "🎮 Games directory - Type 'help' to see available games"
          } else {
            output = `Directory '${targetDir}' not found or not accessible from current location`
          }
        } else if (currentDirectory === "games") {
          // Handle game commands
          switch (cmd) {
            case "snake":
              setActiveGame("snake")
              output = `🐍 SNAKE GAME 🐍
Opening Snake game window...
Use WASD or Arrow Keys to control the snake.
Eat the red food to grow longer.
Avoid hitting yourself!
Press SPACE to start the game.`
              break
            case "tetris":
              setActiveGame("tetris")
              output = `🟦 TETRIS 🟦
Opening Tetris game window...
Use Arrow Keys or WASD to move and rotate blocks.
Clear lines to score points.
Press SPACE to start the game.`
              break
            case "hangman":
              output = `🎯 HANGMAN 🎯
Guess the word one letter at a time.
You have 6 wrong guesses allowed.
Word: _ _ _ _ _ _ (6 letters)
Enter a letter: (Type a letter to play)`
              break
            case "number":
              const secretNumber = Math.floor(Math.random() * 100) + 1
              output = `🎲 NUMBER GUESSING GAME 🎲
I'm thinking of a number between 1 and 100.
Secret number: ${secretNumber} (shh, don't tell anyone!)
Guess the number: (Type a number to play)`
              break
            case "rps":
              const choices = ["rock", "paper", "scissors"]
              const computerChoice = choices[Math.floor(Math.random() * 3)]
              output = `✂️ ROCK, PAPER, SCISSORS ✂️
Computer chose: ${computerChoice}
Enter your choice (rock/paper/scissors): (Type your choice to play)`
              break
            case "dice":
              const dice1 = Math.floor(Math.random() * 6) + 1
              const dice2 = Math.floor(Math.random() * 6) + 1
              output = `🎲 DICE ROLL 🎲
You rolled: ${dice1} and ${dice2}
Total: ${dice1 + dice2}`
              break
            case "coin":
              const coinResult = Math.random() < 0.5 ? "HEADS" : "TAILS"
              output = `🪙 COIN FLIP 🪙
Result: ${coinResult}`
              break
            default:
              output = `Game '${command}' not found. Type 'help' for available games.`
          }
        } else {
          output = `Command not found: ${command}. Type 'help' for available commands.`
        }
    }

    const newCommand: TerminalCommand = {
      command,
      output,
      timestamp: new Date()
    }

    setTerminalHistory([...terminalHistory, newCommand])
    } catch (error) {
      console.error('Error executing command:', error)
      const errorCommand: TerminalCommand = {
        command,
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      }
      setTerminalHistory([...terminalHistory, errorCommand])
    }
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (terminalInput.trim()) {
      executeCommand(terminalInput)
      setTerminalInput("")
      // Refocus the input after command execution
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 10)
    }
  }

  const openWindow = (windowId: string) => {
    const existingWindow = windows.find(w => w.id === windowId)
    if (existingWindow) {
      setActiveWindowId(windowId)
      setWindows(windows.map(w => 
        w.id === windowId 
          ? { ...w, isMinimized: false, zIndex: Math.max(...windows.map(w => w.zIndex)) + 1 }
          : w
      ))
      return
    }

    let content: React.ReactNode
    let title: string

    switch (windowId) {
      case "about":
        title = "About Me"
        content = (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Muneeb Kamran</div>
              <div className="text-cyan-400 text-sm mb-2">
                <span>672-667-2507</span> | <span>mmk28@sfu.ca</span> | <a href="https://linkedin.com/in/Muneeb" className="underline text-cyan-400">linkedin.com/in/Muneeb</a> | <a href="https://github.com/Muneeb" className="underline text-cyan-400">github.com/Muneeb</a> | <a href="https://muneebk.github.io" className="underline text-cyan-400">muneebk.github.io</a>
              </div>
              <div className="border border-cyan-400 p-4 text-left mx-auto max-w-xl bg-black/60 rounded">
                <div className="mb-2">Computer Science student at Simon Fraser University with a passion for full-stack development, game development, and AI/ML integration. Experienced in building robust, scalable systems and collaborating with cross-functional teams. Open to internship and project opportunities!</div>
                <div className="text-xs text-gray-400">Location: Burnaby, BC | Graduation: June 2027</div>
              </div>
            </div>
            <div className="text-xs text-cyan-400 text-center mt-2">“Code is poetry in motion.”</div>
          </div>
        )
        break
      case "skills":
        title = "Technical Skills"
        content = (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-bold text-cyan-400 mb-1">Languages</div>
                <div className="flex flex-wrap gap-2 text-sm">{skills.languages.map(s => <span key={s} className="bg-cyan-900/40 px-2 py-1 rounded">{s}</span>)}</div>
              </div>
              <div>
                <div className="font-bold text-cyan-400 mb-1">Frameworks</div>
                <div className="flex flex-wrap gap-2 text-sm">{skills.frameworks.map(s => <span key={s} className="bg-cyan-900/40 px-2 py-1 rounded">{s}</span>)}</div>
              </div>
              <div>
                <div className="font-bold text-cyan-400 mb-1">Game Engines</div>
                <div className="flex flex-wrap gap-2 text-sm">{skills.gameEngines.map(s => <span key={s} className="bg-cyan-900/40 px-2 py-1 rounded">{s}</span>)}</div>
              </div>
              <div>
                <div className="font-bold text-cyan-400 mb-1">Developer Tools</div>
                <div className="flex flex-wrap gap-2 text-sm">{skills.devTools.map(s => <span key={s} className="bg-cyan-900/40 px-2 py-1 rounded">{s}</span>)}</div>
              </div>
              <div>
                <div className="font-bold text-cyan-400 mb-1">Libraries</div>
                <div className="flex flex-wrap gap-2 text-sm">{skills.libraries.map(s => <span key={s} className="bg-cyan-900/40 px-2 py-1 rounded">{s}</span>)}</div>
              </div>
            </div>
          </div>
        )
        break
      case "projects":
        title = "Projects"
        content = (
          <div className="space-y-6">
            {projects.map((proj, idx) => (
              <div key={idx} className="border border-cyan-400 p-4 rounded bg-black/60">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                  <div className="font-bold text-lg">{proj.name}</div>
                  <div className="text-xs text-gray-400">{proj.tech} | {proj.period}</div>
                </div>
                <ul className="list-disc ml-5 text-sm text-cyan-200">
                  {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )
        break
      case "experience":
        title = "Experience"
        content = (
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="border-l-4 border-cyan-400 pl-4 bg-black/60 rounded">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                  <div className="font-bold text-lg">{exp.role}</div>
                  <div className="text-xs text-gray-400">{exp.company} | {exp.location} | {exp.period}</div>
                </div>
                <ul className="list-disc ml-5 text-sm text-cyan-200">
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )
        break
      case "contact":
        title = "Contact"
        content = (
          <div>
            <div className="text-lg font-bold mb-4">ESTABLISH_CONNECTION</div>
            <div className="space-y-3">
              <div className="border border-cyan-400 p-3 text-center">
                <div className="text-sm mb-2">SECURE_CHANNELS_AVAILABLE</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>mmk28@sfu.ca</span>
                  </div>
                                     <div className="flex items-center justify-center gap-2">
                     <span>📱</span>
                     <span>672-667-2507</span>
                   </div>
                   <div className="flex items-center justify-center gap-2">
                     <span>🔗</span>
                     <span>github.com/Muneeb</span>
                   </div>
                   <div className="flex items-center justify-center gap-2">
                     <span>💼</span>
                     <span>linkedin.com/in/Muneeb</span>
                   </div>
                </div>
              </div>
              <div className="text-xs text-center">
                <div>RESPONSE_TIME: &lt; 24 hours</div>
                <div>AVAILABILITY: Open to opportunities</div>
                <div className="mt-2 text-cyan-400">Ready to collaborate on exciting projects!</div>
              </div>
            </div>
          </div>
        )
        break
      case "system":
        title = "System Monitor"
        content = (
          <div>
            <div className="text-lg font-bold mb-4">SYSTEM_METRICS</div>
            <div className="space-y-4">
              <div className="border border-cyan-400 p-3">
                <div className="flex justify-between items-center mb-2">
                  <span>CPU Usage</span>
                  <span>{cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${cpuUsage}%` }}></div>
                </div>
              </div>
              <div className="border border-cyan-400 p-3">
                <div className="flex justify-between items-center mb-2">
                  <span>Memory Usage</span>
                  <span>{memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${memoryUsage}%` }}></div>
                </div>
              </div>
              <div className="border border-cyan-400 p-3">
                <div className="flex justify-between items-center mb-2">
                  <span>Network Activity</span>
                  <span>{networkActivity} KB/s</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(networkActivity / 100, 100)}%` }}></div>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div>SYSTEM_STATUS: {systemStatus}</div>
                <div>UPTIME: 24/7</div>
                <div>SECURITY_LEVEL: MAXIMUM</div>
                <div>LAST_UPDATE: {currentTime.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )
        break
      case "education":
        title = "Education"
        content = (
          <div className="space-y-4">
            <div className="font-bold text-lg">{education.school} — {education.major}</div>
            <div className="text-sm text-gray-400">{education.degree}</div>
            <div className="text-sm text-gray-400">{education.location}</div>
            <div className="text-sm text-cyan-400">Graduation Date: {education.grad}</div>
          </div>
        )
        break
      case "games-folder":
        title = "Games"
        content = (
          <div className="p-4">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-cyan-400 mb-2">🎮 Game Center</div>
              <div className="text-sm text-gray-400">Click on a game to start playing!</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 cursor-pointer hover:bg-slate-700 hover:border-cyan-400 transition-all duration-200 text-center"
                onClick={() => setActiveGame("snake")}
              >
                <div className="text-4xl mb-2">🐍</div>
                <div className="font-bold text-cyan-400 mb-1">Snake</div>
                <div className="text-xs text-gray-400">Classic snake game</div>
                <div className="text-xs text-gray-500 mt-2">WASD to move</div>
              </div>
              
              <div 
                className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 cursor-pointer hover:bg-slate-700 hover:border-cyan-400 transition-all duration-200 text-center"
                onClick={() => setActiveGame("tetris")}
              >
                <div className="text-4xl mb-2">🟦</div>
                <div className="font-bold text-cyan-400 mb-1">Tetris</div>
                <div className="text-xs text-gray-400">Block stacking puzzle</div>
                <div className="text-xs text-gray-500 mt-2">Arrow keys to play</div>
              </div>
              
              <div 
                className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 cursor-pointer hover:bg-slate-700 hover:border-cyan-400 transition-all duration-200 text-center"
                onClick={() => {
                  const dice1 = Math.floor(Math.random() * 6) + 1
                  const dice2 = Math.floor(Math.random() * 6) + 1
                  alert(`🎲 Dice Roll: ${dice1} and ${dice2}\nTotal: ${dice1 + dice2}`)
                }}
              >
                <div className="text-4xl mb-2">🎲</div>
                <div className="font-bold text-cyan-400 mb-1">Dice Roll</div>
                <div className="text-xs text-gray-400">Roll two dice</div>
                <div className="text-xs text-gray-500 mt-2">Instant result</div>
              </div>
              
              <div 
                className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 cursor-pointer hover:bg-slate-700 hover:border-cyan-400 transition-all duration-200 text-center"
                onClick={() => {
                  const result = Math.random() < 0.5 ? "HEADS" : "TAILS"
                  alert(`🪙 Coin Flip Result: ${result}`)
                }}
              >
                <div className="text-4xl mb-2">🪙</div>
                <div className="font-bold text-cyan-400 mb-1">Coin Flip</div>
                <div className="text-xs text-gray-400">Flip a coin</div>
                <div className="text-xs text-gray-500 mt-2">Instant result</div>
              </div>
              
              <div 
                className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 cursor-pointer hover:bg-slate-700 hover:border-cyan-400 transition-all duration-200 text-center"
                onClick={() => {
                  const secretNumber = Math.floor(Math.random() * 100) + 1
                  const guess = prompt("🎲 Number Guessing Game\nI'm thinking of a number between 1 and 100.\nEnter your guess:")
                  if (guess) {
                    const numGuess = parseInt(guess)
                    if (numGuess === secretNumber) {
                      alert("🎉 Congratulations! You guessed it!")
                    } else if (numGuess < secretNumber) {
                      alert(`Too low! The number was ${secretNumber}`)
                    } else {
                      alert(`Too high! The number was ${secretNumber}`)
                    }
                  }
                }}
              >
                <div className="text-4xl mb-2">🎯</div>
                <div className="font-bold text-cyan-400 mb-1">Number Guess</div>
                <div className="text-xs text-gray-400">Guess the number</div>
                <div className="text-xs text-gray-500 mt-2">1-100 range</div>
              </div>
              
              <div 
                className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 cursor-pointer hover:bg-slate-700 hover:border-cyan-400 transition-all duration-200 text-center"
                onClick={() => {
                  const choices = ["rock", "paper", "scissors"]
                  const computerChoice = choices[Math.floor(Math.random() * 3)]
                  const userChoice = prompt("✂️ Rock, Paper, Scissors\nEnter your choice (rock/paper/scissors):")
                  if (userChoice && choices.includes(userChoice.toLowerCase())) {
                    const user = userChoice.toLowerCase()
                    let result = ""
                    if (user === computerChoice) {
                      result = "It's a tie!"
                    } else if (
                      (user === "rock" && computerChoice === "scissors") ||
                      (user === "paper" && computerChoice === "rock") ||
                      (user === "scissors" && computerChoice === "paper")
                    ) {
                      result = "You win!"
                    } else {
                      result = "Computer wins!"
                    }
                    alert(`You chose: ${user}\nComputer chose: ${computerChoice}\n\n${result}`)
                  }
                }}
              >
                <div className="text-4xl mb-2">✂️</div>
                <div className="font-bold text-cyan-400 mb-1">RPS</div>
                <div className="text-xs text-gray-400">Rock, Paper, Scissors</div>
                <div className="text-xs text-gray-500 mt-2">Beat the computer</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-400 mb-2">🎮 All games feature:</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Full 2D gameplay for Snake & Tetris</div>
                <div>• Score tracking and levels</div>
                <div>• Keyboard controls (WASD/Arrow Keys)</div>
                <div>• Instant results for simple games</div>
              </div>
            </div>
          </div>
        )
        break
      default:
        return
    }

    const newWindow: Window = {
      id: windowId,
      title,
      content,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      size: { width: 500, height: 400 },
      zIndex: Math.max(...windows.map(w => w.zIndex), 0) + 1
    }

    setWindows([...windows, newWindow])
    setActiveWindowId(windowId)
  }

  const closeWindow = (windowId: string) => {
    setWindows(windows.filter(w => w.id !== windowId))
    if (activeWindowId === windowId) {
      setActiveWindowId(null)
    }
  }

  const minimizeWindow = (windowId: string) => {
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ))
    if (activeWindowId === windowId) {
      setActiveWindowId(null)
    }
  }

  const maximizeWindow = (windowId: string) => {
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }

  const bringToFront = (windowId: string) => {
    setActiveWindowId(windowId)
    setWindows(windows.map(w => 
      w.id === windowId 
        ? { ...w, zIndex: Math.max(...windows.map(w => w.zIndex)) + 1 }
        : w
    ))
  }

  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    e.stopPropagation()
    bringToFront(windowId)
    setDraggedWindow(windowId)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedWindow) {
      setWindows(windows.map(w => 
        w.id === draggedWindow && !w.isMaximized
          ? {
              ...w,
              position: {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
              }
            }
          : w
      ))
    }
  }

  const handleMouseUp = () => {
    setDraggedWindow(null)
  }

  const renderWindow = (window: Window) => {
    if (window.isMinimized) return null

    const isActive = activeWindowId === window.id;
    const windowStyle = {
      position: 'absolute' as const,
      left: window.isMaximized ? 0 : window.position.x,
      top: window.isMaximized ? 60 : window.position.y,
      width: window.isMaximized ? '100vw' : window.size.width,
      height: window.isMaximized ? 'calc(100vh - 60px)' : window.size.height,
      zIndex: isActive ? 9999 : window.zIndex,
      pointerEvents: 'auto' as const,
    }

    return (
      <Card 
        key={window.id}
        style={windowStyle}
        className={`bg-gray-800 border-2 ${activeWindowId === window.id ? "border-cyan-400" : "border-gray-600"} font-mono cursor-default ${glitchEffect ? 'animate-pulse' : ''}`}
        onMouseDown={(e) => handleMouseDown(e, window.id)}
      >
        <div
          className={`${activeWindowId === window.id ? "bg-cyan-400" : "bg-gray-600"} text-black px-3 py-1 flex items-center justify-between text-sm font-bold cursor-move`}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>{window.title}</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-yellow-400"
              onClick={() => minimizeWindow(window.id)}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-cyan-400"
              onClick={() => maximizeWindow(window.id)}
            >
              <Square className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 hover:bg-red-400"
              onClick={() => closeWindow(window.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div 
          className="p-4 text-cyan-400 overflow-auto" 
          style={{ height: 'calc(100% - 40px)' }}
        >
          {window.content}
        </div>
      </Card>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-cyan-100 font-mono relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => setShowStartMenu(false)}
    >
      {/* SECURE SYSTEM LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-black z-[9999] flex flex-col items-center justify-center overflow-hidden">
          {/* SUBTLE SCANNING EFFECT */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent bg-[length:100%_3px] animate-pulse"></div>
          </div>
          
          {/* SYSTEM LOGO */}
          <div className="text-6xl font-bold text-cyan-400 mb-8 drop-shadow-lg shadow-cyan-400/30 font-mono">
            <div className="text-center">
              <div className="text-3xl mb-2 text-cyan-300">SECURE</div>
              <div className="text-5xl">SYSTEM</div>
              <div className="text-xl mt-2 text-cyan-200">INITIALIZING</div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="text-lg text-cyan-300 mb-8 font-mono text-center max-w-md">
            {loadingText}
          </div>
          
          {/* Progress Bar */}
          <div className="w-96 bg-black/50 backdrop-blur-sm border border-cyan-500/50 h-6 mb-6 rounded-sm">
            <div 
              className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 h-full transition-all duration-300 ease-out shadow-lg shadow-cyan-500/30"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-cyan-400 font-mono text-lg font-bold">
            PROGRESS: {loadingProgress}%
          </div>
          
          {/* SUBTLE BORDER SCAN */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      )}

      {/* System Boot Reveal Effect */}
      {!isLoading && bootProgress < 100 && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-[9998] transition-opacity duration-1500 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - (bootProgress / 100)) }}
        >
          {/* Boot completion effect */}
          <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent"></div>
        </div>
      )}
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(6,182,212,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      {/* Top Status Bar */}
      <div className="relative z-50 bg-gray-800 border-b-2 border-cyan-400 px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-cyan-300 hover:bg-cyan-600 hover:text-white border border-cyan-400 px-3 py-1"
            onClick={(e) => {
              e.stopPropagation()
              setShowStartMenu(!showStartMenu)
            }}
          >
            <Home className="w-4 h-4 mr-2" />
            START
          </Button>
          <span className="text-cyan-300">root@ai-system:~$</span>
          <span className="text-slate-300">SECURE_CONNECTION_ESTABLISHED</span>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4 text-cyan-300" />
            <span className="text-cyan-300">{systemStatus}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Cpu className="w-4 h-4 text-cyan-300" />
            <span className="text-slate-200">{cpuUsage}%</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="w-4 h-4 text-cyan-300" />
            <span className="text-slate-200">{memoryUsage}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Upload className="w-4 h-4 text-cyan-300" />
            <span className="text-slate-200">{networkActivity}KB/s</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-4 h-4 text-cyan-300" />
            <span className="text-slate-200">CONNECTED</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery className="w-4 h-4 text-cyan-300" />
            <span className="text-slate-200">100%</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="w-4 h-4 text-cyan-300" />
            <span className="text-slate-200">ON</span>
          </div>
          <span className="text-slate-200">{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div className="absolute z-40 left-0 top-12 bg-gray-800 border-2 border-cyan-400 p-2 min-w-48 shadow-lg">
          <div className="space-y-1">
            {desktopIcons.map(icon => (
              <Button
                key={icon.id}
                variant="ghost"
                className="w-full justify-start text-cyan-400 hover:bg-cyan-600 hover:text-white border border-transparent hover:border-cyan-400"
                onClick={() => {
                  openWindow(icon.windowId)
                  setShowStartMenu(false)
                }}
              >
                {icon.icon}
                <span className="ml-2">{icon.title}</span>
              </Button>
            ))}
            <div className="border-t border-cyan-400 my-2"></div>
            <Button
              variant="ghost"
              className="w-full justify-start text-cyan-400 hover:bg-cyan-600 hover:text-white border border-transparent hover:border-cyan-400"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="relative z-10 pt-4">
        {desktopIcons.map(icon => (
          <div
            key={icon.id}
            className="absolute cursor-pointer text-center w-20"
            style={{ left: icon.position.x, top: icon.position.y }}
            onDoubleClick={() => openWindow(icon.windowId)}
          >
            <div className="text-cyan-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
              {icon.icon}
            </div>
            <div className="text-xs mt-1 text-cyan-400 bg-black bg-opacity-50 px-1 rounded">
              {icon.title}
            </div>
          </div>
        ))}
        {/* Add Games folder icon */}
        <div
          className="absolute cursor-pointer text-center w-20"
          style={{ left: 50, top: 470 }}
          onDoubleClick={() => openWindow("games-folder")}
        >
          <div className="text-cyan-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <Folder className="w-8 h-8" />
          </div>
          <div className="text-xs mt-1 text-cyan-400 bg-black bg-opacity-50 px-1 rounded">
            Games
          </div>
        </div>
        {/* Add Education icon */}
        <div
          className="absolute cursor-pointer text-center w-20"
          style={{ left: 50, top: 610 }}
          onDoubleClick={() => openWindow("education")}
        >
          <div className="text-cyan-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <FileText className="w-8 h-8" />
          </div>
          <div className="text-xs mt-1 text-cyan-400 bg-black bg-opacity-50 px-1 rounded">
            Education
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {windows.length === 0 && (
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <div className="mb-6">
            <img 
              src="/muneeb-photo.jpg.jpeg" 
              alt="Muneeb Kamran" 
              className="w-40 h-40 rounded-xl border-4 border-cyan-400 mx-auto shadow-lg"
              onError={(e) => {
                console.log('Image failed to load:', e);
              }}
            />
          </div>
          <div className="text-3xl font-bold mb-4 text-cyan-400">
            MUNEEB KAMRAN
          </div>
          <div className="text-lg text-gray-300 mb-3">
            Computer Science Student & Full-Stack Developer
          </div>
          <div className="text-sm text-cyan-300 mb-6 max-w-sm mx-auto">
            Double-click the Games folder to play 2D games, or use the terminal for more commands
          </div>
          <div className="mt-4">
            <Button
              onClick={() => setShowTerminal(!showTerminal)}
              className="bg-cyan-400 text-black hover:bg-cyan-300 px-6 py-2 text-sm font-semibold border-2 border-cyan-600 shadow-md transition-all duration-200"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Toggle Terminal
            </Button>
          </div>
        </div>
      )}

      {/* Windows */}
      {windows.map(renderWindow)}

      {/* Game Windows */}
      {activeGame === "snake" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/20 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold">
              <span>🐍 Snake Game</span>
              <button 
                onClick={() => setActiveGame(null)}
                className="hover:bg-cyan-700 px-2 rounded transition-colors"
              >
                ×
              </button>
            </div>
            <SnakeGame onClose={() => setActiveGame(null)} />
          </div>
        </div>
      )}

      {activeGame === "tetris" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/20 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold">
              <span>🟦 Tetris</span>
              <button 
                onClick={() => setActiveGame(null)}
                className="hover:bg-cyan-700 px-2 rounded transition-colors"
              >
                ×
              </button>
            </div>
            <TetrisGame onClose={() => setActiveGame(null)} />
          </div>
        </div>
      )}

      {/* Terminal Box */}
      {showTerminal && (
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-slate-900/95 backdrop-blur-md border-2 border-cyan-400/80 z-50 w-[750px] h-[750px] shadow-2xl rounded-xl shadow-cyan-400/20">
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-sm rounded-t-lg">
            <span>AI Terminal</span>
                          <button 
                onClick={() => setShowTerminal(false)}
                className="hover:bg-cyan-700 px-2 rounded transition-colors"
              >
              ×
            </button>
          </div>
          <div className="h-[620px] overflow-auto p-3 font-mono text-sm text-slate-200 bg-slate-900">
            <div className="mb-2 text-cyan-300">
              ╔══════════════════════════════════════╗
              ║ MUNEEB KAMRAN - AI SYSTEM v3.0      ║
              ║ Type 'help' for available commands   ║
              ╚══════════════════════════════════════╝
            </div>
            {terminalHistory.map((cmd, index) => (
              <div key={index} className="mb-2">
                <div>
                  <span className="text-cyan-300">root@ai-system:~$</span> {cmd.command}
                </div>
                {cmd.output && (
                  <div className="text-slate-300 whitespace-pre-wrap ml-4">
                    {cmd.output}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-cyan-400 bg-slate-800">
            <div className="flex items-center">
              <span className="text-cyan-300 mr-2">root@ai-system:~/{
                currentDirectory === "root" ? "" : 
                currentDirectory === "navigation" ? "navigation" : 
                currentDirectory === "utilities" ? "utilities" : ""
              }$</span>
              <input
                ref={terminalInputRef}
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent text-slate-200 font-mono px-2 py-1 outline-none placeholder-slate-400"
                spellCheck={false}
                placeholder="Type a command..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && terminalInput.trim()) {
                    executeCommand(terminalInput);
                    setTerminalInput("");
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-cyan-400 px-4 py-2 flex items-center gap-2">
        {windows.filter(w => w.isOpen).map(window => (
          <Button
            key={window.id}
            variant="ghost"
            size="sm"
            className={`text-xs ${activeWindowId === window.id ? "bg-cyan-400 text-black" : "text-cyan-400 hover:bg-cyan-600 hover:text-white"}`}
            onClick={() => {
              if (window.isMinimized) {
                setWindows(windows.map(w => 
                  w.id === window.id ? { ...w, isMinimized: false } : w
                ))
              }
              bringToFront(window.id)
            }}
          >
            {window.title}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-cyan-400 hover:bg-cyan-600 hover:text-white"
          onClick={() => setShowTerminal(!showTerminal)}
        >
          Terminal
        </Button>
      </div>
    </div>
  )
}

