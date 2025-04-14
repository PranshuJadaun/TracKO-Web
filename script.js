document.getElementById("login-btn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      showDashboard(user);
    })
    .catch(error => {
      console.error("Sign-in error:", error);
      alert("Sign-in failed!");
    });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("login-section").classList.remove("hidden");
  });
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    showDashboard(user);
  }
});

document.getElementById("update-academic-btn").addEventListener("click", () => {
  // You need an authenticated user to test this
  const user = firebase.auth().currentUser;
  if (user) {
    const userRef = db.collection("users").doc(user.uid);
    userRef.update({
      "categories.academic": firebase.firestore.FieldValue.increment(10),
      totalTime: firebase.firestore.FieldValue.increment(10)
    })
    .then(() => {
      console.log("Academic time updated by 10 mins.");
    })
    .catch(error => {
      console.error("Error updating document:", error);
    });
  } else {
    alert("No user signed in!");
  }
});


function showDashboard(user) {
  // Hide the login section and show the dashboard
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("user-name").textContent = user.displayName;

  // Listen for real-time updates on the user's Firestore document
  const userRef = db.collection("users").doc(user.uid);
  userRef.onSnapshot(doc => {
    if (doc.exists) {
      const data = doc.data();
      const categories = data.categories || {};

      // Update the UI elements with the new data
      document.getElementById("academic-list").innerHTML = "";
      document.getElementById("entertainment-list").innerHTML = "";

      // Since we have two categories, we check directly.
      if (categories.academic !== undefined) {
        document.getElementById("academic-list").innerHTML = `<li>academic: ${categories.academic} mins</li>`;
      }
      if (categories.entertainment !== undefined) {
        document.getElementById("entertainment-list").innerHTML = `<li>entertainment: ${categories.entertainment} mins</li>`;
      }
    } else {
      console.warn("No stats found for this user.");
    }
  }, error => {
    console.error("Error with onSnapshot:", error);
  });
}

