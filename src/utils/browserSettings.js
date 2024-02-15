const randomFontMetric = () => Math.random() * 150 + 10; // Random metric between 10 and 160
const randomFonts = () => {
  const availableFonts = [
    "Arial",
    "Verdana",
    "Helvetica",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script MT",
  ];
  // Shuffle and pick random 4 fonts
  return availableFonts.sort(() => 0.5 - Math.random()).slice(0, 4);
};

async function applyProfileToPage(browser, page, profile) {
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await page.evaluateOnNewDocument((profile) => {
    window.navigator.chrome = profile.chromeObject;

    Object.defineProperty(navigator, "languages", {
      get: () => [profile.languages],
    });

    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);

    if (WebGLRenderingContext.prototype.getParameter) {
      const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (parameter) {
        // Existing overrides
        if (parameter === 37445) {
          return profile.webglVendor;
        }
        if (parameter === 37446) {
          return profile.webglRenderer;
        }
        return originalGetParameter.call(this, parameter);
      };
    }

    // Modify WebGL drawing functions
    if (
      WebGLRenderingContext.prototype.drawArrays ||
      WebGLRenderingContext.prototype.drawElements
    ) {
      const originalDrawArrays = WebGLRenderingContext.prototype.drawArrays;
      const originalDrawElements = WebGLRenderingContext.prototype.drawElements;

      // Overriding drawArrays
      WebGLRenderingContext.prototype.drawArrays = function (...args) {
        // Manipulate drawing arguments here, if needed
        originalDrawArrays.apply(this, args);
      };

      // Overriding drawElements
      WebGLRenderingContext.prototype.drawElements = function (...args) {
        // Manipulate drawing arguments here, if needed
        originalDrawElements.apply(this, args);
      };
    }
  }, profile);
  const pages = await browser.pages();
  await Promise.all(
    pages.map((page) => injectEnhancedCanvasModScript(page, profile)),
  );
  await Promise.all(pages.map((page) => injectWebGLModScript(page, profile)));
  await page.evaluateOnNewDocument(() => {
    const modifyFontFingerprint = () => {
      const newFontPreferences = {
        apple: randomFontMetric(),
        default: randomFontMetric(),
        min: randomFontMetric(),
        mono: randomFontMetric(),
        sans: randomFontMetric(),
        serif: randomFontMetric(),
        system: randomFontMetric(),
      };

      Object.defineProperty(window, "fontPreferences", {
        get: () => newFontPreferences,
      });

      const newFonts = randomFonts();
      Object.defineProperty(window, "fonts", {
        get: () => newFonts,
      });
    };

    modifyFontFingerprint();
  });

  //await injectComplexFeatureControlScript(page, profile);
  //await Promise.all(pages.map(page => injectComplexFeatureControlScript(page, profile)));
  // Ensure new pages also receive the enhanced script
  browser.on("targetcreated", async (target) => {
    if (target.type() === "page") {
      const page = await target.page();
      if (page) {
        await injectEnhancedCanvasModScript(page, profile);
        await injectWebGLModScript(page, profile);
        //await injectComplexFeatureControlScript(page, profile)
      }
    }
  });
}
async function injectWebGLModScript(page, profile) {
  const webGLFingerprint = profile.webGLFingerprint; // Profile-specific WebGL settings
  await page.evaluateOnNewDocument((webGLFingerprint) => {
    const modifyWebGLProto = () => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;

      HTMLCanvasElement.prototype.getContext = function (contextType, ...args) {
        const context = origGetContext.call(this, contextType, ...args);

        if (contextType === "webgl" || contextType === "webgl2") {
          const origGetParameter = context.getParameter;
          const origGetShaderPrecisionFormat = context.getShaderPrecisionFormat;

          // Manipulate getParameter to return modified values
          context.getParameter = function (parameter) {
            // Alter MAX_TEXTURE_SIZE to affect texture related operations
            if (parameter === context.MAX_TEXTURE_SIZE) {
              return webGLFingerprint.maxTextureSize;
            }
            // Implement other parameter changes as needed
            return origGetParameter.call(this, parameter);
          };

          // Manipulate shader precision to introduce variability
          context.getShaderPrecisionFormat = function (
            shadertype,
            precisiontype,
          ) {
            let format = origGetShaderPrecisionFormat.call(
              this,
              shadertype,
              precisiontype,
            );
            // Introduce variability in precision
            if (format) {
              format.precision = Math.max(
                format.precision + (webGLFingerprint.precisionOffset || 0),
                0,
              ); // Ensure precision doesn't go negative
              format.rangeMin = Math.max(
                format.rangeMin + (webGLFingerprint.rangeMinOffset || 0),
                format.rangeMin,
              ); // Ensure rangeMin doesn't decrease below original value
              format.rangeMax = Math.min(
                format.rangeMax + (webGLFingerprint.rangeMaxOffset || 0),
                format.rangeMax,
              ); // Ensure rangeMax doesn't exceed original value
            }
            return format;
          };

          // Override drawArrays to alter the rendered content slightly
          const origDrawArrays = context.drawArrays;
          context.drawArrays = function (...args) {
            // Example: Slightly modify the 'count' parameter
            if (args.length >= 3 && typeof args[2] === "number") {
              args[2] = Math.max(
                args[2] + (webGLFingerprint.drawArraysCountOffset || 0),
                0,
              ); // Ensure count doesn't go negative
            }
            origDrawArrays.apply(this, args);
          };

          // Override drawElements to alter the rendered content slightly
          const origDrawElements = context.drawElements;
          context.drawElements = function (...args) {
            // Example: Slightly modify the 'count' parameter
            if (args.length >= 2 && typeof args[1] === "number") {
              args[1] = Math.max(
                args[1] + (webGLFingerprint.drawElementsCountOffset || 0),
                0,
              ); // Ensure count doesn't go negative
            }
            origDrawElements.apply(this, args);
          };

          // Additional modifications to other WebGL functions can be added here
          // to further alter the fingerprint...
        }

        return context;
      };
    };

    modifyWebGLProto();
  }, webGLFingerprint);
}

