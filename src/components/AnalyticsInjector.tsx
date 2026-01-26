import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

const CONSENT_KEY = 'cookie-consent';

type ConsentState = 'accepted' | 'rejected' | null;

const AnalyticsInjector = () => {
  const { settings } = useSettings();
  const analyticsCode = settings.analyticsCode;
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const readConsent = () => {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted' || stored === 'rejected') {
        setConsent(stored);
      } else {
        setConsent(null);
      }
    };

    readConsent();

    const handleConsentChange = () => readConsent();
    window.addEventListener('cookie-consent', handleConsentChange);
    window.addEventListener('storage', handleConsentChange);

    return () => {
      window.removeEventListener('cookie-consent', handleConsentChange);
      window.removeEventListener('storage', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Clean up old scripts first
    const oldScriptTag = document.getElementById('ga-script-1');
    if (oldScriptTag) oldScriptTag.remove();
    const oldInlineScript = document.getElementById('ga-script-2');
    if (oldInlineScript) oldInlineScript.remove();

    if (!analyticsCode || consent !== 'accepted') {
      return;
    }

    const scriptTag = document.createElement('script');
    scriptTag.id = 'ga-script-1';
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsCode}`;
    scriptTag.async = true;
    document.head.appendChild(scriptTag);

    const inlineScript = document.createElement('script');
    inlineScript.id = 'ga-script-2';
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${analyticsCode}');
    `;
    document.head.appendChild(inlineScript);

    return () => {
      const scriptToRemove1 = document.getElementById('ga-script-1');
      if (scriptToRemove1) scriptToRemove1.remove();
      const scriptToRemove2 = document.getElementById('ga-script-2');
      if (scriptToRemove2) scriptToRemove2.remove();
    };
  }, [analyticsCode, consent]);

  return null;
};

export default AnalyticsInjector;
