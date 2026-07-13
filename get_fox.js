const https = require('https');
https.get('https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gitlab.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
});
