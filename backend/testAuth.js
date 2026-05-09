const test = async () => {
  try {
    console.log('Testing connection to backend...');
    const res = await fetch('http://localhost:5000/');
    const text = await res.text();
    console.log('Backend Status:', text);

    console.log('Testing login with test data...');
    try {
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const data = await loginRes.json();
      console.log('Login Response:', data);
    } catch (err) {
      console.log('Login Error:', err.message);
    }
  } catch (err) {
    console.error('Connection Failed:', err.message);
  }
};

test();
