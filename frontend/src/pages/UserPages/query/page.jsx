import React, { useState } from 'react';
import { PageHeader } from '../../../components/ui';
import { Bot, Send, HelpCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const QueryPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Maharashtra Single Window AI Assistant. Ask me anything about environmental clearances, factory licenses, fire NOCs, or subsidies.' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalated, setEscalated] = useState(false);

  const sampleQuestions = [
    'What approvals are mandatory before civil construction?',
    'What is the threshold for HT electrical power substation sanction?',
    'How long does an MPCB Orange category Consent to Establish take?'
  ];

  const handleSend = (q) => {
    const questionText = q || inputQuery;
    if (!questionText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: questionText }]);
    setInputQuery('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Regarding "${questionText}": Under Maharashtra industrial regulations, this clearance requires verifying your plot area, zoning classification, and capital machinery cost. If your factory has an installed power load exceeding 100 HP, an on-site field inspection by the designated regional officer is required within 30 days.`
        }
      ]);
    }, 600);
  };

  const handleEscalateSubmit = (e) => {
    e.preventDefault();
    setShowEscalateModal(false);
    setEscalated(true);
    setTimeout(() => setEscalated(false), 5000);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <PageHeader
            title="Regulatory Query & Helpdesk"
            subtitle="Get instant clarity from the AI Advisor or submit your inquiry directly to the designated department officer."
            className="pb-0 border-b-0"
          />
        </div>

        <button
          onClick={() => setShowEscalateModal(true)}
          className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <span>Ask Human Authority</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {escalated && (
        <div className="bg-india-blue/10 border border-india-blue/30 text-foreground p-3.5 rounded-xl flex items-center space-x-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-india-blue shrink-0" />
          <span>Your query has been forwarded to the District Industrial Facilitation Desk. Reference Ticket: QRY-2026-9014.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Query Terminal */}
        <div className="lg:col-span-2 border border-border rounded-xl bg-background flex flex-col h-[520px]">
          {/* Terminal Header */}
          <div className="p-3.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-india-blue/10 text-india-blue">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground">AI Clearances Assistant</span>
            </div>
            <span className="text-[10px] font-mono text-india-blue bg-india-blue/10 px-2 py-0.5 rounded">Active Knowledge Base</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-india-blue text-white rounded-br-none'
                      : 'bg-border/20 text-foreground border border-border rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-border flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about approvals, rules, fees, or inspections..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-india-blue"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-lg bg-india-blue text-white hover:opacity-90 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggested FAQs & Escalation Card */}
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-4 bg-background space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-india-blue" />
              <span>Common Questions</span>
            </h3>
            <div className="space-y-2">
              {sampleQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sq)}
                  className="w-full text-left p-2.5 rounded-lg border border-border/80 text-xs text-foreground/80 hover:bg-border/30 hover:text-india-blue transition-colors cursor-pointer"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-india-blue/30 bg-india-blue/5 rounded-xl p-4 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-india-blue tracking-wider block">Complex Case Support</span>
            <h4 className="text-xs font-bold text-foreground">AI cannot resolve your query?</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              If your industrial process involves specialized chemicals, hazardous materials, or cross-border zoning, our District Nodal Officer will review it.
            </p>
            <button
              onClick={() => setShowEscalateModal(true)}
              className="w-full py-2 px-3 rounded-lg bg-india-blue text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer text-center"
            >
              Submit to District Officer
            </button>
          </div>
        </div>
      </div>

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-background border border-border w-full max-w-md rounded-xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">Escalate Query to Authority Desk</h3>
              <button onClick={() => setShowEscalateModal(false)} className="text-foreground/60 hover:text-foreground cursor-pointer">×</button>
            </div>

            <form onSubmit={handleEscalateSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Target Department</label>
                <select required className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue">
                  <option>Maharashtra Pollution Control Board (MPCB)</option>
                  <option>Directorate of Industrial Safety & Health (DISH)</option>
                  <option>State Fire Services / MIDC Fire Wing</option>
                  <option>Town Planning & Municipal Corporation</option>
                  <option>MSEDCL Power Sanction Cell</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">District / Jurisdiction</label>
                <input readOnly value="Chhatrapati Sambhajinagar (Aurangabad)" className="w-full bg-border/20 border border-border rounded-lg p-2 text-foreground/70" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground/70 mb-1">Specific Regulatory Query</label>
                <textarea rows={3} required placeholder="Describe your query with factory plot number..." className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:outline-none focus:border-india-blue" />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button type="button" onClick={() => setShowEscalateModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-border cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-india-blue text-white font-bold hover:opacity-90 cursor-pointer">Submit to Officer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryPage;
