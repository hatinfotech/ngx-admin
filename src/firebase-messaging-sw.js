importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyCqLj9QQ0KUuLackTP-GTBrKL6byBaCz54",
    authDomain: "smart-bot-7e8ca.firebaseapp.com",
    databaseURL: "https://smart-bot-7e8ca.firebaseio.com",
    projectId: "smart-bot-7e8ca",
    storageBucket: "smart-bot-7e8ca.appspot.com",
    messagingSenderId: "316262946834",
    appId: "1:316262946834:web:f8e595eb803da324ce20cb",
    measurementId: "G-1KP1VJ8804"
  };
  // Initialize Firebase
  console.log(firebase)
  firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

// firebase.initializeApp({
//   'messagingSenderId': '316262946834'
// });

const messaging = firebase.messaging()
console.log(messaging)
console.log(self);
// self.registration.showNotification('custom title', {body: 'custom body'});
// messaging.onBackgroundMessage(function(payload) {
//   self.registration.showNotification('Background message event', {body: JSON.stringify(payload)});
// });
messaging.onNotificationClick(payload => {
  self.registration.showNotification('Notification Click event', {body: JSON.stringify(payload)});
});
messaging.setBackgroundMessageHandler(payload => {
  console.log(payload);
  return self.registration.showNotification(payload.data.title, {body: payload.data.message, data: payload.data});
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  // console.log(event);
  let navigateUrl = '/probox-core/dashboard?room=' + event.notification['data']['chr'];

  // go to target
  event.waitUntil(clients.matchAll({includeUncontrolled: true, type: 'window'}).then(clientList => {
    // console.log(clients);
    // Find inactive tab and focus
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      // console.log('client: ', client);
      if (new URL(client.url).origin == self.origin && 'focus' in client) {
        return client.focus();
      }
    }
    // If web app not opened => open it
    if (clients.openWindow) {
      return clients.openWindow(navigateUrl);
    }
  }));
});