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

function showDashboard(user) {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("user-name").textContent = user.displayName;

  const userRef = firebase.firestore().collection("users").doc(user.uid);
  userRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const categories = data.categories || {};
      const academicList = document.getElementById("academic-list");
      const entertainmentList = document.getElementById("entertainment-list");
      academicList.innerHTML = '';
      entertainmentList.innerHTML = '';

      for (let [key, value] of Object.entries(categories)) {
        const item = `<li>${key}: ${value} mins</li>`;
        if (["study", "research", "coding"].includes(key.toLowerCase())) {
          academicList.innerHTML += item;
        } else {
          entertainmentList.innerHTML += item;
        }
      }
    } else {
      console.warn("No stats found for this user.");
    }
  });
}
