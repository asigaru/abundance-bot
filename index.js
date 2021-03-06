// Connecting general dependencies 

require('dotenv').config();
const TOKEN = process.env.TOKEN;
const firebase = require ('firebase')
const TelegramBot = require('node-telegram-bot-api')

// Connecting internal data files and development scripts
// const debug = require('./helpers')
const tasks = require('./tasks')
const audio = require('./audio')

console.log('Bot has been started ')

// Initializing Firebase
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

// Pointing Firebase DataBase references to variables
const ref = firebase.database().ref();
const usersRef = ref.child('users');

// Initializing bot object with default settings

const bot = new TelegramBot(TOKEN, {
    polling: true
        });

        // Catching polling errors
bot.on("polling_error", (err) => console.log(err));


  bot.onText(/\/begin/, msg => {
// Creating local variable referencing details of incoming /begin command
      const { id } = msg.chat
// Sending out task for the day 0
      bot.sendMessage(id, tasks[0]);
// Creating a database entry with telegram uId as key
      usersRef.child(id).set({ 
        name: msg.from.first_name,
        day: 1,
        date: msg.date
      });
      bot.sendMessage(id,"\n*\n*\n*\nType /ready to recieve your next day's task and audio file.");


  });
 
  
// Function that retrieves date data from DB with snapshot function

async function getDate( id ) {

  usersRef.child(id).once('value').then(function(snapshot) {
    const date = snapshot.val().date;

  // If data is successfully retrieved from DB and variable is populated - proceed to checkDate function; otherwise throw an error
    if (date) {
      checkDate( id, date );
    }
  }).catch(function(error) {
    console.log('Unable to get date: ' + error);
  })
};

// Callback function that checks that user sent confirmation of completing tasks within 24h limit

  function checkDate( id, date ) {

    dateNow = Date.now();
    let diff = dateNow - date;

// Some console logs left for development purposes and troubleshooting
    console.log('date now is ' + dateNow);
    console.log('Past date is ' + date);
    console.log('Time difference is');
    console.log(diff);
    
    if (diff >= 86400000) {
       loadData( id );
    } else {
        bot.sendMessage(id, 'You were too late. Type /begin to start again.');
    }
  }

  // Function to communicate with Firebase DB 
  function loadData( id ) {
    // Assigning reference to DB entry to variable
            currentDayRef = usersRef.child(id).child('day');
    // Reading data from DB with snapshot function
            currentDayRef.once('value').then(function(snapshot) {
    // Trying to assign value from DB to a local variable
                const currentDay = snapshot.val();
    // When and if data read succesfully 
              if (currentDay) {
                bot.sendMessage(id, tasks[currentDay]).then(() => {
                  bot.sendAudio(id, audio[currentDay - 1] )
                })   // Here sendMessages are chained with .then to make sure that audio file arrives after text

    // Updating DB with new day and date values after sending the tasks to user
                const update = {};
                update['/users/' + id + '/day'] = currentDay + 1;
                update['/users/' + id + '/date'] = Date.now();
                firebase.database().ref().update(update);
              }
            }).catch(function(error) {
              console.log('Unable to load data: ' + error);
            }) // Catching possible errors
        };
  
    // RegExp trigger for sending daily task and updating DB entry
bot.onText(/\/ready/, msg => {
    const { id } = msg.chat
    getDate( id );
})

  
