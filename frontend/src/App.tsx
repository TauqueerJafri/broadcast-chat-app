import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); //intialize a ws server at first render

    ws.onmessage = (e) => {
      setMessages(m => [...m, e.data])
    }

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }

    return () => {
      ws.close()
    }
  }, []); //dependency array empty -> on Mount effect

  return (
    <div className='app-shell'>
      <main className='chat-panel'>

        <header className='panel-header'>
          <div>
            <h1> Chat App</h1>
            <p> Send a message to everyone in the room</p>
          </div>
        </header>

        <section className='message-list'>
          {messages.length === 0 ? (
            <div className='empty-state'> Begin with a greeting...</div>
          ) : (
            messages.map((message, index) => (
              <article key={index} className="message-bubble">
                <span>{message}</span>
              </article>
            ))
          )}
        </section>

        <div className='composer'>
          <input ref={inputRef} id='message' className='composer-input' placeholder='Send a sakura-soft note..'/>
          <button className='composer-button' 
          onClick={() => {
            const message = inputRef.current?.value;
            wsRef.current?.send(
              JSON.stringify({
                type: 'chat',
                payload: {
                  message: message
                }
              })
            )
          }}>
            Send
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
