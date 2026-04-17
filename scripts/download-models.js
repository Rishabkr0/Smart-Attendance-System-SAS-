/* eslint-env node */
const fs = require('fs');
const https = require('https');
const path = require('path');

const modelsDir = path.join(__dirname, '../client/public/models');
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

const models = [
    'ssd_mobilenetv1_model-weights_manifest.json',
    'ssd_mobilenetv1_model-shard1',
    'ssd_mobilenetv1_model-shard2',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_expression_model-weights_manifest.json',
    'face_expression_model-shard1'
];

async function downloadFile(model) {
    const dest = path.join(modelsDir, model);
    if (fs.existsSync(dest)) {
        console.log(`Model ${model} already exists. Skipping.`);
        return;
    }
    
    return new Promise((resolve, reject) => {
        console.log(`Downloading ${model}...`);
        const file = fs.createWriteStream(dest);
        https.get(baseUrl + model, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err.message));
        });
    });
}

async function main() {
    try {
        for (const model of models) {
            await downloadFile(model);
        }
        console.log('All models downloaded successfully!');
    } catch (err) {
        console.error('Error downloading models:', err);
    }
}

main();
