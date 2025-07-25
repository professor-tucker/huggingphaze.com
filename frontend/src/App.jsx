import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { MoreHorizontal, Send } from 'lucide-react'
import './App.css'

// Import assets
import logoImg from './assets/logo.png'
import contentGenIcon from './assets/content-generation-icon.png'
import documentInsightsIcon from './assets/document-insights-icon.png'
import aiWorkflowsIcon from './assets/ai-workflows-icon.png'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSample, setCurrentSample] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [complexityLevel, setComplexityLevel] = useState('green') // green, amber, red
  const [error, setError] = useState('')

  const samplePrompts = [
    "Generate 5 marketing headlines for a new AI startup...",
    "Summarize this research paper on machine learning...",
    "Draft an email to a potential client about our services...",
    "Create a product description for an AI-powered tool...",
    "Write a blog post about the future of artificial intelligence..."
  ]

  // Cycle through sample prompts
  useEffect(() => {
    if (prompt === '') {
      const interval = setInterval(() => {
        setCurrentSample((prev) => (prev + 1) % samplePrompts.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [prompt, samplePrompts.length])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        setResponse(data.response)
      } else {
        setError(data.message || 'An error occurred while generating the response.')
      }
    } catch (err) {
      // Fallback to simulated response if backend is not available
      setResponse(`AI Response: This is a simulated response to your prompt: "${prompt}". The backend API is currently not available, but in the full implementation, this would connect to the Hugging Face Inference API to generate actual AI responses.`)
    } finally {
      setIsLoading(false)
    }
  }

  const getComplexityClass = () => {
    switch (complexityLevel) {
      case 'amber': return 'complexity-amber'
      case 'red': return 'complexity-red'
      default: return 'complexity-green'
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-500">
      {/* Hero Section */}
      <div className="hero-bg min-h-screen flex flex-col items-center justify-center relative">
        {/* Logo */}
        <div className="mb-8">
          <img src={logoImg} alt="Huggingphaze.com" className="h-20 w-auto glow-effect" />
        </div>

        {/* Main Prompt Box */}
        <div className="w-full max-w-2xl px-4 relative">
          <form onSubmit={handleSubmit} className="relative">
            <div className={`relative border-2 rounded-lg p-4 bg-black/80 backdrop-blur-sm ${getComplexityClass()}`}>
              {/* Ellipsis Menu */}
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onMouseEnter={() => setShowMenu(true)}
                  onMouseLeave={() => setShowMenu(false)}
                  className="text-green-500 hover:text-green-400 p-2"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {showMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-black border border-green-500 rounded-lg p-4 min-w-48 z-10">
                    <div className="space-y-2 text-sm">
                      <a href="#about" className="block hover:text-green-400">About</a>
                      <a href="#use-cases" className="block hover:text-green-400">Use Cases</a>
                      <a href="#pricing" className="block hover:text-green-400">Pricing</a>
                      <a href="#documentation" className="block hover:text-green-400">Documentation</a>
                      <a href="#login" className="block hover:text-green-400">Login/Signup</a>
                      <hr className="border-green-500/30" />
                      <a 
                        href="https://cash.app/$leepingsilverback" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block hover:text-green-400 font-bold"
                      >
                        💚 Donate
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={prompt === '' ? samplePrompts[currentSample] : ''}
                className="bg-transparent border-none text-green-500 placeholder-green-500/60 text-lg pr-12 focus:ring-0"
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500 blinking-cursor">|</span>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !prompt.trim()}
                  className="bg-green-500 text-black hover:bg-green-400"
                >
                  {isLoading ? 'Generating...' : <Send size={16} />}
                </Button>
              </div>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 backdrop-blur-sm border border-red-500 rounded-lg">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {/* Response Area */}
          {response && !error && (
            <div className="mt-6 p-4 bg-black/80 backdrop-blur-sm border border-green-500 rounded-lg">
              <p className="text-green-500">{response}</p>
            </div>
          )}
        </div>
      </div>

      {/* Use Cases Section */}
      <div id="use-cases" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 glow-effect">
            Powerful AI Made Simple
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Content Generation */}
            <Card className="bg-black/80 border-green-500 card-hover">
              <CardHeader className="text-center">
                <img src={contentGenIcon} alt="Content Generation" className="h-16 w-16 mx-auto mb-4" />
                <CardTitle className="text-green-500">Content Generation</CardTitle>
                <CardDescription className="text-green-500/80">
                  Create compelling marketing copy, blog posts, and creative content with AI assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-green-500/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Marketing Headlines</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>Blog Articles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Product Descriptions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Insights */}
            <Card className="bg-black/80 border-amber-500 card-hover">
              <CardHeader className="text-center">
                <img src={documentInsightsIcon} alt="Document Insights" className="h-16 w-16 mx-auto mb-4" />
                <CardTitle className="text-amber-500">Document Insights</CardTitle>
                <CardDescription className="text-amber-500/80">
                  Extract key information and insights from documents, reports, and research papers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-amber-500/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span>Document Summarization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>Key Point Extraction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Research Analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Workflows */}
            <Card className="bg-black/80 border-red-500 card-hover">
              <CardHeader className="text-center">
                <img src={aiWorkflowsIcon} alt="AI Workflows" className="h-16 w-16 mx-auto mb-4" />
                <CardTitle className="text-red-500">Custom AI Workflows</CardTitle>
                <CardDescription className="text-red-500/80">
                  Build sophisticated AI-powered workflows and automation for complex business processes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-red-500/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Multi-step Processes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>Data Integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Custom Solutions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-green-500/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-green-500/60">
            © 2025 Huggingphaze.com - Making AI Accessible to Everyone
          </p>
          <p className="text-green-500/40 text-sm mt-2">
            Powered by Hugging Face • Built with ❤️ for non-technical users
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

