const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api/photos';
const CLEANUP_URL = 'http://localhost:3000/api/test-cleanup';
const CONCURRENT_USERS = 4;
const PHOTOS_PER_USER = 12;
const REPAIR_NUMBER = 'LOAD-TEST';
const LOG_FILE = path.join(__dirname, 'load-test.log');
const IMAGE_SIZE_MB = 4;

// Create a 4MB dummy buffer
const dummyImageBuffer = Buffer.alloc(IMAGE_SIZE_MB * 1024 * 1024, 'a');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

async function simulateUser(userId) {
    log(`Starting User ${userId}...`);

    const formData = new FormData();
    const blob = new Blob([dummyImageBuffer], { type: 'image/png' });

    formData.append('repairNumber', REPAIR_NUMBER);
    formData.append('stage', 'ENTRY');
    formData.append('technician', `User-${userId}`);
    formData.append('comments', `Batch upload 4MB x ${PHOTOS_PER_USER} from User ${userId}`);

    for (let i = 0; i < PHOTOS_PER_USER; i++) {
        formData.append('images', blob, `load-test-${userId}-${i}.png`);
    }

    try {
        const start = Date.now();
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();
        const duration = Date.now() - start;
        log(`[User ${userId}] Batch upload of ${PHOTOS_PER_USER} photos (4MB each) completed in ${duration}ms`);
        return { userId, success: true, duration };
    } catch (error) {
        log(`[User ${userId}] Batch upload failed: ${error.message}`);
        return { userId, success: false, error: error.message };
    }
}

async function cleanup() {
    log('Starting cleanup...');
    try {
        const response = await fetch(CLEANUP_URL);
        const data = await response.json();
        log(`Cleanup result: ${JSON.stringify(data)}`);
    } catch (error) {
        log(`Cleanup failed: ${error.message}`);
    }
}

async function runLoadTest() {
    log('----------------------------------------------------------------');
    log(`Starting load test: ${CONCURRENT_USERS} users, ${PHOTOS_PER_USER} photos each, ${IMAGE_SIZE_MB}MB per photo.`);

    const promises = [];
    for (let i = 1; i <= CONCURRENT_USERS; i++) {
        promises.push(simulateUser(i));
    }

    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.success).length;

    log(`Load test finished. Successful users: ${successCount}/${CONCURRENT_USERS}`);

    // Calculate average duration
    const successes = results.filter(r => r.success);
    if (successes.length > 0) {
        const avgDuration = successes.reduce((acc, curr) => acc + curr.duration, 0) / successes.length;
        log(`Average upload duration: ${avgDuration.toFixed(2)}ms`);
    }

    await cleanup();
}

runLoadTest();
