
import { useState } from 'react';
import { Bot, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Enhanced prompts for business magazine inquiries
const suggestedPrompts = [
  "How can I subscribe to Insights Business Magazine?",
  "Tell me about your featured C-suite executives",
  "Which industries do you cover in your publications?",
  "How can my company be featured in your magazine?",
  "When is the next issue releasing?",
  "What are your advertising opportunities?",
  "How do I submit a press release?",
  "Can you provide insights on industry trends?"
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm your Insights Business Magazine Assistant. How can I help you with magazine subscriptions, business insights, or industry inquiries today?", isUser: false }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent | string) => {
    if (typeof e !== 'string') {
      e.preventDefault();
    }
    
    const messageText = typeof e === 'string' ? e : input;
    
    if (!messageText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: messageText, isUser: true }]);
    
    // Clear input if it's a manual entry
    if (typeof e !== 'string') {
      setInput("");
    }
    
    // Simulate AI response with enhanced responses
    setTimeout(() => {
      let response = "Thank you for your inquiry. Our editorial team will provide you with detailed information shortly.";
      
      const lowerMessage = messageText.toLowerCase();
      
      if (lowerMessage.includes("subscribe") || lowerMessage.includes("subscription")) {
        response = "Insights Business Magazine offers premium subscriptions with exclusive access to C-suite interviews, industry analysis, and leadership insights. Visit our Contact page or call our subscription team at 1-800-INSIGHTS for personalized plans.";
      } else if (lowerMessage.includes("featured") || lowerMessage.includes("executive")) {
        response = "Our magazine regularly features Fortune 500 CEOs, innovative startup founders, and transformational leaders. Recent features include executives from technology, finance, healthcare, and sustainable business sectors.";
      } else if (lowerMessage.includes("industry") || lowerMessage.includes("industries")) {
        response = "We cover Technology & Innovation, Financial Services, Healthcare & Biotechnology, Sustainable Business, Manufacturing & Supply Chain, Retail & E-commerce, and Emerging Markets. Each issue provides deep-dive analysis and strategic insights.";
      } else if (lowerMessage.includes("advertise") || lowerMessage.includes("advertising")) {
        response = "Insights Business Magazine offers premium advertising opportunities including full-page spreads, sponsored content, and digital placements. Our readership includes 2.5M+ C-suite executives globally. Contact our media team for advertising packages.";
      } else if (lowerMessage.includes("press release") || lowerMessage.includes("submit")) {
        response = "Submit your press releases through our Press Releases section. We prioritize announcements about leadership changes, strategic partnerships, innovation launches, and market expansions from established companies.";
      } else if (lowerMessage.includes("trend") || lowerMessage.includes("insight")) {
        response = "Our research team tracks key business trends including AI transformation, sustainable business practices, remote leadership strategies, and emerging market opportunities. Access our latest trend reports in the Magazine section.";
      } else if (lowerMessage.includes("next issue") || lowerMessage.includes("release")) {
        response = "Our quarterly magazine releases in March, June, September, and December. The upcoming issue focuses on 'Digital Transformation Leadership' featuring 50+ global executives sharing transformation strategies.";
      }
      
      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
    setShowSuggestions(false); // Hide suggestions after clicking
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-insightRed to-red-700 hover:from-red-700 hover:to-insightRed transition-all duration-500 transform hover:scale-110 border-4 border-white"
        aria-label="Open chat assistant"
      >
        <Bot className="h-7 w-7 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px] h-[700px] flex flex-col p-0 overflow-hidden rounded-2xl border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="p-8 bg-gradient-to-r from-insightRed via-red-600 to-red-700 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
            <DialogTitle className="text-white flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-bold">Insights Assistant</div>
                <div className="text-white/90 text-sm font-normal">Business Magazine Support</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    message.isUser
                      ? 'bg-gradient-to-br from-insightRed to-red-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 bg-white">
            <div className="p-4">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center justify-between w-full p-3 text-left text-sm font-medium text-gray-700 hover:text-insightRed transition-colors duration-200 rounded-lg hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Suggested Questions ({suggestedPrompts.length})
                </span>
                {showSuggestions ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {showSuggestions && (
                <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left text-xs bg-gradient-to-r from-gray-50 to-gray-100 hover:from-insightRed/10 hover:to-red-50 text-gray-700 hover:text-insightRed rounded-lg px-3 py-2.5 transition-all duration-200 border border-gray-200 hover:border-insightRed/30"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSend} className="p-6 border-t bg-white">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about subscriptions, features, or business insights..."
                className="flex-1 h-12 text-base border-2 border-gray-200 focus:border-insightRed rounded-xl"
              />
              <Button 
                type="submit" 
                size="lg"
                className="bg-gradient-to-r from-insightRed to-red-600 hover:from-red-600 hover:to-red-700 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;
