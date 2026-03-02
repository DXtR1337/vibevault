const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load API Key
try {
    const envPath = path.resolve(__dirname, '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const keyLine = envFile.split('\n').find(line => line.startsWith('GOOGLE_GENERATIVE_AI_API_KEY='));
    if (keyLine) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = keyLine.split('=')[1].trim();
    } else {
        throw new Error("Key not found");
    }
} catch (e) {
    console.error("Error loading key:", e.message);
    process.exit(1);
}

async function findWorkingModel() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    // Potential models to try
    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-pro-latest",
        "gemini-1.0-pro",
        "gemini-pro",
        "gemini-flash"
    ];

    console.log("Testing models for generation...");

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log("SUCCESS! ✅");
            console.log(`>>> WORKING MODEL FOUND: ${modelName} <<<`);
            return;
        } catch (error) {
            console.log(`FAILED ❌ (${error.status || 'Error'}: ${error.message?.split(':')[0]})`);
        }
    }
    console.log("No working models found in common list.");
}

findWorkingModel();
