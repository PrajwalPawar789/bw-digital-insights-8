import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';

const CONSENT_KEY = 'cookie-consent';
const SMARTLOOK_PROJECT_KEY = 'aff831192fb2db243359380cbce8ecace442c9c7';
const SMARTLOOK_REGION = 'eu';

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

    if (!analyticsCode) {
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
  }, [analyticsCode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const oldSmartlookScript = document.getElementById('smartlook-bootstrap');
    if (oldSmartlookScript) oldSmartlookScript.remove();
    const oldSmartlookRecorder = document.getElementById('smartlook-recorder');
    if (oldSmartlookRecorder) oldSmartlookRecorder.remove();

    const smartlookScript = document.createElement('script');
    smartlookScript.id = 'smartlook-bootstrap';
    smartlookScript.type = 'text/javascript';
    smartlookScript.innerHTML = `
      window.smartlook||(function(d) {
        var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
        var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
        c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';c.id='smartlook-recorder';h.appendChild(c);
      })(document);
      smartlook('init', '${SMARTLOOK_PROJECT_KEY}', { region: '${SMARTLOOK_REGION}' });
    `;
    document.head.appendChild(smartlookScript);

    return () => {
      const scriptToRemove = document.getElementById('smartlook-bootstrap');
      if (scriptToRemove) scriptToRemove.remove();
      const recorderToRemove = document.getElementById('smartlook-recorder');
      if (recorderToRemove) recorderToRemove.remove();
    };
  }, []);

  return null;
};

export default AnalyticsInjector;
