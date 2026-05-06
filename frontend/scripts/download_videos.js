const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  { name: 'pizza.mp4', url: 'https://assets.mixkit.co/videos/preview/mixkit-delicious-pizza-in-a-wood-oven-5171-large.mp4' },
  { name: 'burger.mp4', url: 'https://assets.mixkit.co/videos/preview/mixkit-burger-with-melted-cheese-making-47353-large.mp4' },
  { name: 'paneer.mp4', url: 'https://assets.mixkit.co/videos/preview/mixkit-person-adding-sauce-to-a-plate-of-food-43552-large.mp4' },
  { name: 'chicken.mp4', url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-turning-pieces-of-chicken-on-a-grill-41662-large.mp4' }
];

const videosDir = path.join(__dirname, '..', 'public', 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

urls.forEach(item => {
  const filePath = path.join(videosDir, item.name);
  console.log(`Downloading ${item.name}...`);
  https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Done downloading ${item.name}`);
      });
    } else {
      console.error(`Failed to download ${item.name}: ${res.statusCode}`);
    }
  }).on('error', err => {
    console.error(`Error downloading ${item.name}: ${err.message}`);
  });
});
