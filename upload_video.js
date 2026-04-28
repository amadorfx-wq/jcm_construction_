const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function uploadVideo() {
  const filePath = path.join(__dirname, 'public', 'video', 'hero-construction.mp4');
  
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(filePath);
  const fileName = 'hero-construction.mp4';
  
  console.log(`Uploading ${fileName}...`);
  
  try {
    const blob = await put(fileName, fileStream, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    console.log('\n✅ Upload Successful!');
    console.log('🔗 URL:', blob.url);
  } catch (err) {
    console.error('Error uploading:', err);
  }
}

uploadVideo();
