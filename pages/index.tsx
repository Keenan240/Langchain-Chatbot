import { useState, useRef, useEffect  } from 'react'
import '../styles/style.css'

interface Message {
  text: string
}

export default function Home() {
  const [url] = useState('https://www.209nycdental.com/')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const handleAsk = async () => {
    if (!question.trim()) return

    const newMessages: Message[] = [...messages, { text: question }]
    setMessages(newMessages)

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, question }),
    })

    const data = await res.json()

    setMessages([...newMessages, { text: data.answer }])
    setQuestion('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAsk()
  }

  const bottomRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  

  return (
    <main style={{maxWidth: '700px', margin: 'auto' }}>
      <h1 className="title">Auxio.AI</h1>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${index % 2 === 0 ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          className="messageBox"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask us a question"
        />
      </form>
    </main>
  )
}
