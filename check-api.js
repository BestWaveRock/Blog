// 检查API连接的简单脚本
const checkAPI = async () => {
  try {
    console.log('Testing direct API connection...');
    const response = await fetch('http://localhost:3000/api/articles');
    console.log('Direct API response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Direct API data received:', Array.isArray(data) ? data[0]?.length : 'Not an array');
    } else {
      console.log('Direct API error response:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('Direct API connection failed:', error.message);
  }

  try {
    console.log('Testing relative API connection...');
    const response = await fetch('/api/articles');
    console.log('Relative API response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Relative API data received:', Array.isArray(data) ? data[0]?.length : 'Not an array');
    } else {
      console.log('Relative API error response:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('Relative API connection failed:', error.message);
  }
};

checkAPI();