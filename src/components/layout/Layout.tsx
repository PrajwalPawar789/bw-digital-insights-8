
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipToContent from '../accessibility/SkipToContent';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SkipToContent />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
