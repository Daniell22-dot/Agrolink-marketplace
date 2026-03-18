const axios = require('axios');

const testAdminUsers = async () => {
  try {
    // 1. Login as admin
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@agrilink.com',
      password: 'password123'
    });
    
    const token = loginRes.data.accessToken;
    console.log('Login successful');
    
    // 2. Fetch users
    const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Users returned from API:');
    console.log(JSON.stringify(usersRes.data, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error testing admin users:', error.response?.data || error.message);
    process.exit(1);
  }
};

testAdminUsers();
