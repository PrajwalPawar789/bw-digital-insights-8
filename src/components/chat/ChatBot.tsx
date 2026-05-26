import { useState } from 'react';
import { Bot, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BRAND = "CIO Vision";

const ChatBot = () => {
  const suggestedPrompts = [
    `How can I subscribe to ${BRAND}?`,
    "Tell me about your featured C-suite executives",
    "Which industries do you cover in your publications?",
    "How can my company be featured in your magazine?",
    "When is the next issue releasing?",
    "What are your advertising opportunities?",
    "How do I submit a press release?",
    "Can you provide insights on industry trends?"
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: `Hello! I'm the ${BRAND} Assistant. How can I help you with magazine subscriptions, business insights, or industry inquiries today?`, isUser: false }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent | string) => {
    if (typeof e !== 'string') {
      e.preventDefault();
    }

    const messageText = typeof e === 'string' ? e : input;

    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { text: messageText, isUser: true }]);

    if (typeof e !== 'string') {
      setInput("");
    }

    setTimeout(() => {
      let response = "Thank you for your inquiry. Our editorial team will provide you with detailed information shortly.";

      const lowerMessage = messageText.toLowerCase();

      if (lowerMessage.includes("subscribe") || lowerMessage.includes("subscription")) {
        response = `${BRAND} offers premium subscriptions with exclusive access to C-suite interviews, industry analysis, and leadership insights. Visit our Contact page or call our subscription team at 1-800-INSIGHTS for personalized plans.`;
      } else if (lowerMessage.includes("featured") || lowerMessage.includes("executive")) {
        response = `${BRAND} regularly features Fortune 500 CEOs, innovative startup founders, and transformational leaders. Recent features include executives from technology, finance, healthcare, and sustainable business sectors.`;
      } else if (lowerMessage.includes("industry") || lowerMessage.includes("industries")) {
        response = "We cover Technology & Innovation, Financial Services, Healthcare & Biotechnology, Sustainable Business, Manufacturing & Supply Chain, Retail & E-commerce, and Emerging Markets. Each issue provides deep-dive analysis and strategic insights.";
      } else if (lowerMessage.includes("advertise") || lowerMessage.includes("advertising")) {
        response = `${BRAND} offers premium advertising opportunities including full-page spreads, sponsored content, and digital placements. Our readership includes 2.5M+ C-suite executives globally. Contact our media team for advertising packages.`;
      } else if (lowerMessage.includes("press release") || lowerMessage.includes("submit")) {
        response = "Submit your press releases through our Press Releases section. We prioritize announcements about leadership changes, strategic partnerships, innovation launches, and market expansions from established companies.";
      } else if (lowerMessage.includes("trend") || lowerMessage.includes("insight")) {
        response = `Our research team tracks key business trends including AI transformation, sustainable business practices, remote leadership strategies, and emerging market opportunities. Access our latest ${BRAND} trend reports in the Magazine section.`;
      } else if (lowerMessage.includes("next issue") || lowerMessage.includes("release")) {
        response = `${BRAND} releases quarterly in March, June, September, and December. The upcoming issue focuses on 'Digital Transformation Leadership' featuring 50+ global executives sharing transformation strategies.`;
      }

      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
    setShowSuggestions(false);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-insightRed to-red-700 hover:from-red-700 hover:to-insightRed transition-all duration-300 transform hover:scale-105 border-2 border-white z-50 p-0"
          aria-label="Open chat assistant"
        >
          <Bot className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
        </Button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label={`${BRAND} chat assistant`}
          className="fixed bottom-6 right-6 w-[360px] h-[520px] max-h-[calc(100vh-3rem)] max-w-[calc(100vw-2rem)] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-insightRed via-red-600 to-red-700 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 rounded-md backdrop-blur-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold">{BRAND} Assistant</div>
                <div className="text-white/85 text-[11px]">{BRAND} Support</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/15 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl shadow-sm ${
                    message.isUser
                      ? 'bg-gradient-to-br from-insightRed to-red-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                  }`}
                >
                  <p className="text-[13px] leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 bg-white">
            <div className="px-3 pt-2">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center justify-between w-full px-2 py-1.5 text-left text-xs font-medium text-gray-700 hover:text-insightRed transition-colors duration-200 rounded-md hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5" />
                  Suggested Questions ({suggestedPrompts.length})
                </span>
                {showSuggestions ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {showSuggestions && (
                <div className="mt-1.5 space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left text-[11.5px] bg-gradient-to-r from-gray-50 to-gray-100 hover:from-insightRed/10 hover:to-red-50 text-gray-700 hover:text-insightRed rounded-md px-2.5 py-1.5 transition-all duration-200 border border-gray-200 hover:border-insightRed/30"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSend} className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${BRAND}...`}
                className="flex-1 h-9 text-sm border border-gray-200 focus:border-insightRed rounded-lg"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-to-r from-insightRed to-red-600 hover:from-red-600 hover:to-red-700 px-3 h-9 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
