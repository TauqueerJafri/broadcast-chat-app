import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const canJoin = name.trim().length > 0 && roomId.trim().length > 0;

  function handleJoin(e?: FormEvent) {
    e?.preventDefault();
    
    if (!canJoin) return;
    
    navigate(`/chat/${encodeURIComponent(roomId.trim())}`, { state: { name: name.trim() } });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <form
        onSubmit={handleJoin}
        className="glass-panel relative flex flex-col w-full max-w-md rounded-[22px] overflow-hidden px-10 py-12"
      >
        <h1 className="m-0 text-[1.75rem] font-semibold tracking-tight">
          Join a Room
        </h1>
        <p className="mt-2 mb-7 text-[0.95rem] text-[#4c5a6a]">
          Enter a room name to start chatting
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-500 pl-1">Name</span>
            <input
              className="glass-input px-4 py-3 rounded-[14px] text-base text-inherit"
              placeholder="Your name…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-500 pl-1">Room</span>
            <input
              className="glass-input px-4 py-3 rounded-[14px] text-base text-inherit"
              placeholder="Room name…"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={!canJoin}
          className="glass-button mt-6 w-full py-3.5 rounded-[14px] border-none font-semibold tracking-[0.01em] text-[#2f3640] cursor-pointer hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed text-[0.95rem]"
        >
          Join
        </button>
      </form>
    </div>
  );
}
