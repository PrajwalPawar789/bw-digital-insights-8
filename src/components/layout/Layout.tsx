
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from '../chat/ChatBot';
import { useSettings } from '@/hooks/useSettings';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Layout;
