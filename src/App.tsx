import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster, toast } from "sonner";
import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptPassword, setDecryptPassword] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [showDecryptedText, setShowDecryptedText] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDecryptPassword, setShowDecryptPassword] = useState(false);
  
  const encryptMutation = useMutation(api.encryption.encryptText);
  const decryptMutation = useMutation(api.encryption.decryptText);

  const handleEncrypt = async () => {
    if (!text.trim() || !password.trim()) {
      toast.error("Please enter both text and password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await encryptMutation({ text, password });
      setEncryptedText(result);
      toast.success("Text encrypted successfully! 🎉");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Encryption failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedText.trim() || !decryptPassword.trim()) {
      toast.error("Please enter both encrypted text and password");
      return;
    }

    setIsLoading(true);
    setShowDecryptedText(false);
    try {
      const result = await decryptMutation({ emojiText: encryptedText, password: decryptPassword });
      setDecryptedText(result);
      setShowDecryptedText(true);
      toast.success("Text decrypted successfully! 🔓");
    } catch (error) {
      toast.error("Incorrect password or invalid encrypted text");
      setDecryptedText("");
      setShowDecryptedText(false);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard! 📋");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const clearAll = () => {
    setText("");
    setPassword("");
    setEncryptedText("");
    setDecryptPassword("");
    setDecryptedText("");
    setShowDecryptedText(false);
    toast.success("All fields cleared! 🧹");
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setEncryptedText(text);
      toast.success("Pasted from clipboard! 📋");
    } catch (error) {
      toast.error("Failed to paste from clipboard");
    }
  };

  const switchMode = (mode: "encrypt" | "decrypt") => {
    setActiveMode(mode);
    if (mode === "decrypt") {
      setDecryptPassword("");
      setDecryptedText("");
      setShowDecryptedText(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-6000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Compact header */}
      <div className="relative z-10 text-center pt-4 pb-4">
        <div className="animate-fadeInDown">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl animate-pulse shadow-xl shadow-purple-500/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 animate-gradient"></div>
                <span className="relative z-10">🔐</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-md animate-pulse"></div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent tracking-tight animate-gradient bg-[length:400%_400%] leading-none">
                CryptoText
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
                <div className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SECURE • BEAUTIFUL • PRIVATE
                </div>
                <div className="h-0.5 w-8 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed px-4 mb-4">
            Transform your secrets into beautiful emojis with military-grade encryption
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1 bg-slate-800/30 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-600/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800/30 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-600/20">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Zero Data Storage</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800/30 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-600/20">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact mode toggle */}
      <div className="relative z-10 flex justify-center mb-6 animate-fadeInUp px-4">
        <div className="bg-slate-800/40 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-600/30 shadow-xl">
          <button
            onClick={() => switchMode("encrypt")}
            className={`px-6 md:px-8 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-700 transform relative overflow-hidden ${
              activeMode === "encrypt"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-700/30"
            }`}
          >
            {activeMode === "encrypt" && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-20 animate-pulse"></div>
            )}
            <span className="relative flex items-center gap-2">
              🔒 <span className="hidden sm:inline">Encrypt</span>
            </span>
          </button>
          <button
            onClick={() => switchMode("decrypt")}
            className={`px-6 md:px-8 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-700 transform relative overflow-hidden ${
              activeMode === "decrypt"
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/40 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-700/30"
            }`}
          >
            {activeMode === "decrypt" && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-20 animate-pulse"></div>
            )}
            <span className="relative flex items-center gap-2">
              🔓 <span className="hidden sm:inline">Decrypt</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Content with smooth transitions */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6">
        <div className="relative min-h-[500px]">
          {/* Encrypt Section - Full screen when active */}
          <div className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            activeMode === "encrypt" 
              ? "opacity-100 scale-100 translate-x-0 pointer-events-auto" 
              : "opacity-0 scale-95 -translate-x-full pointer-events-none"
          }`}>
            <div className="bg-slate-800/20 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-500/30 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Encrypt Your Message
                </h3>
                <div className="flex-1"></div>
                <div className="text-xs text-slate-400 bg-slate-700/30 px-3 py-1 rounded-full">
                  Step 1 of 2
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-300 mb-3 group-focus-within:text-blue-400 transition-colors">
                    Your Secret Message
                  </label>
                  <div className="relative">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter your secret message here..."
                      className="w-full h-32 md:h-40 px-4 py-3 bg-slate-900/40 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none backdrop-blur-sm hover:bg-slate-900/60 hover:border-slate-500/50 text-sm"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">
                      {text.length} characters
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-300 mb-3 group-focus-within:text-blue-400 transition-colors">
                    Encryption Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password..."
                      className="w-full px-4 py-3 pr-12 bg-slate-900/40 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 backdrop-blur-sm hover:bg-slate-900/60 hover:border-slate-500/50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-lg"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Use a strong password for better security
                  </div>
                </div>

                <button
                  onClick={handleEncrypt}
                  disabled={isLoading || !text.trim() || !password.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Encrypting your message...
                    </div>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      🔒 Encrypt Message
                    </span>
                  )}
                </button>

                {encryptedText && (
                  <div className="space-y-4 animate-slideInUp">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-300">
                        Encrypted Emojis ✨
                      </label>
                      <div className="text-xs text-slate-500 bg-slate-700/30 px-3 py-1 rounded-full">
                        {encryptedText.length} emojis
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="w-full p-4 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-slate-600/30 rounded-xl text-white break-all max-h-32 overflow-y-auto backdrop-blur-sm text-xl leading-relaxed hover:border-blue-500/30 transition-colors">
                        {encryptedText}
                      </div>
                      <button
                        onClick={() => copyToClipboard(encryptedText)}
                        className="absolute top-3 right-3 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-xs font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => switchMode("decrypt")}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-500/30 text-purple-200 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-sm"
                      >
                        <span className="flex items-center gap-2">
                          🔄 Now Decrypt This Message
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decrypt Section - Full screen when active */}
          <div className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            activeMode === "decrypt" 
              ? "opacity-100 scale-100 translate-x-0 pointer-events-auto" 
              : "opacity-0 scale-95 translate-x-full pointer-events-none"
          }`}>
            <div className="bg-slate-800/20 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:border-emerald-500/30 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  Decrypt Your Message
                </h3>
                <div className="flex-1"></div>
                <div className="text-xs text-slate-400 bg-slate-700/30 px-3 py-1 rounded-full">
                  Step 2 of 2
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-300 mb-3 group-focus-within:text-emerald-400 transition-colors">
                    Encrypted Emojis
                  </label>
                  <div className="relative">
                    <textarea
                      value={encryptedText}
                      onChange={(e) => setEncryptedText(e.target.value)}
                      placeholder="Paste encrypted emoji text here..."
                      className="w-full h-32 md:h-40 px-4 py-3 pr-12 bg-slate-900/40 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-300 resize-none backdrop-blur-sm hover:bg-slate-900/60 hover:border-slate-500/50 text-xl leading-relaxed"
                    />
                    <button
                      onClick={pasteFromClipboard}
                      className="absolute bottom-2 right-2 px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-xs font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      📋 Paste
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-300 mb-3 group-focus-within:text-emerald-400 transition-colors">
                    Decryption Password
                  </label>
                  <div className="relative">
                    <input
                      type={showDecryptPassword ? "text" : "password"}
                      value={decryptPassword}
                      onChange={(e) => setDecryptPassword(e.target.value)}
                      placeholder="Enter the password..."
                      className="w-full px-4 py-3 pr-12 bg-slate-900/40 border border-slate-600/30 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-300 backdrop-blur-sm hover:bg-slate-900/60 hover:border-slate-500/50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDecryptPassword(!showDecryptPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-lg"
                    >
                      {showDecryptPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDecrypt}
                  disabled={isLoading || !encryptedText.trim() || !decryptPassword.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-600 hover:from-emerald-700 hover:via-green-800 hover:to-emerald-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Decrypting your message...
                    </div>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      🔓 Decrypt Message
                    </span>
                  )}
                </button>

                {showDecryptedText && decryptedText && (
                  <div className="space-y-4 animate-slideInUp">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-300">
                        Decrypted Message 🎉
                      </label>
                      <div className="text-xs text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full">
                        Success!
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="w-full p-4 bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 rounded-xl text-white break-words max-h-32 overflow-y-auto backdrop-blur-sm shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 text-sm">
                        {decryptedText}
                      </div>
                      <button
                        onClick={() => copyToClipboard(decryptedText)}
                        className="absolute top-3 right-3 px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-xs font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compact action buttons */}
        <div className="flex items-center justify-center gap-4 mt-8 mb-6">
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-slate-700/30 hover:bg-slate-600/40 border border-slate-600/30 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:border-slate-500/50 group text-sm"
          >
            <span className="flex items-center gap-2">
              🗑️ Clear All Fields
              <div className="w-0 group-hover:w-3 h-3 bg-red-500/20 rounded-full transition-all duration-300"></div>
            </span>
          </button>
        </div>

        {/* Compact instructions */}
        <div className="mt-12 mb-12 animate-fadeInUp">
          <div className="bg-slate-800/10 backdrop-blur-xl border border-slate-600/20 rounded-2xl p-6 md:p-8 text-center shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center text-xl">
                ✨
              </div>
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                How It Works
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-slate-300">
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300 p-4 rounded-2xl hover:bg-slate-800/20">
                <div className="text-4xl group-hover:animate-bounce mb-4">🔒</div>
                <h4 className="text-base font-semibold text-white mb-2">Encrypt</h4>
                <p className="text-sm leading-relaxed">
                  Enter your secret message and a strong password to encrypt it into beautiful emojis using advanced cryptography
                </p>
              </div>
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300 p-4 rounded-2xl hover:bg-slate-800/20">
                <div className="text-4xl group-hover:animate-bounce mb-4">📱</div>
                <h4 className="text-base font-semibold text-white mb-2">Share</h4>
                <p className="text-sm leading-relaxed">
                  Share the emoji sequence safely anywhere - it's completely meaningless without the correct password
                </p>
              </div>
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300 p-4 rounded-2xl hover:bg-slate-800/20">
                <div className="text-4xl group-hover:animate-bounce mb-4">🔓</div>
                <h4 className="text-base font-semibold text-white mb-2">Decrypt</h4>
                <p className="text-sm leading-relaxed">
                  Use the exact same password to decrypt the emoji sequence back to the original readable text
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-600/20">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>No Data Stored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Open Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            color: '#f8fafc',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
