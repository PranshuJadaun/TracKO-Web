// script.js

// Get DOM element references
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

// Handle Google Sign-In
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      setupUserDoc(user);
      showDashboard(user);
    })
    .catch(error => {
      console.error("Sign-in error:", error);
      alert("Sign-in failed!");
    });
});

// Handle Logout
logoutBtn.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("login-section").classList.remove("hidden");
  });
});

// Listen for authentication state changes
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    setupUserDoc(user);
    showDashboard(user);
  }
});

// Create or update the user document in the "user" collection if needed
function setupUserDoc(user) {
  const userRef = db.collection("user").doc(user.uid);
  userRef.get().then(doc => {
    if (!doc.exists) {
      // If the document doesn't exist, create it with initial values.
      userRef.set({
        totalTime: 0,
        categories: {
          academic: 0,
          entertainment: 0
        }
      })
      .then(() => {
        console.log("User document created in 'user' collection.");
      })
      .catch(error => {
        console.error("Error creating user document:", error);
      });
    }
  });
}

// Display the dashboard and use a real-time listener to fetch and display data
function showDashboard(user) {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("user-name").textContent = user.displayName;

  const userRef = firebase.firestore().collection("user").doc(user.uid);
  userRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const categories = data.categories || {};

      // Set total time under each category
      document.getElementById("academic-list").innerHTML = `<li><strong>Time:</strong> ${categories.academic || 0} mins</li>`;
      document.getElementById("entertainment-list").innerHTML = `<li><strong>Time:</strong> ${categories.entertainment || 0} mins</li>`;

    } else {
      console.warn("No stats found for this user.");
    }
  });
}


// Test Button: Update academic time by 10 minutes to simulate an update from your extension.
document.getElementById("update-academic-btn").addEventListener("click", () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const userRef = db.collection("user").doc(user.uid);
    userRef.update({
      "categories.academic": firebase.firestore.FieldValue.increment(10),
      totalTime: firebase.firestore.FieldValue.increment(10)
    })
    .then(() => {
      console.log("Academic time updated by 10 mins for testing.");
    })
    .catch(error => {
      console.error("Error updating document:", error);
    });
  } else {
    alert("No user signed in!");
  }
});
