
import { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Pre-defined prompts related to business magazine inquiries
const suggestedPrompts = [
  "How can I subscribe to InsightsBW magazine?",
  "Tell me more about featured C-suite executives",
  "Which industries are covered in your magazine?",
  "How can I be featured in your next issue?",
  "When is the next magazine issue releasing?"
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm your InsightsBW Assistant. How can I help you with magazine or business inquiries today?", isUser: false }
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
    
    // Simulate AI response
    setTimeout(() => {
      let response = "Thank you for your message. Our team will get back to you shortly with more information.";
      
      if (messageText.toLowerCase().includes("subscribe")) {
        response = "You can subscribe to our magazine by visiting the Contact page and filling out the subscription form. We offer both digital and print subscriptions at competitive rates.";
      } else if (messageText.toLowerCase().includes("featured") || messageText.toLowerCase().includes("executive")) {
        response = "Our magazine features C-suite executives from Fortune 500 companies and innovative startups. Our latest issue covered leaders from tech, finance, and healthcare sectors.";
      } else if (messageText.toLowerCase().includes("industry") || messageText.toLowerCase().includes("industries")) {
        response = "InsightsBW covers a wide range of industries including technology, finance, healthcare, retail, manufacturing, and more. Each issue focuses on innovative leaders and strategies across sectors.";
      } else if (messageText.toLowerCase().includes("featured") || messageText.toLowerCase().includes("appear")) {
        response = "To be featured in our magazine, please reach out through our Contact page. Our editorial team reviews submissions and selects executives with compelling leadership stories.";
      } else if (messageText.toLowerCase().includes("next issue") || messageText.toLowerCase().includes("release")) {
        response = "Our next issue will be released in the first week of next month. It will feature a special focus on sustainable business practices and transformative leadership.";
      }
      
      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-insightRed hover:bg-insightRed/90 transition-all duration-300 transform hover:scale-110"
        aria-label="Open chat assistant"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px] h-[600px] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-gradient-to-r from-insightRed to-insightBlack">
            <DialogTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              InsightsBW Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-insightRed text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Prompts */}
          <div className="px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-3 py-1.5 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSend} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" className="bg-insightRed hover:bg-insightRed/90">
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
