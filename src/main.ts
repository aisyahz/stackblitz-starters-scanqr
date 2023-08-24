import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Check-In App</title>
</head>
<body>
  <h1>Check-In App for Organizers</h1>
  <button id="scanButton">Scan QR Code</button>
  <p id="statusMessage"></p>

  <script src="https://cdn.jsdelivr.net/npm/instascan@1.0.0/dist/instascan.min.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-firestore.js"></script>

  <script>
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDJdjvmdJeS7_WYMIHU-zv4b4Fc2D5s-Yo",
      authDomain: "contact-form-7ec86.firebaseapp.com",
      databaseURL: "https://contact-form-7ec86-default-rtdb.firebaseio.com",
      projectId: "contact-form-7ec86",
      storageBucket: "contact-form-7ec86.appspot.com",
      messagingSenderId: "643370383331",
      appId: "1:643370383331:web:61c6ca2a2f257b24ba92d6"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const scanButton = document.getElementById('scanButton');
    const statusMessage = document.getElementById('statusMessage');

    // Create a scanner instance
    const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    
    scanButton.addEventListener('click', () => {
      Instascan.Camera.getCameras().then(cameras => {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error('No cameras found.');
        }
      });
    });

    scanner.addListener('scan', async content => {
      const attendeeRef = db.collection('attendees').doc(content);
      const attendeeDoc = await attendeeRef.get();

      if (attendeeDoc.exists) {
        const attendeeData = attendeeDoc.data();
        
        if (attendeeData.checkedIn) {
          statusMessage.textContent = 'Already Checked In';
        } else {
          await attendeeRef.update({ checkedIn: true });
          statusMessage.textContent = 'Checked In Successfully';
        }
      } else {
        statusMessage.textContent = 'Attendee Not Found';
      }
    });
  </script>
</body>
</html>

  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
