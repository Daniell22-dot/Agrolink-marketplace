// Anti-Inspect Protection
// Note: This provides deterrence but cannot completely prevent determined users
// Users can still access DevTools through browser menu

(function () {
    'use strict';

    // Disable right-click
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }

        // Ctrl+S (Save)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });

    // Detect DevTools
    let devtools = { open: false };
    const threshold = 160;

    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devtools.open) {
                devtools.open = true;
                // Redirect or show warning
                document.body.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
                        color: white;
                        font-family: Arial, sans-serif;
                        text-align: center;
                    ">
                        <div>
                            <h1 style="font-size: 3rem; margin-bottom: 1rem;">⚠️ Access Restricted</h1>
                            <p style="font-size: 1.5rem;">Developer tools are disabled on this application.</p>
                            <p style="margin-top: 2rem;">Please close DevTools and refresh the page.</p>
                            <button onclick="window.location.reload()" style="
                                margin-top: 2rem;
                                padding: 1rem 2rem;
                                font-size: 1.2rem;
                                background: #ff6f00;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                            ">Reload Page</button>
                        </div>
                    </div>
                `;
            }
        } else {
            devtools.open = false;
        }
    };

    // Check periodically
    setInterval(checkDevTools, 1000);

    // Debugger detection
    const detectDebugger = () => {
        const start = new Date();
        debugger;
        const end = new Date();
        if (end - start > 100) {
            window.location.reload();
        }
    };

    // Run debugger detection periodically (disabled by default as it's aggressive)
    // setInterval(detectDebugger, 1000);

    // Disable console functions in production
    if (process.env.NODE_ENV === 'production') {
        console.log = function () { };
        console.warn = function () { };
        console.error = function () { };
        console.info = function () { };
        console.debug = function () { };
    }

    // Clear console periodically
    setInterval(() => {
        if (typeof console.clear === 'function') {
            console.clear();
        }
    }, 2000);

    // Obfuscate source in Elements panel
    const obfuscateHTML = () => {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            // Remove comments
            const walker = document.createTreeWalker(
                el,
                NodeFilter.SHOW_COMMENT,
                null,
                false
            );

            let node;
            const commentsToRemove = [];
            while (node = walker.nextNode()) {
                commentsToRemove.push(node);
            }

            commentsToRemove.forEach(comment => comment.remove());
        });
    };

    // Run obfuscation after DOM loads
    window.addEventListener('load', obfuscateHTML);

    console.log('%c⚠️ STOP!', 'color: red; font-size: 60px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers.', 'font-size: 18px;');
    console.log('%cIf someone told you to copy-paste something here, it is a scam.', 'font-size: 18px;');
    console.log('%c⚠️ WARNING: Unauthorized access is prohibited!', 'color: red; font-size: 20px; font-weight: bold;');

})();
