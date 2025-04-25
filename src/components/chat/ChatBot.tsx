
import { useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BOTPRESS_CLIENT_ID = 'aaf0c61b-ef96-45c9-bbf5-db8ba11d2654';

const ChatBot = () => {
  useEffect(() => {
    // Initialize Botpress webchat
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore - Botpress types are not available
      window.botpressWebChat.init({
        "composerPlaceholder": "Chat with us",
        "botConversationDescription": "Welcome to InsightsBW AI Assistant",
        "botId": BOTPRESS_CLIENT_ID,
        "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
        "messagingUrl": "https://messaging.botpress.cloud",
        "clientId": BOTPRESS_CLIENT_ID,
        "botName": "InsightsBW Assistant",
        "stylesheet": "https://webchat-styler-css.botpress.app/prod/code/d3d431e9-e64c-4622-85e2-fb7fdb86c27b/v31097/style.css",
        "useSessionStorage": true,
        "showPoweredBy": false,
        "theme": "prism",
        "themeColor": "#EF4444"
      });
    };

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
      // @ts-ignore - Botpress types are not available
      if (window.botpressWebChat) {
        // @ts-ignore - Botpress types are not available
        window.botpressWebChat.cleanup();
      }
    };
  }, []);

  const openChat = () => {
    // @ts-ignore - Botpress types are not available
    if (window.botpressWebChat) {
      // @ts-ignore - Botpress types are not available
      window.botpressWebChat.sendEvent({ type: 'toggle' });
    }
  };

  return (
    <Button
      onClick={openChat}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-insightRed hover:bg-insightRed/90 transition-all duration-300 transform hover:scale-110"
    >
      <Bot className="h-6 w-6 text-white" />
    </Button>
  );
};

export default ChatBot;
