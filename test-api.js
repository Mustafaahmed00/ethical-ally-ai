// Simple test script to check if the chat API is working
// Run with: node test-api.js

const axios = require('axios');

async function testChatApi() {
    console.log('Testing chat API...');

    try {
        const response = await axios.post('http://localhost:3001/api/chat', {
            message: 'How should I handle allocating scarce medications during a respiratory pandemic?',
            context: {
                domain: 'HEALTHCARE'
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('API Response Status:', response.status);
        console.log('API Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data.error) {
            console.error('API Error:', response.data.error);
            console.error('Details:', response.data.details);
        } else {
            console.log('API call successful!');
        }
    } catch (error) {
        console.error('Error making API call:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testChatApi(); 