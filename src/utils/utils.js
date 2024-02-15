function randomizeFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomBoolean() {
  return Math.random() < 0.5;
}

function randomChromeObject() {
  return Math.random() < 0.5
    ? {
        runtime: {},
        // Additional random properties can be added here
      }
    : {};
}

function randomPlugins() {
  const commonPlugins = [
    {
      name: "Chrome PDF Plugin",
      description: "Portable Document Format",
      filename: "internal-pdf-viewer",
      mimeType: "application/pdf~pdf",
    },
    {
      name: "Chrome PDF Viewer",
      description: "Portable Document Format",
      filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
      mimeType: "application/pdf~pdf",
    },
    {
      name: "Native Client",
      description: "",
      filename: "internal-nacl-plugin",
      mimeType: "application/x-nacl~,application/x-pnacl~",
    },
    {
      name: "WebKit built-in PDF",
      description: "Portable Document Format",
      filename: "internal-pdf-viewer",
      mimeType: "application/pdf~pdf",
    },
    {
      name: "Microsoft Silverlight",
      description: "Silverlight plug-in",
      filename: "npctrl.dll",
      mimeType: "application/x-silverlight-2~",
    },
    {
      name: "Adobe Acrobat",
      description: "PDF Plug-In For Firefox and Netscape",
      filename: "nppdf32.dll",
      mimeType:
        "application/pdf~,application/vnd.adobe.xfdf~,application/vnd.fdf~,application/vnd.adobe.xdp+xml",
    },
    {
      name: "QuickTime Plug-in",
      description:
        "The QuickTime Plugin allows you to view a wide variety of multimedia content in web pages.",
      filename: "QuickTimePlugin.plugin",
      mimeType: "video/quicktime~,audio/x-mpeg~,audio/aiff~,audio/x-wav",
    },
    {
      name: "Shockwave Flash",
      description: "Shockwave Flash 32.0 r0",
      filename: "pepflashplayer.dll",
      mimeType:
        "application/x-shockwave-flash~swf,application/futuresplash~spl",
    },
    {
      name: "Java(TM) Platform",
      description: "Next Generation Java Plug-in for Mozilla browsers.",
      filename: "npjp2.dll",
      mimeType:
        "application/x-java-applet~,application/x-java-applet;jpi-version=1.8.0_151",
    },
  ];

  // Randomly select a number of plugins from the commonPlugins list
  const pluginCount = Math.floor(Math.random() * commonPlugins.length) + 3;
  const selectedPlugins = [];
  for (let i = 0; i < pluginCount; i++) {
    const index = Math.floor(Math.random() * commonPlugins.length);
    selectedPlugins.push(commonPlugins[index]);
  }

  // Format the selected plugins in the desired structure
  return selectedPlugins.map((plugin) => {
    return `${plugin.name}::${plugin.description}::${plugin.filename}::${plugin.mimeType}`;
  });
}

function randomLanguages() {
  const baseLanguages = ["en-US", "en", "ru"];
  const additionalLanguages = [
    "fr",
    "de",
    "es",
    "uk-UA",
    "uk",
    "ar",
    "ja",
    "ko",
    "zh-CN",
    "it",
    "nl",
    "pt",
    "sv",
    "fi",
    "no",
    "da",
    "tr",
    "pl",
    "hu",
    "cs",
    "ro",
    "bg",
    "el",
    "th",
    "vi",
    "hi",
    "he",
    "id",
    "ms",
    "fil",
  ];

  const selectedLanguages = Array.from(
    { length: Math.floor(Math.random() * 4) + 3 },
    (_, i) => {
      if (i < baseLanguages.length) {
        return baseLanguages[i];
      } else {
        const randomIndex = Math.floor(
          Math.random() * additionalLanguages.length,
        );
        return additionalLanguages[randomIndex];
      }
    },
  );

  return selectedLanguages;
}

function randomMediaDevices() {
  return Math.random() < 0.5 ? "all" : "limited";
}

function randomConsoleDebugBehavior() {
  return Math.random() < 0.5 ? "disabled" : "enabled";
}

function randomizeCanvasFingerprint() {
  const textModifier = Math.random().toString(36).substring(2, 15); // Generates a random string

  const canvasFingerprint = {
    textModifier: textModifier,
    // You can add more properties here if needed for further canvas manipulation
  };

  return canvasFingerprint;
}

function randomizeWebGLFingerprint() {
  // Randomize values for WebGL fingerprint properties
  return {
    maxTextureSize: getRandomValueWithinRange(8192, 16384), // WebGL MAX_TEXTURE_SIZE range
    precisionOffset: getRandomValueWithinRange(-1, 1), // Offset for shader precision
    rangeMinOffset: getRandomValueWithinRange(-1, 1), // Offset for shader range minimum
    rangeMaxOffset: getRandomValueWithinRange(-1, 1), // Offset for shader range maximum
    drawArraysCountOffset: getRandomValueWithinRange(-5, 5), // Offset for drawArrays count parameter
    drawElementsCountOffset: getRandomValueWithinRange(-5, 5), // Offset for drawElements count parameter
  };
}

function getRandomValueWithinRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeAudioContext() {
  return {
    sampleRate: [44100, 48000][Math.floor(Math.random() * 2)],
  };
}
function randomizeFeatureControlData() {
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
  // Object to hold randomized feature availability and behavior
  const featureAvailability = featuresToOverride.reduce((acc, feature) => {
    acc[feature] = Math.random() > 0.5; // Randomly determine if a feature is available
    return acc;
  }, {});

  return {
    ...featureAvailability,
    reRandomizeInterval: getRandomInt(5000, 15000),
    toggleRate: Math.random(),
  };
}

function randomizeFontPreferences() {
  return {
    apple: getRandomFontSize(),
    default: getRandomFontSize(),
    min: getRandomMinFontSize(),
    mono: getRandomFontSize(),
    sans: getRandomFontSize(),
    serif: getRandomFontSize(),
    system: getRandomFontSize(),
  };
}

function randomizeFonts() {
  const fontList = [
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
    "Arial Unicode MS",
    "Gill Sans",
    "Helvetica Neue",
    "Menlo",
    // ... other font names
  ];
  // Randomize the list and pick the first few as the preferred fonts
  return getRandomSubset(fontList, 4); // for example, pick 4 random fonts
}

function getRandomFontSize() {
  return Math.random() * (149 - 120) + 120; // Example: random font size between 9 and 150
}

function getRandomMinFontSize() {
  return Math.random() * (12 - 9) + 9; // Example: random min font size between 9 and 12
}

function getRandomSubset(arr, size) {
  const shuffled = arr.slice(0);
  let i = arr.length;
  while (i--) {
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

function getRandomValueWithinRanges(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
  randomizeFromList,
  randomBoolean,
  randomChromeObject,
  randomPlugins,
  randomLanguages,
  randomMediaDevices,
  randomConsoleDebugBehavior,
  randomizeCanvasFingerprint,
  randomizeAudioContext,
  randomizeWebGLFingerprint,
  randomizeFontPreferences,
  randomizeFonts,
  randomizeFeatureControlData,
};
