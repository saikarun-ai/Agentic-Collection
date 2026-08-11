import React, { useState } from 'react';
import { Search, MapPin, Calendar, Award, ExternalLink, Filter, HelpCircle, ChevronRight, Zap } from 'lucide-react';
import { REAL_HACKATHONS, REAL_PROJECTS, Hackathon } from '../data/hackathonData';

export default function HackathonFinder() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Themes list from actual dataset
  const allThemes = ['All', 'AI/ML', 'AI Agents', 'Web3', 'Blockchain', 'Web Dev', 'Healthcare', 'Sustainability', 'Fintech'];

  const filteredHackathons = REAL_HACKATHONS.filter(hack => {
    const matchesSearch = hack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hack.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hack.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTheme = selectedTheme === 'All' || hack.themes.includes(selectedTheme);
    const matchesDifficulty = selectedDifficulty === 'All' || hack.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'All' || hack.type === selectedType;

    return matchesSearch && matchesTheme && matchesDifficulty && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <Award className="w-6 h-6" /> Curated Hackathon Database
        </h2>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-3xl">
          Browse real-world collegiate and professional hackathons. Our database is completely static, representing authentic and high-impact upcoming hackathons in the tech industry. No dynamic mock data is generated.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search hackathons, hosts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Filter by Theme (All)</option>
              {allThemes.filter(t => t !== 'All').map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Difficulty (All)</option>
              <option value="Beginner Friendly">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">Participation (All)</option>
              <option value="In-Person">In-Person</option>
              <option value="Virtual">Virtual</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-4">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Available Hackathons ({filteredHackathons.length})</span>
            <span className="text-xs text-slate-500 italic">Pre-verified and real-world lists</span>
          </h3>

          {filteredHackathons.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
              <p>No hackathons match your exact filters. Try loosening your selection criteria.</p>
            </div>
          ) : (
            filteredHackathons.map((hack) => (
              <div key={hack.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900/40">
                        {hack.organizer}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        hack.difficulty === 'Beginner Friendly' ? 'bg-green-950 text-green-400 border border-green-900/30' :
                        hack.difficulty === 'Intermediate' ? 'bg-yellow-950 text-yellow-400 border border-yellow-900/30' :
                        'bg-red-950 text-red-400 border border-red-900/30'
                      }`}>
                        {hack.difficulty}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1">{hack.name}</h4>
                  </div>
                  <div className="text-emerald-400 font-bold text-base flex items-center gap-1">
                    <Award className="w-4 h-4" /> {hack.prizePool}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{hack.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {hack.themes.map((theme, idx) => (
                    <span key={idx} className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-300">
                      #{theme}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {hack.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {hack.location} ({hack.type})
                    </span>
                  </div>
                  <a
                    href={hack.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    View Official Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Real-World Reference Projects
            </h3>
            <p className="text-xs text-slate-400">
              These actual projects align with our hackathon directory. See how they utilize Agent-Reach and You-AI frameworks to excel.
            </p>

            <div className="space-y-3">
              {REAL_PROJECTS.map((project) => {
                const hack = REAL_HACKATHONS.find(h => h.id === project.hackathonId);
                return (
                  <div key={project.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-blue-400">{project.framework}</span>
                      <span className="text-slate-500 truncate max-w-[120px]">{hack ? hack.name : 'Open Source'}</span>
                    </div>
                    <h4 className="font-bold text-xs text-white leading-normal">{project.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.skillsNeeded.map((skill, i) => (
                        <span key={i} className="bg-slate-900 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-400 border border-slate-800/40">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
