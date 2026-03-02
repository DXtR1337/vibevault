const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');

    const keyLine = envFile.split('\n').find(line => line.startsWith('GOOGLE_GENERATIVE_AI_API_KEY='));
    if (keyLine) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = keyLine.split('=')[1].trim();
        console.log("API Key loaded (starts with):", process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 5) + "...");
    }
} catch (e) {
    console.error("Error reading .env.local:", e.message);
    process.exit(1);
}

// Manually fetch models using REST to see raw error if SDK hides it
async function listModels() {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    console.log("Fetching models list...");

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error("HTTP Error:", response.status, response.statusText);
            console.error("Error Body:", JSON.stringify(data, null, 2));
            return;
        }

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("No models found?", data);
        }
    } catch (err) {
        console.error("Network error:", err);
    }
}

listModels();
