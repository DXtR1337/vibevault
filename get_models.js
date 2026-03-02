const fs = require('fs');
const path = require('path');

// Load API Key
try {
    const envPath = path.resolve(__dirname, '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const keyLine = envFile.split('\n').find(line => line.startsWith('GOOGLE_GENERATIVE_AI_API_KEY='));
    if (keyLine) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = keyLine.split('=')[1].trim();
    }
} catch (e) { }

async function listAllModels() {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const names = data.models.map(m => m.name).join('\n');
            console.log("Models found and saved to models_list.txt");
            fs.writeFileSync('models_list.txt', names);
        } else {
            console.log("No models found in response:", JSON.stringify(data));
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

listAllModels();
