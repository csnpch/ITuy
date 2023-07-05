import { useEffect } from 'react';

const useInstallPrompt = (): void => {
  useEffect(() => {
    let deferredPrompt: any = null;

    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent Chrome <= 67 from automatically showing the prompt
      event.preventDefault();

      // Store the deferred prompt for later use
      deferredPrompt = event;

      // Optional: show a custom "Add to Home Screen" button
      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', handleInstallButtonClick);
      }
    };

    const handleInstallButtonClick = () => {
      // Show the browser's installation prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User installed the app');
        } else {
          console.log('User declined to install the app');
        }

        // Reset the deferred prompt variable
        deferredPrompt = null;

        // Optional: hide the custom "Add to Home Screen" button
        const installButton = document.getElementById('install-button');
        if (installButton) {
          installButton.style.display = 'none';
          installButton.removeEventListener('click', handleInstallButtonClick);
        }
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
};

export default useInstallPrompt;
