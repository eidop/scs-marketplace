import React, { useState, useEffect } from 'react';
import { 
  Activity, Zap, Clock, Users, Database, 
  TrendingUp, AlertCircle, Cpu, HardDrive 
} from 'lucide-react';

const EidoDashboard = () => {
  const [metrics, setMetrics] = useState({
    api: {
      tokens: 45210,
      cost: 1.24,
      calls: 142,
      limit: 100000,
      budget: 5.00
    },
    relationship: {
      messages: 1240,
      topics: ['Next.js', 'AI Integration', 'Tailwind', 'System Design'],
      projects: ['Eido Desktop', 'Claw-UI'],
      avgResponse: '1.2s'
    },
    system: {
      cpu: 42,
      memory: 68,
      subAgents: 2
    },
    cooldowns: [
      { id: 'web-search', label: 'Web Search', time: 15, total: 30 },
      { id: 'file-write', label: 'File Write', time: 0, total: 5 }
    ]
  });

  return (
    <div className="p-4 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header / System Health */}
      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="text-blue-600" /> Eido Desktop Dashboard
        </h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
            <Cpu size={16} className="text-green-500" />
            <span className="text-sm font-medium">{metrics.system.cpu}% CPU</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
            <Database size={16} className="text-purple-500" />
            <span className="text-sm font-medium">{metrics.system.memory}% RAM</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* API Usage Panel */}
        <div className="md:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> API Usage Tracking
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Updates</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Tokens" value={metrics.api.tokens.toLocaleString()} sub="used this session" />
            <StatCard label="Cost" value={`$${metrics.api.cost}`} sub="estimated total" />
            <StatCard label="API Calls" value={metrics.api.calls} sub="total requests" />
            <StatCard label="Daily Quota" value="45%" sub="reset in 8h" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Budget Usage</span>
                <span className="text-slate-500">${metrics.api.cost} / ${metrics.api.budget}</span>
              </div>
              <ProgressBar progress={(metrics.api.cost / metrics.api.budget) * 100} color="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Token Limit</span>
                <span className="text-slate-500">{metrics.api.tokens} / {metrics.api.limit}</span>
              </div>
              <ProgressBar progress={(metrics.api.tokens / metrics.api.limit) * 100} color="bg-purple-500" />
            </div>
          </div>
        </div>

        {/* Cooldown Timers */}
        <div className="md:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Clock size={20} className="text-orange-500" /> Cooldowns
          </h2>
          <div className="space-y-6">
            {metrics.cooldowns.map(cd => (
              <div key={cd.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{cd.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${cd.time > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {cd.time > 0 ? `${cd.time}s remaining` : 'Ready'}
                  </span>
                </div>
                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className="absolute top-0 left-0 h-full bg-orange-400 transition-all duration-1000"
                    style={{ width: `${(cd.time / cd.total) * 100}%` }}
                   ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <AlertCircle size={14} />
              <span className="text-xs font-semibold uppercase">Rate Limiting</span>
            </div>
            <p className="text-xs text-slate-400">Session-based throttling active: 10 requests / min cap.</p>
          </div>
        </div>

        {/* Relationship Metrics */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Users size={20} className="text-pink-500" /> Relationship Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs font-medium text-slate-500 uppercase block mb-1">History</span>
              <span className="text-xl font-bold">{metrics.relationship.messages} messages</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-xs font-medium text-slate-500 uppercase block mb-1">Efficiency</span>
              <span className="text-xl font-bold">{metrics.relationship.avgResponse}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase block mb-2">Shared Topics</span>
              <div className="flex flex-wrap gap-2">
                {metrics.relationship.topics.map(t => (
                  <span key={t} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase block mb-2">Active Projects</span>
              <div className="flex flex-wrap gap-2">
                {metrics.relationship.projects.map(p => (
                  <span key={p} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium flex items-center gap-1">
                    <HardDrive size={10} /> {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Activity / Health */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Activity size={20} className="text-green-500" /> Integration & Health
          </h2>
          <div className="space-y-4">
            <ActivityRow label="Sub-agents" value={`${metrics.system.subAgents} active`} status="online" />
            <ActivityRow label="Memory Access" value="Semantic Vault" status="online" />
            <ActivityRow label="Workspace" value="12,402 files" status="idle" />
            <ActivityRow label="Model Connection" value="Gemini-3-Flash" status="online" />
          </div>
          <div className="mt-6 p-4 bg-blue-600 rounded-xl text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold opacity-80 uppercase tracking-tight">Eido Health Score</p>
                <p className="text-2xl font-bold">98/100</p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-white/20 flex items-center justify-center">
                <Zap size={20} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-slate-500 uppercase">{label}</span>
    <span className="text-xl font-bold my-1 tracking-tight">{value}</span>
    <span className="text-[10px] text-slate-400">{sub}</span>
  </div>
);

const ProgressBar = ({ progress, color }) => (
  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
    <div 
      className={`h-full ${color} transition-all duration-500`} 
      style={{ width: `${Math.min(progress, 100)}%` }}
    ></div>
  </div>
);

const ActivityRow = ({ label, value, status }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-3">
      <div className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="text-sm text-slate-500">{value}</span>
  </div>
);

export default EidoDashboard;
