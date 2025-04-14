function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        document.getElementById('stats').innerHTML = `<p>Signed in as ${user.displayName}</p>`;
        fetchStats(user.uid);
      })
      .catch(error => {
        console.error("Sign-in error:", error);
      });
  }
  
  function fetchStats(userId) {
    const userRef = db.collection("users").doc(userId);
    userRef.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        let html = `<h2>Your Stats</h2><p><b>Total Time:</b> ${data.totalTime || 0}</p><ul>`;
        const categories = data.categories || {};
        for (let [category, time] of Object.entries(categories)) {
          html += `<li><b>${category}:</b> ${time}</li>`;
        }
        html += '</ul>';
        document.getElementById('stats').innerHTML += html;
      } else {
        document.getElementById('stats').innerHTML += '<p>No stats found.</p>';
      }
    });
  }
  