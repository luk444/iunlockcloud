async function testAPI() {
  try {
    const response = await fetch('https://cellunlocks.com/api/devices/357626314580821');
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.device && data.device.thumb) {
      console.log('Thumb found:', data.device.thumb);
      console.log('Image URL would be:', `https://cellunlocks.com/resize/100/${data.device.thumb}`);
    } else {
      console.log('No thumb found in response');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI(); 