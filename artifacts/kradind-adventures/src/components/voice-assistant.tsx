"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Compass,
  ArrowRight,
  Search,
  Volume2,
  VolumeX,
  PhoneCall,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Web Speech API Types
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface CommandMatch {
  intent: string;
  destinationUrl: string;
  responseSpeech: string;
  icon: string;
}

const VOICE_CHIPS = [
  { label: "🏔️ Treks", command: "treks" },
  { label: "🚗 Domestic Tours", command: "domestic tours" },
  { label: "📍 Destinations", command: "destinations" },
  { label: "💍 Honeymoon Packages", command: "honeymoon" },
  { label: "⚡ Weekend Treks", command: "weekend treks" },
  { label: "❄️ Snow Treks", command: "snow treks" },
  { label: "🌴 Kerala", command: "kerala" },
  { label: "🏔️ Kashmir", command: "kashmir" },
  { label: "🏰 Rajasthan", command: "rajasthan" },
  { label: "⛺ Kedarkantha", command: "kedarkantha trek" },
  { label: "🌸 Valley of Flowers", command: "valley of flowers" },
  { label: "📞 Call Helpline", command: "call" },
];

export function VoiceAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [supportSpeech, setSupportSpeech] = useState(true);
  const [manualText, setManualText] = useState("");

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSupportSpeech(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN"; // Default to Indian English, compatible with international English

        recognition.onstart = () => {
          setIsListening(true);
          setFeedbackMessage("Listening... Speak now");
        };

        recognition.onresult = (event: any) => {
          let currentInterim = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          setInterimTranscript(currentInterim);
          if (finalTranscript) {
            setTranscript(finalTranscript);
            handleExecuteVoiceCommand(finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setFeedbackMessage("Microphone permission denied. Tap a quick chip below or type.");
          } else if (event.error === "no-speech") {
            setFeedbackMessage("No speech detected. Please tap the mic and try again.");
          } else {
            setFeedbackMessage("Could not hear clearly. Please tap the mic or try again.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Speech Recognition setup error:", err);
        setSupportSpeech(false);
      }
    }
  }, []);

  // Listen to custom event from Header voice button if fired
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      setTimeout(() => startListening(), 200);
    };

    window.addEventListener("open-voice-assistant", handleTrigger);
    return () => {
      window.removeEventListener("open-voice-assistant", handleTrigger);
    };
  }, []);

  const speakText = (text: string) => {
    if (soundEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.lang = "en-IN";
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // Ignore speech synthesis failures
      }
    }
  };

  const startListening = () => {
    setTranscript("");
    setInterimTranscript("");
    setFeedbackMessage("Listening for travel commands...");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  // Voice Command Parser & Navigation Logic
  const handleExecuteVoiceCommand = (command: string) => {
    const clean = command.toLowerCase().trim();
    let match: CommandMatch | null = null;

    // 1. Honeymoon / Romantic
    if (
      clean.includes("honeymoon") ||
      clean.includes("romantic") ||
      clean.includes("couple")
    ) {
      match = {
        intent: "Honeymoon & Romantic Packages",
        destinationUrl: "/domestic-trips?q=honeymoon",
        responseSpeech: "Finding romantic honeymoon packages in Kashmir, Kerala and Himachal for you!",
        icon: "💍",
      };
    }
    // 2. Trek / Treks / Hiking / Himalayas
    else if (
      clean === "trek" ||
      clean === "treks" ||
      clean.includes("hiking") ||
      clean.includes("mountain trek") ||
      clean.includes("all treks")
    ) {
      match = {
        intent: "All Himalayan Treks",
        destinationUrl: "/treks",
        responseSpeech: "Opening all Himalayan trekking packages!",
        icon: "🏔️",
      };
    }
    // 3. Tour / Domestic / Trips / Holidays
    else if (
      clean === "tour" ||
      clean === "tours" ||
      clean.includes("domestic") ||
      clean.includes("package") ||
      clean.includes("holidays") ||
      clean.includes("trips")
    ) {
      match = {
        intent: "Domestic Tour Packages",
        destinationUrl: "/domestic-trips",
        responseSpeech: "Opening curated India domestic tour packages!",
        icon: "🚗",
      };
    }
    // 4. Destination / Destinations
    else if (
      clean.includes("destination") ||
      clean.includes("places to visit") ||
      clean.includes("where to go")
    ) {
      match = {
        intent: "All Travel Destinations",
        destinationUrl: "/destinations",
        responseSpeech: "Exploring all top travel destinations in India and beyond!",
        icon: "📍",
      };
    }
    // 5. Weekend Trips
    else if (clean.includes("weekend") || clean.includes("short trip")) {
      match = {
        intent: "Weekend Getaways & Treks",
        destinationUrl: "/treks?filter=weekend",
        responseSpeech: "Showing quick weekend treks and short 2 to 3 day getaways!",
        icon: "⚡",
      };
    }
    // 6. Snow / Winter Treks
    else if (clean.includes("snow") || clean.includes("winter")) {
      match = {
        intent: "Winter Snow Treks",
        destinationUrl: "/adventure-tours/snow-treks",
        responseSpeech: "Taking you to winter snow trails and crampon expeditions!",
        icon: "❄️",
      };
    }
    // 7. Specific Destinations
    else if (clean.includes("kashmir")) {
      match = {
        intent: "Kashmir Tour & Treks",
        destinationUrl: "/destinations/kashmir",
        responseSpeech: "Taking you to Kashmir tour packages and great lakes!",
        icon: "❄️",
      };
    } else if (clean.includes("ladakh") || clean.includes("leh")) {
      match = {
        intent: "Ladakh Expeditions",
        destinationUrl: "/destinations/ladakh",
        responseSpeech: "Opening Ladakh high-altitude circuits and monasteries!",
        icon: "🏔️",
      };
    } else if (clean.includes("kerala") || clean.includes("alleppey") || clean.includes("munnar")) {
      match = {
        intent: "Kerala Backwaters & Hills",
        destinationUrl: "/destinations/kerala",
        responseSpeech: "Taking you to Kerala backwaters and Munnar packages!",
        icon: "🌴",
      };
    } else if (clean.includes("goa") || clean.includes("beach")) {
      match = {
        intent: "Goa Beach Holidays",
        destinationUrl: "/destinations/goa",
        responseSpeech: "Opening Goa beach tours and coastal holidays!",
        icon: "🌊",
      };
    } else if (clean.includes("rajasthan") || clean.includes("jaipur") || clean.includes("udaipur")) {
      match = {
        intent: "Rajasthan Royal Heritage",
        destinationUrl: "/destinations/rajasthan",
        responseSpeech: "Taking you to Rajasthan royal forts and desert safaris!",
        icon: "🏰",
      };
    } else if (clean.includes("uttarakhand") || clean.includes("rishikesh") || clean.includes("dehradun")) {
      match = {
        intent: "Uttarakhand Treks & Tours",
        destinationUrl: "/destinations/uttarakhand",
        responseSpeech: "Opening Uttarakhand holy circuits and Himalayan bugyals!",
        icon: "🏔️",
      };
    } else if (clean.includes("himachal") || clean.includes("manali") || clean.includes("spiti")) {
      match = {
        intent: "Himachal Pradesh Tours",
        destinationUrl: "/destinations/himachal-pradesh",
        responseSpeech: "Showing Himachal Pradesh valleys, Manali and Spiti tours!",
        icon: "🌲",
      };
    } else if (clean.includes("nepal") || clean.includes("everest") || clean.includes("annapurna")) {
      match = {
        intent: "Nepal Expeditions",
        destinationUrl: "/destinations/nepal",
        responseSpeech: "Taking you to Nepal Himalayan packages and stupas!",
        icon: "🇳🇵",
      };
    }
    // 8. Specific Famous Treks
    else if (clean.includes("kedarkantha")) {
      match = {
        intent: "Kedarkantha Winter Summit",
        destinationUrl: "/treks/kedarkantha",
        responseSpeech: "Opening the famous Kedarkantha snow trek!",
        icon: "❄️",
      };
    } else if (clean.includes("har ki dun") || clean.includes("har ki doon")) {
      match = {
        intent: "Har Ki Dun Valley of Gods",
        destinationUrl: "/treks/har-ki-dun",
        responseSpeech: "Opening Har Ki Dun cradle shaped valley trek!",
        icon: "🏔️",
      };
    } else if (clean.includes("hampta pass") || clean.includes("hamta")) {
      match = {
        intent: "Hampta Pass Crossover",
        destinationUrl: "/treks/hampta-pass",
        responseSpeech: "Opening Hampta Pass crossover from Manali to Spiti!",
        icon: "🏔️",
      };
    } else if (clean.includes("valley of flowers") || clean.includes("hemkund")) {
      match = {
        intent: "Valley of Flowers & Hemkund",
        destinationUrl: "/treks/valley-of-flowers",
        responseSpeech: "Opening UNESCO World Heritage Valley of Flowers trek!",
        icon: "🌸",
      };
    } else if (clean.includes("brahmatal")) {
      match = {
        intent: "Brahmatal Frozen Lake Trek",
        destinationUrl: "/treks/brahmatal",
        responseSpeech: "Opening Brahmatal ridge and frozen lake trek!",
        icon: "💎",
      };
    }
    // 9. Call / Contact / Help
    else if (
      clean.includes("call") ||
      clean.includes("phone") ||
      clean.includes("helpline") ||
      clean.includes("contact")
    ) {
      match = {
        intent: "Direct Call Desk",
        destinationUrl: "tel:+917500222141",
        responseSpeech: "Connecting you with KRADIND customer support desk!",
        icon: "📞",
      };
    }
    // 10. WhatsApp
    else if (clean.includes("whatsapp") || clean.includes("chat")) {
      match = {
        intent: "WhatsApp Instant Chat",
        destinationUrl: "https://wa.me/917500222141?text=Hello%20KRADIND!%20I%20would%20like%20to%20inquire%20about%20tours.",
        responseSpeech: "Opening KRADIND WhatsApp support!",
        icon: "💬",
      };
    }
    // 11. Plan / Book
    else if (clean.includes("book") || clean.includes("plan")) {
      match = {
        intent: "Plan Your Custom Trip",
        destinationUrl: "/plan-your-trip",
        responseSpeech: "Opening trip planner to customize your holiday!",
        icon: "📝",
      };
    }
    // 12. General Search Fallback
    else {
      match = {
        intent: `Search for "${clean}"`,
        destinationUrl: `/treks?q=${encodeURIComponent(clean)}`,
        responseSpeech: `Searching packages for ${clean}!`,
        icon: "🔍",
      };
    }

    setFeedbackMessage(match.responseSpeech);
    speakText(match.responseSpeech);

    // Auto navigate after small audio delay
    setTimeout(() => {
      setIsOpen(false);
      if (match.destinationUrl.startsWith("tel:") || match.destinationUrl.startsWith("http")) {
        window.location.href = match.destinationUrl;
      } else {
        router.push(match.destinationUrl);
      }
    }, 1100);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      handleExecuteVoiceCommand(manualText.trim());
    }
  };

  return (
    <>
      {/* Floating Microphone Trigger Button (Mobile Friendly, Bottom Offset) */}
      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-40 flex flex-col items-center">
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => startListening(), 250);
          }}
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#0F3A2E] to-[#164e3f] hover:from-[#164e3f] hover:to-[#0F3A2E] text-white shadow-2xl hover:shadow-[0_8px_30px_rgba(15,58,46,0.45)] border-2 border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Activate Voice Search"
          title="Voice Search & Commands (Treks, Tours, Destinations, Honeymoon)"
        >
          {/* Subtle Radar Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/20 animate-ping opacity-60 pointer-events-none" />

          <Mic className="w-6 h-6 text-emerald-300 group-hover:text-amber-300 transition-colors" />

          {/* Tooltip Label (Desktop only) */}
          <span className="hidden md:inline-block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700">
            🎙️ Voice Search & Commands
          </span>
        </button>
      </div>

      {/* Voice Assistant Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-[#0F3A2E] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold block leading-tight">
                    KRADIND Voice Command Assistant
                  </h3>
                  <span className="text-[11px] text-emerald-200/80 font-normal">
                    Try &ldquo;Trek&rdquo;, &ldquo;Honeymoon&rdquo;, &ldquo;Kerala&rdquo;, or &ldquo;Kedarkantha&rdquo;
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                  title={soundEnabled ? "Mute audio response" : "Enable voice response"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopListening();
                    setIsOpen(false);
                  }}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Listening Section with Animated Wave */}
            <div className="p-6 text-center space-y-4 bg-gradient-to-b from-slate-50 to-white flex flex-col items-center">
              
              {/* Mic Circle with Audio Wave Rings */}
              <div className="relative flex items-center justify-center my-2">
                {isListening && (
                  <>
                    <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="absolute w-20 h-20 rounded-full bg-[#0F3A2E]/20 animate-pulse" />
                  </>
                )}

                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    isListening
                      ? "bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-300"
                      : "bg-[#0F3A2E] hover:bg-[#164e3f] text-emerald-300"
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-8 h-8 animate-bounce" />
                  ) : (
                    <MicOff className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>

              {/* Status Message */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {isListening ? "Listening actively..." : "Tap mic to start speaking"}
                </span>

                {/* Live Transcript Display */}
                <div className="min-h-[44px] flex items-center justify-center px-4">
                  {transcript || interimTranscript ? (
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      &ldquo;{transcript || interimTranscript}&rdquo;
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Say &ldquo;Trek&rdquo;, &ldquo;Tour&rdquo;, &ldquo;Destination&rdquo;, &ldquo;Honeymoon&rdquo;, or &ldquo;Rajasthan&rdquo;
                    </p>
                  )}
                </div>

                {/* Assistant Feedback */}
                {feedbackMessage && (
                  <p className="text-xs font-semibold text-[#FF6B35] animate-pulse">
                    {feedbackMessage}
                  </p>
                )}
              </div>

              {/* Sound Waveform Visualizer Bars (when active) */}
              {isListening && (
                <div className="flex items-center justify-center gap-1.5 h-6">
                  <span className="w-1 bg-[#0F3A2E] rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
                  <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-5" />
                  <span className="w-1 bg-[#FF6B35] rounded-full animate-[bounce_0.5s_ease-in-out_infinite] h-6" />
                  <span className="w-1 bg-emerald-600 rounded-full animate-[bounce_0.9s_ease-in-out_infinite] h-4" />
                  <span className="w-1 bg-[#0F3A2E] rounded-full animate-[bounce_0.7s_ease-in-out_infinite] h-3" />
                </div>
              )}
            </div>

            {/* Quick Tap Suggestion Chips */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick Commands & Popular Searches:
              </span>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {VOICE_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(chip.command);
                      handleExecuteVoiceCommand(chip.command);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-950 border border-slate-200 hover:border-emerald-300 rounded-full text-xs font-semibold transition shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              {/* Manual Input Fallback */}
              <form onSubmit={handleManualSubmit} className="pt-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Or type a command: 'honeymoon', 'kedarkantha'..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f] transition cursor-pointer"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
