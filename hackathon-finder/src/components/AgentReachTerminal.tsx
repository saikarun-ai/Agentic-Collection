import React, { useState } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface CLICommand {
  command: string;
  output: string;
  isError?: boolean;
}

export default function AgentReachTerminal() {
  const [terminalLogs, setTerminalLogs] = useState<CLICommand[]>([
    {
      command: "agent-reach doctor",
      output: `🩺 Running Agent Reach Environment Diagnostics...
==================================================
🌐 Channel: Jina Reader -> OK [Jina Reader API active]
📺 Channel: YouTube -> OK [yt-dlp v2026.03.01 active]
📡 Channel: RSS -> OK [feedparser active]
🐦 Channel: Twitter/X -> WARNING [Missing TWITTER_AUTH_TOKEN]
📘 Channel: Facebook -> WARNING [OpenCLI session inactive]
📕 Channel: XiaoHongShu -> WARNING [Missing cookie configs]
💻 Channel: V2EX -> OK [No configuration required]

👉 Recommendation: To configure Twitter/X, run:
   agent-reach configure x-cookies`
    }
  ]);
  const [selectedChannel, setSelectedChannel] = useState<string>('youtube');
  const [cookieInput, setCookieInput] = useState<string>('');
  const [configureMessage, setConfigureMessage] = useState<string>('');

  const runCommand = (command: string, customOutput: string) => {
    setTerminalLogs(prev => [
      ...prev,
      { command, output: customOutput }
    ]);
  };

  const handleInstall = () => {
    runCommand(
      "agent-reach install --env=auto --system",
      `🚀 Initializing Agent Reach Installer...
📦 Checking system architecture: Node.js v22.22.1, Python 3.10+ detected.
⚙️ Installing system packages and PIP dependencies:
   - Installing feedparser... [Done]
   - Installing mcporter standard MCP... [Done]
   - Installing bili-cli for Bilibili bypass... [Done]
   - Registering skills in AI agents SKILL.md... [Done]

✅ Installation Successful!
Now you can ask your Claude/Cursor Agent to run search commands natively.`
    );
  };

  const handleDoctor = () => {
    runCommand(
      "agent-reach doctor",
      `🩺 Running Agent Reach Diagnostics...
==================================================
🌐 Web Reading: Jina Reader -> [Active]
📺 YouTube Transcript: yt-dlp -> [Active]
📡 RSS Subscriptions: feedparser -> [Active]
🔍 Web Search: Exa mcporter -> [Active]
🐦 Twitter: twitter-cli -> [Active (using configured cookie)]
📕 XiaoHongShu: OpenCLI -> [Active (Session Verified)]
==================================================
🎉 All Core Channels are Healthy and Ready!`
    );
  };

  const handleConfigureCookie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookieInput.trim()) return;

    setConfigureMessage(`Successfully configured cookie for ${selectedChannel}! Saved to ~/.agent-reach/config.yaml`);
    runCommand(
      `agent-reach configure ${selectedChannel}-cookies`,
      `🔒 Writing credentials securely to ~/.agent-reach/config.yaml
🔑 File permissions configured to 600 (Owner Read/Write only)
✅ Credential validated successfully. channel: ${selectedChannel} is now unlocked!`
    );
    setCookieInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-400">
          <TerminalIcon className="w-6 h-6" /> Agent-Reach Integration Hub
        </h2>
        <p className="text-slate-400 mt-2 text-sm max-w-3xl leading-relaxed">
          Based on the popular open-source repository <a href="https://github.com/Panniantong/agent-reach" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">Panniantong/Agent-Reach</a>, this terminal simulation helps students instantly configure, verify, and unlock AI internet search capabilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              1. Auto Setup
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Download packages, check core runtime requirements, and automatically inject internet search skills into your Agent.
            </p>
            <button
              onClick={handleInstall}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 rounded flex items-center justify-center gap-2 transition"
            >
              <Play className="w-3.5 h-3.5" /> Run Installer
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-400" />
              2. System Doctor
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Audit search routes, check if websites are blocking your IP, and find the working backup channel.
            </p>
            <button
              onClick={handleDoctor}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2 px-3 rounded flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Run Doctor Check
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Channel Cookies
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              Configure credentials for secure local storage of cookies. (Never shared or uploaded).
            </p>
            <form onSubmit={handleConfigureCookie} className="space-y-2">
              <div className="flex gap-1.5">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-1.5 py-1"
                >
                  <option value="twitter">X/Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="xhs">RedBook (小红书)</option>
                  <option value="reddit">Reddit</option>
                </select>
                <input
                  type="password"
                  placeholder="Paste auth cookie token..."
                  value={cookieInput}
                  onChange={(e) => setCookieInput(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1 flex-1 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold py-1.5 px-3 rounded transition"
              >
                Apply Cookies
              </button>
            </form>
            {configureMessage && (
              <p className="text-[10px] text-green-400 mt-2 text-center">{configureMessage}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400 text-xs font-mono ml-2">Terminal: agent-reach CLI Session</span>
          </div>
          <button
            onClick={() => setTerminalLogs([])}
            className="text-slate-500 hover:text-slate-300 text-xs font-mono"
          >
            Clear logs
          </button>
        </div>

        <div className="p-4 font-mono text-xs text-emerald-400 space-y-4 max-h-96 overflow-y-auto bg-slate-950">
          {terminalLogs.length === 0 ? (
            <p className="text-slate-600 italic">No activity logs yet. Click a setup button or configure credentials above to run commands.</p>
          ) : (
            terminalLogs.map((log, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-1 text-slate-400">
                  <span>student@agent-reach:~$</span>
                  <span className="text-white font-bold">{log.command}</span>
                </div>
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800/50">
                  {log.output}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-200">Why Use Agent-Reach for Student Hackathons?</p>
          <p>
            Student teams often need real-time data from social media platforms and public forums to validate project ideas, retrieve APIs, or read modern developer libraries. Agent-Reach offers zero-fee web routers and cookie configurations that prevent API rate-limits and enable high-fidelity context ingestion.
          </p>
        </div>
      </div>
    </div>
  );
}
