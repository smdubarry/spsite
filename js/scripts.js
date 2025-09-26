/*!
 * Start Bootstrap - Modern Business v5.0.7 (https://startbootstrap.com/template-overviews/modern-business)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-modern-business/blob/master/LICENSE)
 */

// Custom scripts for this template
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = year;
    });

    const calendlyLinks = Array.from(document.querySelectorAll('.calendly-link[data-calendly-url]'));
    if (!calendlyLinks.length) {
        return;
    }

    const CALENDLY_SCRIPT_ID = 'calendly-widget-script';
    const CALENDLY_STYLES_ID = 'calendly-widget-styles';
    let calendlyLoader;

    const ensureCalendlyLoaded = () => {
        if (window.Calendly) {
            return Promise.resolve();
        }

        if (!calendlyLoader) {
            calendlyLoader = new Promise((resolve, reject) => {
                if (!document.getElementById(CALENDLY_STYLES_ID)) {
                    const styles = document.createElement('link');
                    styles.id = CALENDLY_STYLES_ID;
                    styles.rel = 'stylesheet';
                    styles.href = 'https://assets.calendly.com/assets/external/widget.css';
                    document.head.appendChild(styles);
                }

                let script = document.getElementById(CALENDLY_SCRIPT_ID);
                if (!script) {
                    script = document.createElement('script');
                    script.id = CALENDLY_SCRIPT_ID;
                    script.src = 'https://assets.calendly.com/assets/external/widget.js';
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = () => {
                        calendlyLoader = undefined;
                        reject(new Error('Failed to load Calendly widget'));
                    };
                    document.head.appendChild(script);
                } else {
                    script.addEventListener('load', () => resolve());
                    script.addEventListener('error', () => {
                        calendlyLoader = undefined;
                        reject(new Error('Failed to load Calendly widget'));
                    });
                }
            });
        }

        return calendlyLoader;
    };

    calendlyLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const url = link.getAttribute('data-calendly-url');
            if (!url) {
                return;
            }

            ensureCalendlyLoaded()
                .then(() => {
                    if (window.Calendly) {
                        window.Calendly.initPopupWidget({ url });
                    }
                })
                .catch(() => {
                    // Fail silently if the script cannot be loaded.
                });
        });
    });
});

