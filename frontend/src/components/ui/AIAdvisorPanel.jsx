import { Bot, Check, Sparkles, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const TAG_STYLE = {
  tip:     'bg-india-blue/10 text-india-blue border-india-blue/20',
  info:    'bg-border text-foreground/60 border-border',
  warning: 'bg-india-blue/10 text-india-blue border-india-blue/30',
};
const TAG_LABEL = { tip: 'Tip', info: 'Info', warning: 'Note' };

export const AIAdvisorPanel = ({
  insight,
  history = [],
  subtitle = 'Click any item to learn more',
  idleTitle = 'Nothing selected yet',
  idleBody = 'Click any row or field label and the AI will explain what it means.',
}) => (
  <div className="border border-border rounded-xl bg-background overflow-hidden sticky top-20">
    {/* Header */}
    <div className="px-4 py-3 border-b border-border flex items-center gap-2.5 bg-india-blue/5">
      <div className="w-7 h-7 rounded-lg border border-india-blue/30 bg-india-blue/10 flex items-center justify-center shrink-0 text-india-blue">
        <Bot className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-foreground">AI Advisor</p>
        <p className="text-[10px] text-foreground/50">{subtitle}</p>
      </div>
      <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-india-blue/20 bg-india-blue/10 text-india-blue shrink-0">
        Live
      </span>
    </div>

    {/* Content */}
    <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
      <AnimatePresence mode="wait">
        {insight ? (
          <motion.div
            key={`${insight.field}-${insight.value}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground leading-snug">{insight.title}</h3>
              {insight.tag && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${TAG_STYLE[insight.tag]}`}>
                  {TAG_LABEL[insight.tag]}
                </span>
              )}
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">{insight.body}</p>
            {insight.points?.length > 0 && (
              <ul className="space-y-1.5 pt-1 border-t border-border">
                {insight.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/70 leading-snug">
                    <Check className="w-3 h-3 text-india-blue shrink-0 mt-0.5" />
                    {pt}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-3"
          >
            <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-foreground/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-foreground/50">{idleTitle}</p>
            <p className="text-[11px] text-foreground/40 leading-relaxed">{idleBody}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {history?.length > 0 && (
        <div className="border-t border-border px-4 py-3 space-y-1.5">
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" /> Recent
          </p>
          {history.map((h, i) => (
            <p key={i} className="text-[11px] text-foreground/50 truncate">{h.title}</p>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default AIAdvisorPanel;