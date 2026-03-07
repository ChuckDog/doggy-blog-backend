
const API_URL = 'http://localhost:3001';

async function test() {
  try {
    console.log('Testing GET /posts ...');
    const res = await fetch(`${API_URL}/posts`);
    console.log('Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      if (Array.isArray(data) && data.length > 0) {
        console.log('First post:', data[0]);
      }
    } else {
      console.log('Error:', await res.text());
    }
  } catch (err) {
    console.error('Fetch failed:', err);
  }

  try {
    console.log('\nTesting GET /blog/posts ...');
    const res = await fetch(`${API_URL}/blog/posts`);
    console.log('Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
    } else {
      console.log('Error:', await res.text());
    }
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

test();
