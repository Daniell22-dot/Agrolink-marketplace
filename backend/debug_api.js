const axios = require('axios');

async function debugBackend() {
    const API_URL = 'http://localhost:5000/api';
    try {
        console.log('--- ATTEMPTING LOGIN ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@agrolink.com',
            password: 'oromi@254'
        });
        
        const token = loginRes.data.accessToken;
        console.log('Login successful. Token acquired.');

        console.log('--- FETCHING USERS ---');
        const usersRes = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Response Status:', usersRes.status);
        console.log('Response Body:', JSON.stringify(usersRes.data, null, 2));

    } catch (err) {
        console.error('Debug Error:', err.response?.data || err.message);
    }
}

debugBackend();
