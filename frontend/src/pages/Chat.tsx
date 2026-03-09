import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  
  // Extract the roomId from the URL parameters
  const { roomId } = useParams<{ roomId: string }>();

  // Get the user's name from location state
  const location = useLocation();
  const name = (location.state as { name?: string })?.name || "Anonymous";

  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    const ws = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", payload: { roomId } }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [...prev, { sender: data.name, text: data.message, time }]);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [roomId, navigate]);

  function handleSend() {
    const text = inputRef.current?.value;

    if (!text?.trim() || wsRef.current?.readyState !== WebSocket.OPEN) return;
    
    wsRef.current.send(JSON.stringify({ type: "chat", payload: { message: text.trim(), name } }));
    inputRef.current!.value = "";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <main className="glass-panel relative flex flex-col w-full max-w-170 h-auto min-h-130 sm:h-[clamp(540px,80vh,720px)] rounded-[22px] overflow-hidden">
        <header className="relative p-6 sm:px-8 sm:pt-6 sm:pb-5 flex items-center gap-4.5 border-b border-slate-400/20">
          <div className="flex-1">
            <h1 className="m-0 text-[1.75rem] font-semibold tracking-tight">Room: {roomId}</h1>
            <p className="mt-1.5 mb-0 text-[0.95rem] text-[#4c5a6a]">Send a message to everyone in the room</p>
          </div>
          <button
            className="glass-button text-[0.85rem] px-4 py-2 rounded-[14px] border-none font-semibold tracking-[0.01em] text-[#2f3640] cursor-pointer hover:text-gray-900"
            onClick={() => navigate("/")}
          >
            Leave
          </button>
        </header>

        <section className="message-scroll flex-1 overflow-y-auto flex flex-col justify-end gap-4 p-6 sm:p-8 bg-linear-to-b from-white/30 to-slate-100/10">
          {messages.length === 0 ? (
            <p className="text-center text-slate-500 italic text-[0.95rem]">Begin with a greeting…</p>
          ) : (
            messages.map((msg, i) => (
              <article key={i} className="glass-bubble self-start max-w-[80%] px-4.5 py-3 rounded-[18px] text-slate-900">
                <span className="block text-xs font-semibold text-blue-500 mb-0.5">{msg.sender}</span>
                <span>{msg.text}</span>
                <span className="text-[0.7rem] text-slate-500 ml-2">{msg.time}</span>
              </article>
            ))
          )}
        </section>

        <div className="px-5.5 pt-4.5 pb-6 sm:px-7 sm:pt-5 sm:pb-7 bg-linear-to-b from-[rgba(246,248,252,0.55)] to-[rgba(246,248,252,0.32)] border-t border-slate-400/20 flex gap-4 items-center">
          <input
            ref={inputRef}
            className="glass-input flex-1 px-4 py-3 rounded-[14px] text-base text-inherit"
            placeholder="Type a message…"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="glass-button px-5.5 py-3 rounded-[14px] border-none font-semibold tracking-[0.01em] text-[#2f3640] cursor-pointer hover:text-gray-900"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
