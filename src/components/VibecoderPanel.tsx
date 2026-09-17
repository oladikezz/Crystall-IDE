import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  ArrowUp,
  Square, 
  Trash2, 
  FileText,
  Bot
} from 'lucide-react';
import { AIProvider, AllConfigs, ChatMessage, FileTab } from '../types';
import { PROVIDER_LABELS } from '../data/constants';

interface VibecoderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeProvider: AIProvider;
  onChangeProvider: (provider: AIProvider) => void;
  configs: AllConfigs;
  activeTab: FileTab;
  onApplyCodeToEditor: (code: string) => void;
  onApplyCodeToNewTab: (code: string, language?: string) => void;
  onSendMessage: (prompt: string, contextCode?: string) => void;
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  streamingThinking: string;
  onStopStreaming: () => void;
  onClearChat: () => void;
  width?: number;
}

export const VibecoderPanel: React.FC<VibecoderPanelProps> = ({
  isOpen,
  onClose,
  activeProvider,
  onChangeProvider,
  configs,
  activeTab,
  onApplyCodeToEditor,
  onApplyCodeToNewTab,
  onSendMessage,
  messages,
  isStreaming,
  streamingContent,
  streamingThinking,
  onStopStreaming,
  onClearChat,
  width = 380
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [includeActiveCode, setIncludeActiveCode] = useState(true);
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, streamingThinking]);

  if (!isOpen) return null;

  const currentConfig = configs[activeProvider];
  const providerMeta = PROVIDER_LABELS[activeProvider] || { name: 'AI', badge: '' };

  const handleSend = () => {
    if ((!input.trim() && !includeActiveCode) || isStreaming) return;
    const promptText = input.trim() || 'Analyze and improve this code.';
    const context = includeActiveCode ? activeTab.content : undefined;
    onSendMessage(promptText, context);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formatted = line;
      // Handle bold **text**
      const parts = formatted.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={idx} className="min-h-[1.2em]">
          {parts.map((p, pIdx) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-zinc-100">{p.slice(2, -2)}</strong>;
            }
            if (p.startsWith('*') && p.endsWith('*')) {
              return <em key={pIdx} className="text-zinc-300 italic">{p.slice(1, -1)}</em>;
            }
            return <span key={pIdx}>{p}</span>;
          })}
        </div>
      );
    });
  };

  const renderMessageContent = (content: string, msgId: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)[\r\n]([\s\S]*?)```/g;
    type MessagePart = 
      | { type: 'text'; val: string }
      | { type: 'code'; language: string; code: string; id: string };

    const parts: MessagePart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          val: content.substring(lastIndex, match.index)
        });
      }
      parts.push({
        type: 'code',
        language: match[1] || activeTab.language || 'lua',
        code: match[2].trim(),
        id: `${msgId}-block-${match.index}`
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        val: content.substring(lastIndex)
      });
    }

    if (parts.length === 0) {
      return <div className="text-zinc-200 text-xs leading-relaxed">{renderFormattedText(content)}</div>;
    }

    return (
      <div className="space-y-2 text-xs">
        {parts.map((p, i) => {
          if (p.type === 'text') {
            return (
              <div 
                key={i} 
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                {renderFormattedText(p.val)}
              </div>
            );
          }

          return (
            <div 
              key={i} 
              className="rounded-md overflow-hidden my-2 font-mono border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              {/* Clean Code Header */}
              <div 
                className="flex items-center justify-between px-2.5 py-1 border-b text-[11px]"
                style={{
                  backgroundColor: 'var(--hover-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="lowercase" style={{ color: 'var(--text-muted)' }}>{p.language}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(p.code, p.id)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Copy code"
                  >
                    {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === p.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => onApplyCodeToEditor(p.code)}
                    className="px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 border border-orange-500/30 transition-colors text-[11px] font-sans cursor-pointer"
                    title="Apply to active tab"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <pre 
                className="p-2.5 overflow-x-auto text-xs font-mono leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-editor)',
                  color: 'var(--text-primary)'
                }}
              >
                <code>{p.code}</code>
              </pre>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className="h-full border-l flex flex-col z-30 select-none shadow-2xl font-sans shrink-0 transition-colors"
      style={{ 
        width: `${width}px`,
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      
      {/* Clean Desktop Header */}
      <div 
        className="h-10 border-b px-3 flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Crystall AI</span>
        </div>

        {/* Model Selector & Actions */}
        <div className="flex items-center gap-1.5">
          <select
            value={activeProvider}
            onChange={(e) => onChangeProvider(e.target.value as AIProvider)}
            className="rounded px-2 py-0.5 text-[11px] font-mono focus:outline-none cursor-pointer border"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            {Object.entries(PROVIDER_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>

          <button
            onClick={onClearChat}
            className="p-1 rounded hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className="max-w-[90%] rounded-lg px-3 py-2 text-xs border transition-colors shadow-xs"
                style={{
                  backgroundColor: isUser ? 'var(--chat-user-bg)' : 'var(--chat-assistant-bg)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                {/* Reasoning Block for DeepSeek R1 */}
                {!isUser && msg.thinking && (
                  <div className="mb-2 border-b pb-1.5" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                      className="flex items-center gap-1 text-[11px] transition-colors font-mono cursor-pointer"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {isThinkingExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <span>Reasoning process</span>
                    </button>
                    {isThinkingExpanded && (
                      <div 
                        className="mt-1.5 p-2 rounded text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto border"
                        style={{
                          backgroundColor: 'var(--hover-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {msg.thinking}
                      </div>
                    )}
                  </div>
                )}

                {renderMessageContent(msg.content, msg.id)}
              </div>
            </div>
          );
        })}

        {/* Live Streaming State */}
        {isStreaming && (
          <div className="flex flex-col items-start space-y-2">
            <div 
              className="max-w-[90%] rounded-lg p-3 border shadow-xs"
              style={{
                backgroundColor: 'var(--chat-assistant-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              {streamingThinking && (
                <div className="mb-2 text-[11px] font-mono border-b pb-1.5" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  <span className="animate-pulse">Thinking...</span>
                  <div 
                    className="mt-1 text-[10px] whitespace-pre-wrap max-h-28 overflow-y-auto"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {streamingThinking}
                  </div>
                </div>
              )}

              {streamingContent ? (
                renderMessageContent(streamingContent, 'streaming-msg')
              ) : (
                <div className="text-xs font-mono animate-pulse" style={{ color: 'var(--text-muted)' }}>
                  Generating response...
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Action Chips */}
      <div 
        className="px-3 py-1.5 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] shrink-0"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-color)'
        }}
      >
        <button
          onClick={() => onSendMessage('Find any bugs and fix them:', activeTab.content)}
          className="px-2 py-0.5 rounded border transition-colors whitespace-nowrap cursor-pointer hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]"
          style={{
            backgroundColor: 'var(--hover-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          Fix Bugs
        </button>
        <button
          onClick={() => onSendMessage('Optimize the performance of this script:', activeTab.content)}
          className="px-2 py-0.5 rounded border transition-colors whitespace-nowrap cursor-pointer hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]"
          style={{
            backgroundColor: 'var(--hover-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          Optimize
        </button>
        <button
          onClick={() => onSendMessage('Explain how this script works:', activeTab.content)}
          className="px-2 py-0.5 rounded border transition-colors whitespace-nowrap cursor-pointer hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]"
          style={{
            backgroundColor: 'var(--hover-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          Explain
        </button>
        <button
          onClick={() => onSendMessage('Write test cases for this code:', activeTab.content)}
          className="px-2 py-0.5 rounded border transition-colors whitespace-nowrap cursor-pointer hover:border-[var(--accent-primary)]/40 hover:text-[var(--text-primary)]"
          style={{
            backgroundColor: 'var(--hover-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          Add Tests
        </button>
      </div>

      {/* Input Box */}
      <div 
        className="p-2.5 border-t shrink-0"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center justify-between mb-1.5 text-[11px] font-sans">
          <label 
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <input
              type="checkbox"
              checked={includeActiveCode}
              onChange={(e) => setIncludeActiveCode(e.target.checked)}
              className="rounded cursor-pointer"
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            <span>Include {activeTab.name}</span>
          </label>
          <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>Enter to send</span>
        </div>

        <div 
          className="relative flex items-end rounded-lg border focus-within:border-[var(--accent-primary)]/50 transition-colors p-1.5"
          style={{
            backgroundColor: 'var(--chat-input-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              includeActiveCode 
                ? `Ask about ${activeTab.name}...` 
                : 'Ask a question or request code...'
            }
            className="flex-1 bg-transparent text-xs resize-none focus:outline-none px-1.5 py-1 font-sans"
            style={{ color: 'var(--text-primary)' }}
          />

          {isStreaming ? (
            <button
              onClick={onStopStreaming}
              className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
              title="Stop"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() && !includeActiveCode}
              className="p-1.5 rounded text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-primary)' }}
              title="Send"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
