function randomizeFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function randomBoolean() {
    return Math.random() < 0.5;
}

function randomChromeObject() {
    return Math.random() < 0.5 ? {
        runtime: {},
        // Additional random properties can be added here
    } : {};
}

function randomPlugins() {
    const commonPlugins = [
        {
            name: "Chrome PDF Plugin",
            description: "Portable Document Format",
            filename: "internal-pdf-viewer",
            mimeType: "application/pdf~pdf"
        },
        {
            name: "Chrome PDF Viewer",
            description: "Portable Document Format",
            filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
            mimeType: "application/pdf~pdf"
        },
        {
            name: "Native Client",
            description: "",
            filename: "internal-nacl-plugin",
            mimeType: "application/x-nacl~,application/x-pnacl~"
        },
        {
            name: "WebKit built-in PDF",
            description: "Portable Document Format",
            filename: "internal-pdf-viewer",
            mimeType: "application/pdf~pdf"
        },
        {
            name: "Microsoft Silverlight",
            description: "Silverlight plug-in",
            filename: "npctrl.dll",
            mimeType: "application/x-silverlight-2~"
        },
        {
            name: "Adobe Acrobat",
            description: "PDF Plug-In For Firefox and Netscape",
            filename: "nppdf32.dll",
            mimeType: "application/pdf~,application/vnd.adobe.xfdf~,application/vnd.fdf~,application/vnd.adobe.xdp+xml"
        },
        {
            name: "QuickTime Plug-in",
            description: "The QuickTime Plugin allows you to view a wide variety of multimedia content in web pages.",
            filename: "QuickTimePlugin.plugin",
            mimeType: "video/quicktime~,audio/x-mpeg~,audio/aiff~,audio/x-wav"
        },
        {
            name: "Shockwave Flash",
            description: "Shockwave Flash 32.0 r0",
            filename: "pepflashplayer.dll",
            mimeType: "application/x-shockwave-flash~swf,application/futuresplash~spl"
        },
        {
            name: "Java(TM) Platform",
            description: "Next Generation Java Plug-in for Mozilla browsers.",
            filename: "npjp2.dll",
            mimeType: "application/x-java-applet~,application/x-java-applet;jpi-version=1.8.0_151"
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
    return selectedPlugins.map(plugin => {
        return `${plugin.name}::${plugin.description}::${plugin.filename}::${plugin.mimeType}`;
    });
}

function randomLanguages() {
    const baseLanguages = ['en-US', 'en', 'ru'];
    const additionalLanguages = [
        'fr', 'de', 'es', 'uk-UA', 'uk',
        'ar', 'ja', 'ko', 'zh-CN', 'it',
        'nl', 'pt', 'sv', 'fi', 'no',
        'da', 'tr', 'pl', 'hu', 'cs',
        'ro', 'bg', 'el', 'th', 'vi',
        'hi', 'he', 'id', 'ms', 'fil'
    ];

    const selectedLanguages = Array.from({ length: Math.floor(Math.random() * 4) + 3 }, (_, i) => {
        if (i < baseLanguages.length) {
            return baseLanguages[i];
        } else {
            const randomIndex = Math.floor(Math.random() * additionalLanguages.length);
            return additionalLanguages[randomIndex];
        }
    });

    return { languages: selectedLanguages };
}

function randomMediaDevices() {
    return Math.random() < 0.5 ? 'all' : 'limited';
}

function randomConsoleDebugBehavior() {
    return Math.random() < 0.5 ? 'disabled' : 'enabled';
}

function randomizeCanvasFingerprint() {
    return {
        fillStyle: 'rgba(0,0,0,' + (Math.random() / 100).toFixed(2) + ')'
    };
}

function randomizeAudioContext() {
    return {
        sampleRate: [44100, 48000][Math.floor(Math.random() * 2)]
    };
}

module.exports = {
    randomizeFromList,
    randomBoolean,
    randomChromeObject,
    randomPlugins,
    randomLanguages,
    randomMediaDevices,
    randomConsoleDebugBehavior,
    randomizeCanvasFingerprint,
    randomizeAudioContext
};
