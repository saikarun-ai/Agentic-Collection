import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Calendar, Award, ExternalLink, RefreshCw, SlidersHorizontal, Zap } from 'lucide-react';
import { REAL_PROJECTS, Hackathon } from '../data/hackathonData';

const AGENT_REACH_ENDPOINT = import.meta.env.VITE_AGENT_REACH_URL;
const DATA_SOURCES = [
  'Devpost', 'Devfolio', 'Unstop', 'MLH', 'TAIKAI', 'All Hackathons', 'Hackathon.com',
  'Kaggle', 'Lablab.ai', 'Open Hackathons', 'DrivenData', 'AIcrowd', 'Codeforces',
  'LeetCode', 'HackerEarth', 'HackerRank', 'CodeChef', 'Topcoder', 'AtCoder',
  'CodinGame', 'Codewars', 'Hackaday.io', 'HeroX', 'Agorize'
];

type FinderPreferences = {
  skills: string;
  location: string;
  studentOnly: boolean;
};

function normalizeHackathon(item: Record<string, unknown>, index: number): Hackathon | null {
  const name = typeof item.name === 'string' ? item.name : typeof item.title === 'string' ? item.title : null;
  const link = typeof item.link === 'string' ? item.link : typeof item.url === 'string' ? item.url : null;
  if (!name || !link) return null;

  const themes = Array.isArray(item.themes) ? item.themes.filter((theme): theme is string => typeof theme === 'string') : [];
  const location = typeof item.location === 'string' ? item.location : typeof item.city === 'string' ? item.city : 'Online / location not listed';
  const date = typeof item.date === 'string' ? item.date : typeof item.start_date === 'string' ? item.start_date : 'Date not listed';
  const description = typeof item.description === 'string' ? item.description : 'Details available on the official event page.';

  return {
    id: typeof item.id === 'string' || typeof item.id === 'number' ? String(item.id) : `agent-reach-${index}`,
    name,
    organizer: typeof item.organizer === 'string' ? item.organizer : 'Agent-Reach source',
    date,
    location,
    type: location.toLowerCase().includes('online') || location.toLowerCase().includes('virtual') ? 'Virtual' : 'In-Person',
    prizePool: typeof item.prizePool === 'string' ? item.prizePool : 'See official site',
    themes,
    description,
    link,
    difficulty: 'Beginner Friendly'
  };
}

export default function HackathonFinder() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [preferences, setPreferences] = useState<FinderPreferences>({ skills: '', location: '', studentOnly: true });
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHackathons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!AGENT_REACH_ENDPOINT) throw new Error('Agent-Reach endpoint is not configured. Set VITE_AGENT_REACH_URL to your live Agent-Reach gateway.');
      const response = await fetch(AGENT_REACH_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: preferences.skills,
          location: preferences.location,
          studentOnly: preferences.studentOnly,
          sources: DATA_SOURCES,
          includeCompetitions: true,
          onlyUpcoming: true
        })
      });
      if (!response.ok) throw new Error(`Source returned ${response.status}`);
      const payload: unknown = await response.json();
      const records = Array.isArray(payload) ? payload : (payload as { hackathons?: unknown[] })?.hackathons;
      const liveResults = Array.isArray(records) ? records.map((item, index) => item && typeof item === 'object' ? normalizeHackathon(item as Record<string, unknown>, index) : null).filter((item): item is Hackathon => Boolean(item)) : [];
      if (!liveResults.length) throw new Error('The source returned no compatible hackathons');
      setHackathons(liveResults);
      setLastUpdated(new Date());
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to reach the live source');
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  useEffect(() => { void fetchHackathons(); }, [fetchHackathons]);

  // Themes are derived from the live response rather than a fixed list.
  const allThemes = useMemo(() => ['All', ...Array.from(new Set(hackathons.flatMap((hack) => hack.themes))).sort()], [hackathons]);

  const filteredHackathons = hackathons.filter(hack => {
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
          PBSC searches live listings through Agent-Reach across the major hackathon and competition platforms below. Every result must include an official source URL; no placeholder or stale snapshot data is shown.
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Live data sources">
          {DATA_SOURCES.map((source) => <span key={source} className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] text-slate-400">{source}</span>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <input
            type="text"
            placeholder="Skills (e.g. React, AI)"
            value={preferences.skills}
            onChange={(event) => setPreferences((current) => ({ ...current, skills: event.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Location or online"
            value={preferences.location}
            onChange={(event) => setPreferences((current) => ({ ...current, location: event.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-300">
            <input type="checkbox" checked={preferences.studentOnly} onChange={(event) => setPreferences((current) => ({ ...current, studentOnly: event.target.checked }))} />
            Student eligible only
          </label>
          <button type="button" onClick={() => void fetchHackathons()} disabled={isLoading} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Searching…' : 'Refresh live results'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
            <span className="text-xs text-slate-500 italic">{lastUpdated ? `Live source · updated ${lastUpdated.toLocaleTimeString()}` : 'Live source results'}</span>
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
                const hack = hackathons.find((h) => h.id === project.hackathonId);
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