async function injectComplexFeatureControlScript(page, profile) {
  const featureControlData = profile.featureControlData; // Profile-specific control settings
  await page.evaluateOnNewDocument((featureControlData) => {
    // Override properties and methods with complex behavior
    const complexOverride = (key, generateValue) => {
      let value = generateValue();
      Object.defineProperty(window, key, {
        get: () => (featureControlData[key] ? value : undefined),
        configurable: true,
      });
      // Re-randomize at intervals
      setInterval(() => {
        value = generateValue();
      }, featureControlData.reRandomizeInterval);
    };

    // Generate random behavior for feature checks
    const getRandomFeatureResponse = () => {
      const responses = ["probably", "maybe", ""];
      return responses[Math.floor(Math.random() * responses.length)];
    };

    // Define complex behaviors for various features
    complexOverride("HTMLAudioElement", () => ({
      canPlayType: () => getRandomFeatureResponse(),
    }));

    complexOverride("HTMLVideoElement", () => ({
      canPlayType: () => getRandomFeatureResponse(),
    }));

    complexOverride("AudioContext", () => ({
      // An actual AudioContext instance or undefined, randomized
      value:
        Math.random() > 0.5
          ? new (window.AudioContext || window.webkitAudioContext)()
          : undefined,
    }));

    // Additional complex behavior definitions for other feature checks...

    // Override other feature detections with complex randomized results
    const featuresToOverride = [
      "fetch",
      "localStorage",
      "sessionStorage",
      "serviceWorker",
      "pushManager",
      "speechSynthesis",
      "webkitSpeechSynthesis",
      "speechRecognition",
      "webkitSpeechRecognition",
      "geolocation",
      "PointerEvent",
      "MSPointerEvent",
      "webkitPointerEvent",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "indexedDB",
      "webkitIndexedDB",
      "mozIndexedDB",
      "OIndexedDB",
      "msIndexedDB",
      "CSS",
      "DOMMatrix",
      "DOMPoint",
      "DOMRect",
      "DOMQuad",
      "FontFace",
      "FormData",
      "History",
      "IntersectionObserver",
      "Map",
      "Set",
      "URL",
      "URLSearchParams",
      "VRDisplay",
      "WebGLRenderingContext",
      "WebGL2RenderingContext",
      "WebSocket",
      "Worker",
      "SharedWorker",
      "Notification",
      "Performance",
      "PerformanceObserver",
      "Promise",
      "ResizeObserver",
      "ShadowRoot",
      "SVGElement",
      "XMLHttpRequest",
      // ... any other features you want to include
    ];
    featuresToOverride.forEach((feature) => {
      complexOverride(feature, () => {
        // Some features might be toggled on and off
        return Math.random() > featureControlData.toggleRate
          ? window[feature]
          : undefined;
      });
    });

    featureControlData.reRandomizeInterval =
      Math.floor(Math.random() * 10000) + 5000;
    featureControlData.toggleRate = Math.random(); // Chance of a feature being toggled off
  }, featureControlData);
}

async function injectEnhancedCanvasModScript(page, profile) {
  const canvasFingerprint = profile.canvasFingerprint;
  await page.evaluateOnNewDocument((canvasFingerprint) => {
    // Modify the canvas prototype
    const modifyCanvasProto = () => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        const context = origGetContext.call(this, type, ...args);

        if (type === "2d") {
          // Override the fillText function
          const origFillText = context.fillText;
          context.fillText = function (text, x, y, maxWidth) {
            // Use the value from the profile's canvas fingerprint
            const textToDraw = text + canvasFingerprint.textModifier;
            origFillText.call(this, textToDraw, x, y, maxWidth);
          };

          // Override the strokeText function
          const origStrokeText = context.strokeText;
          context.strokeText = function (text, x, y, maxWidth) {
            // Use the value from the profile's canvas fingerprint
            const textToDraw = text + canvasFingerprint.textModifier;
            origStrokeText.call(this, textToDraw, x, y, maxWidth);
          };

          // Additional overrides can be added here
        }

        return context;
      };
    };

    modifyCanvasProto();
  }, canvasFingerprint);
}

export { applyProfileToPage };
