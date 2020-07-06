require('dotenv').config();
const TOKEN = process.env.TOKEN;

const tasks = require('./tasks')
const audio = require('./audio')
const TelegramBot = require('node-telegram-bot-api')
const debug = require('./helpers')
const firebase = require ('firebase')

console.log('Bot has been started ')

const app = firebase.initializeApp({
    apiKey: "AIzaSyBZiGQXKBM6MDIyScHJGdCHoiZCiLiLXSQ",
    authDomain: "abundancebot.firebaseapp.com",
    databaseURL: "https://abundancebot.firebaseio.com",
    projectId: "abundancebot",
    storageBucket: "abundancebot.appspot.com",
    messagingSenderId: "291151949330",
    appId: "1:291151949330:web:ce46e6a89986e24f63f2cb",
    measurementId: "G-0RBR9YEX3V"
});


const ref = firebase.database().ref();
const usersRef = ref.child('users');

const bot = new TelegramBot(TOKEN, {
    polling: true
        });

bot.on("polling_error", (err) => console.log(err));


// Getting audio IDs here:
 //bot.on('message', msg => {
   //  const { id } = msg.chat;
   //  bot.sendMessage(id, debug(msg));
//})



  bot.onText(/\/begin/, msg => {
      const { id } = msg.chat
// Starting out with sending out task for the day 0
      bot.sendMessage(id, tasks[0]);
// Creating a database entry for user in Firebase
      usersRef.child(id).set({ 
        name: msg.from.first_name,
        day: 1,
        date: msg.date
      });
      //bot.sendMessage(id, debug(msg));//
      bot.sendMessage(id,'You will recieve your first task within 24 hours. Now, rest.');


  });
  
function loadDate( id ) {
  usersRef.on('date', function(snapshot) {
  pastDate = (snapshot.val());
  return pastDate;
})
};

  function loadData( id ) {
    // Recieving current day number from Firebase 
            currentDayRef = usersRef.child(id).child('day');
            currentDayRef.transaction(function(currentDay) {
    // Sending out daily task and updating day number in Firebase
                bot.sendMessage(id, tasks[currentDay]);
                bot.sendAudio(id, audio[currentDay - 1] );
                return currentDay + 1;
            })
        };


  function checkDate( id ) {
    pastDate = loadDate( id );
    dateNow = new Date();
    if (dateNow - msg.date <= 86400000) {
        loadData();
    } else {
        bot.sendMessage(id, 'You were too late. Type /begin to start again.');
    }
  }

  
    
bot.onText(/\/dailytaskdone/, msg => {
    const { id } = msg.chat
    console.log('YO');
    
    loadData( id );
    console.log('YOY');
})

console.log('YOYOYO')
  
