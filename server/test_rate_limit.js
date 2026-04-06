const axios = require('axios');

async function testRateLimit() {
    for (let i = 1; i <= 6; i++) {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username: 'test',
                password: 'test'
            });
            console.log(`Request ${i}: Status ${res.status}`);
        } catch (error) {
            if (error.response) {
                console.log(`Request ${i}: Status ${error.response.status} - Data: ${JSON.stringify(error.response.data)}`);
            } else {
                console.log(`Request ${i}: Error ${error.message}`);
            }
        }
    }
}

testRateLimit();
