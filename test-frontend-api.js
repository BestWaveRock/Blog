// 测试前端API调用的脚本
const testFrontendApi = async () => {
  try {
    console.log('Testing frontend API call...');

    // 模拟前端的fetch调用
    const response = await fetch('http://localhost:3001/api/articles?page=1&limit=10&status=published');

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('Data type:', Array.isArray(data) ? 'array' : typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'N/A');

      if (Array.isArray(data) && data.length > 0) {
        console.log('First element type:', Array.isArray(data[0]) ? 'array' : typeof data[0]);
        if (Array.isArray(data[0])) {
          console.log('First sub-array length:', data[0].length);
          console.log('First few articles:', data[0].slice(0, 2));
        }
      }
    } else {
      console.log('Error response:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error body:', errorText);
    }
  } catch (error) {
    console.log('Fetch error:', error.message);
  }
};

testFrontendApi();