import { useState } from "react";
import { useApp } from "../context/AppContext";
import { languages } from "../data/mock";

export default function Header() {
  const { currentUser, language, setLanguage, voiceEnabled, toggleVoice, isOnline, setSosOpen, setSidebarOpen, tr, setCurrentUser, setCurrentPage } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  if (!currentUser) return null;

  const currentLang = languages.find((l) => l.code === language);

  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center px-4 gap-3 sticky top-0 z-20">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden p-1.5 rounded hover:bg-stone-100"
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="#44403c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Page title - filled by child, just show facility */}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-stone-400 font-mono hidden sm:inline">Bhimpur PHC · Wardha, Maharashtra</span>
      </div>

      {/* Offline/Online badge */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isOnline ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
        <span className="hidden sm:inline">{isOnline ? tr("online") : tr("offline")}</span>
      </div>

      {/* Voice toggle */}
      <button
        onClick={toggleVoice}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
          voiceEnabled ? "bg-teal-100 text-teal-700" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
        }`}
        title={voiceEnabled ? tr("voiceOn") : tr("voiceOff")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={voiceEnabled ? "#0f766e" : "#78716c"} />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke={voiceEnabled ? "#0f766e" : "#78716c"} strokeWidth="2" strokeLinecap="round" />
        </svg>
        {voiceEnabled && <span className="voice-blink hidden sm:inline">●</span>}
      </button>

      {/* Language selector */}
      <div className="relative">
        <button
          onClick={() => setLangOpen((o) => !o)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
        >
          <span>🌐</span>
          <span>{currentLang?.native ?? "EN"}</span>
        </button>
        {langOpen && (
          <div className="absolute right-0 top-9 bg-white border border-stone-200 rounded-lg shadow-lg py-1 w-40 z-50">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-stone-50 flex items-center justify-between ${
                  language === l.code ? "text-teal-700 font-semibold" : "text-stone-700"
                }`}
              >
                <span>{l.native}</span>
                {language === l.code && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SOS Button */}
      <button
        onClick={() => setSosOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700 transition-colors"
      >
        <span>🆘</span>
        <span className="hidden sm:inline">SOS</span>
      </button>

      {/* Logout */}
      <button
        onClick={() => { setCurrentUser(null); setCurrentPage("dashboard"); }}
        className="p-1.5 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        title="Logout"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </header>
  );
}
