import React, { useState } from 'react';
import { Users, Mail, CheckCircle2, MessageSquare, Search, Sparkles } from 'lucide-react';
import { REAL_TEAMMATES, Teammate } from '../data/hackathonData';

export default function TeammateMatching() {
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [outreachMessage, setOutreachMessage] = useState<string>('');
  const [successRecipient, setSuccessRecipient] = useState<string | null>(null);
  const [activeOutreachId, setActiveOutreachId] = useState<string | null>(null);

  // Extract unique skills safely
  const allSkills = ['All', 'Python', 'React', 'TypeScript', 'MCP Servers', 'Figma', 'Web scraping', 'SQLite'];

  const filteredTeammates = REAL_TEAMMATES.filter(tm => {
    return selectedSkill === 'All' || tm.skills.includes(selectedSkill) || tm.interests.includes(selectedSkill);
  });

  const handleSendOutreach = (teammateId: string, recipientName: string) => {
    if (!outreachMessage.trim()) return;
    setSuccessRecipient(recipientName);
    setActiveOutreachId(null);
    setOutreachMessage('');
    setTimeout(() => {
      setSuccessRecipient(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <Users className="w-6 h-6" /> Teammate Directory
        </h2>
        <p className="text-slate-400 mt-2 text-sm max-w-3xl leading-relaxed">
          Connect with other real-world student builders seeking complementry skills. Filter profiles by specialized skills such as Multi-Agent Swarms, Web Scraping, and React development to assemble the ultimate hackathon squad.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Filter by Skill:</span>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`text-xs px-3 py-1.5 rounded-full border transition font-mono ${
                  selectedSkill === skill
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successRecipient && (
        <div className="bg-green-950 border border-green-800 text-green-300 rounded-xl p-4 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span className="text-xs font-mono">Your team request & skill portfolio have been sent to <strong>{successRecipient}</strong> successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeammates.length === 0 ? (
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
            <p>No teammates found with this skill. Try another filter.</p>
          </div>
        ) : (
          filteredTeammates.map((tm) => (
            <div key={tm.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={tm.avatar}
                    alt={tm.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-800 bg-slate-950 p-1"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">{tm.name}</h3>
                    <p className="text-xs text-blue-400 font-mono">{tm.role}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Key Developer Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {tm.skills.map((skill, i) => (
                        <span key={i} className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-mono text-[11px] text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Interests & Domains:</span>
                    <div className="flex flex-wrap gap-1">
                      {tm.interests.map((interest, i) => (
                        <span key={i} className="bg-blue-950/40 text-blue-300 border border-blue-900/30 px-2 py-0.5 rounded font-mono text-[11px]">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>Availability: {tm.availability}</span>
                {activeOutreachId === tm.id ? (
                  <div className="w-full space-y-2 mt-2">
                    <textarea
                      placeholder={`Introduce your project idea to ${tm.name}...`}
                      value={outreachMessage}
                      onChange={(e) => setOutreachMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveOutreachId(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-1 px-2.5 rounded text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendOutreach(tm.id, tm.name)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-2.5 rounded text-[11px]"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveOutreachId(tm.id)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5" /> Invite to Team
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
