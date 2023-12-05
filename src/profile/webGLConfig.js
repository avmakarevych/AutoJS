const fs = require('fs');
const path = require('path');

function randomizeWebGL() {
    const filePath = path.join(__dirname, '..', '..', 'data', 'webGLConfigurations.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const webGLConfigurations = JSON.parse(data);
        return webGLConfigurations[Math.floor(Math.random() * webGLConfigurations.length)];
    } catch (err) {
        console.error('Error reading WebGL configurations:', err);
        throw err;
    }
}

module.exports = {
    randomizeWebGL
};
