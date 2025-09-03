import React, { useEffect } from 'react';
import { ACCESSIBILITY_WIDGET_CLIENT_ID } from '../../commons/config';
import "./accessibilityWidget.css";

const AccessibilityWidget= () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('data-account', ACCESSIBILITY_WIDGET_CLIENT_ID); // Replace with your account ID
    script.src = 'https://cdn.userway.org/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  return null; // This component does not render any UI
};

export default AccessibilityWidget;
