import { useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT_ID = 'google-oauth-script';

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

const GoogleAuthButton = ({ onCredential, text = 'continue_with' }) => {
  const buttonRef = useRef(null);
  const [error, setError] = useState('');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!clientId) {
        setError('Google OAuth não configurado.');
        return;
      }

      try {
        await loadGoogleScript();
      } catch (err) {
        if (isMounted) {
          setError('Não foi possível carregar o Google OAuth.');
        }
        return;
      }

      if (!window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onCredential(response.credential);
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: buttonRef.current.offsetWidth || 320,
        text,
      });
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [clientId, onCredential, text]);

  if (error) {
    return (
      <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {error}
      </p>
    );
  }

  return <div ref={buttonRef} className="w-full flex justify-center" />;
};

export default GoogleAuthButton;
