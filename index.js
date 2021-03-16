require('dotenv').config();

const Discord = require('discord.js');
const keep_alive = require('./keep_alive.js');
const client = new Discord.Client();
const axios = require('axios');
const urls = [
	'https://www.reddit.com/r/dankgentina.json?sort=hot&limit=100',
	'https://www.reddit.com/r/dankmemes.json?sort=hot&limit=100',
	'comandos'
];
const isImageUrl = require('is-image-url');


client.on('ready', () => {
	console.log('Our bot is ready to go');
});

client.on('message', msg => {
	httpCall(msg, getUrl(msg.content));
});

function getUrl(message) {
	if (message === '!meme ar') {
		return urls[0];
	}
	if (message === '!meme us') {
		return urls[1];
	}
}

function itWasSent (url) {
  var fs = require('fs');
  var str1 = fs.readFileSync('imgs.txt', 'utf8');

  if (str1.includes(url)) return true;
  else {
    var concatString = (str1)+(url)+', ';

    fs.writeFile('imgs.txt', concatString, function (err) {
      if (err) return console.log(err);
    });
  }
  return false;
}

function yyyymmdd() {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

    var now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}

function checkDateSavedPost(fs,str1) {
  var fs = require('fs');
  var str1 = fs.readFileSync('imgs.txt', 'utf8');
  
  var dateToWrite = 'date : '+yyyymmdd()+', ';

  if (!str1.includes(dateToWrite)) {
    fs.writeFile('imgs.txt', dateToWrite, function (err) {
      if (err) return console.log(err);
    });
  }
}

function httpCall (msg, url) {
	checkDateSavedPost();
  if (!url) return;
	else {
		axios.get(url).then(response => {
      const redditJson = response.data;
			const post = redditJson.data.children.map(obj => obj.data.url);
			let number = Math.floor(Math.random() * post.length);

			let counter = number;
      var counterLap = 0;

      if (post[number].charAt(8) == 'i' && post[number].charAt(10) == 'r') {
        while (itWasSent(post[number])){
          counter = counter+1;

          if (counter > post.length) {
            counter = 0;
            counterLap = counterLap+1;
          }

          if (counterLap > 20) {
            break;
          }
        }
        
        if (counterLap < 20) {
          msg.channel.send(post[counter]);
        } else {
          msg.channel.send('No hay mas pa mostrar... o si xd');
        }
      } else {
        
      }
    })
  }
}

client.login(process.env.BOT_TOKEN);
