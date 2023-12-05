async function applyProfileToPage(page, profile) {
    // Set viewport and user agent
    await page.setViewport(profile.screenResolution);
    await page.setUserAgent(profile.userAgent);


    // Evaluate profile settings on the new document
    await page.evaluateOnNewDocument((profile) => {

        // Chrome Object
        window.navigator.chrome = profile.chromeObject;

        // Languages
        Object.defineProperty(navigator, 'languages', {
            get: () => [profile.languages],
        });

        if (WebGLRenderingContext.prototype.getParameter) {
            const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                // Return consistent values for specific parameters
                if (parameter === 37445) {
                    return profile.webglVendor;
                }
                if (parameter === 37446) {
                    return profile.webglRenderer;
                }
                // Call the original method for any other parameters
                return originalGetParameter.call(this, parameter);
            };
        }

        // MediaDevices Enumeration
        const mediaDevices = navigator.mediaDevices.enumerateDevices;
        navigator.mediaDevices.enumerateDevices = async () => {
            const devices = await mediaDevices.apply(navigator.mediaDevices);
            return profile.mediaDevices === 'limited' ?
                devices.filter(device => device.kind !== 'audioinput' && device.kind !== 'videoinput') :
                devices;
        };

        // Console Debug Behavior
        const originalConsoleDebug = console.debug;
        console.debug = profile.consoleDebugBehavior === 'disabled' ? () => {} : originalConsoleDebug;

        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
            const context = originalGetContext.call(this, contextType, contextAttributes);
            if (contextType === "2d") {
                const originalFillStyle = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "fillStyle");
                Object.defineProperty(context, "fillStyle", {
                    get: function() {
                        return originalFillStyle.get.call(this);
                    },
                    set: function(value) {
                        if (typeof value === "string" && value.startsWith("rgba")) {
                            originalFillStyle.set.call(this, profile.canvasFingerprint.fillStyle);
                        } else {
                            originalFillStyle.set.call(this, value);
                        }
                    }
                });
            }
            return context;
        };

        // Apply AudioContext
        const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
        if (OriginalAudioContext) {
            Object.defineProperty(window, "AudioContext", {
                value: class extends OriginalAudioContext {
                    constructor() {
                        super();
                        Object.defineProperty(this, 'sampleRate', {
                            value: profile.audioContext.sampleRate,
                            writable: false
                        });
                    }
                }
            });
        }

    }, profile);
}

module.exports = {
    applyProfileToPage
};
