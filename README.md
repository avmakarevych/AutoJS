# AutoJS

AutoJS is a browser automation framework designed to facilitate anonymous browsing and interaction with the web using Puppeteer. This project allows users to control a headless Chrome browser programmatically, providing a means to manage browser fingerprints, automate web navigation, and apply custom settings that enhance anonymity online.

## Features

- **Anonymity Focused**: Crafted with privacy in mind, allowing for browser fingerprint obfuscation.
- **Profile Management**: Generate and manage unique browser profiles to avoid tracking.
- **Custom Browser Settings**: Implement diverse settings across sessions to mimic natural user behavior and evade detection.
- **Plugin Emulation**: Simulate common browser plugins to blend in with regular traffic.
- **Advanced Scripting**: Automate complex browsing patterns and interactions to simulate real user activities.

## Getting Started

To begin using AutoJS for anonymous web browsing, ensure that you have Node.js installed on your system.

### Prerequisites

- Node.js (LTS version is recommended)
- npm (typically included with Node.js)

### Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/avmakarevych/AutoJS.git
```

2. Change into the project directory:

```bash
cd AutoJS
```

3. Install necessary dependencies:

```bash
npm install
```

### Usage

1. Run the application:

```bash
node app.js
```

2. When prompted, either select an existing profile or create a new one for anonymous browsing.

## Configuration

Customize the way browser profiles are handled in `profileManager.js` and the application of these profiles in `browserSettings.js`. Tailor these settings to fit the anonymity level you require.

## Contributing

Contributions to improve AutoJS are always welcome. Whether it's feature enhancements, bug fixes, or documentation improvements, feel free to fork the repository, make changes, and submit a pull request.

## License

This project is open-sourced under the MIT License. See the [LICENSE](LICENSE) file for full details.

## Acknowledgments

- The [Puppeteer](https://github.com/puppeteer/puppeteer) community for their excellent browser automation tool.
- [FingerprintJS](https://fingerprint.com/) for the tools to test and showcase this project's anonymity features.

---

Stay private and secure in your automated browsing endeavors!
