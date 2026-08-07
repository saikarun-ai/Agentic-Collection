import React, { useState } from 'react';
import { Award, Cpu, Terminal as TerminalIcon, Users, Github, ArrowRight, BookOpen, Layers } from 'lucide-react';
import HackathonFinder from './components/HackathonFinder';
import AISwarmIdeator from './components/AISwarmIdeator';
import AgentReachTerminal from './components/AgentReachTerminal';
import TeammateMatching from './components/TeammateMatching';

function App() {
  const [activeTab, setActiveTab] = useState<'hackathons' | 'ideator' | 'terminal' | 'teammates'>('hackathons');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Premium Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                SwarmIdeate <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">v1.0</span>
              </h1>
              <p className="text-[10px] text-slate-400">Agentic Hackathon Catalyst</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Panniantong/agent-reach"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Github className="w-4 h-4" /> agent-reach Repository
            </a>
            <a
              href="http://you-ai-project.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Layers className="w-4 h-4" /> You-AI Swarm
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Banner with brief details */}
        <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/30 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>
          <div className="space-y-2 relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950/50 border border-blue-800/60 px-3 py-1 rounded-full">
              For Undergrads & Research Builders
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Power Your Next Hackathon with AI Swarm Consensus & Agent-Reach
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Find curated, real-world hackathons, discover compatible teammate profiles, and simulate high-fidelity multi-agent design sprints to construct stellar technical proposals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
            <button
              onClick={() => setActiveTab('ideator')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/30 transition"
            >
              Launch Swarm Ideator <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <TerminalIcon className="w-3.5 h-3.5" /> Setup Agent-Reach
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('hackathons')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'hackathons'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" /> Hackathon Finder
          </button>
          <button
            onClick={() => setActiveTab('ideator')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'ideator'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" /> AI Swarm Ideator
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'terminal'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            <TerminalIcon className="w-4 h-4" /> Agent-Reach CLI
          </button>
          <button
            onClick={() => setActiveTab('teammates')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition shrink-0 ${
              activeTab === 'teammates'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Teammate Matching
          </button>
        </div>

        {/* Tab Contents */}
        <div className="transition-all duration-300">
          {activeTab === 'hackathons' && <HackathonFinder />}
          {activeTab === 'ideator' && <AISwarmIdeator />}
          {activeTab === 'terminal' && <AgentReachTerminal />}
          {activeTab === 'teammates' && <TeammateMatching />}
        </div>
      </main>

      {/* Footer & Reference docs */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-white">SwarmIdeate</span>
            </div>
            <p className="leading-relaxed">
              Bringing secure, client-side agent configurations and actual curated hackathon discovery mechanisms to technical student communities worldwide.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-slate-300 block">External Projects Ref</span>
            <ul className="space-y-2 font-mono">
              <li>
                <a href="http://you-ai-project.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">
                  You-AI (6-Agent Swarm)
                </a>
              </li>
              <li>
                <a href="https://github.com/Panniantong/agent-reach" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">
                  Agent-Reach (Internet-for-Agents)
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-slate-300 block">Security & Local Integrity</span>
            <p className="leading-relaxed">
              We abide strictly by the Open Knowledge Framework (OKF). All inputs, cookies, and tokens stay secured locally on your environment and are never uploaded to dynamic clouds.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-900 text-center">
          © 2026 SwarmIdeate. MIT Licensed. Inspired by Sai Karun Nandipati & Panniantong open-source research.
        </div>
      </footer>
    </div>
  );
}

export default App;
