
let isDark = true;

function toggleTheme() {
  isDark = !isDark;
  document.body.style.background = isDark ? '#0d0c1d' : '#fff';
  document.body.style.color = isDark ? '#f4f4f8' : '#111';
}

const flowerImages = {
  "Calm": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Lotus_flower_in_full_bloom.jpg/800px-Lotus_flower_in_full_bloom.jpg",
  "Energized": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Sunflower.jpg/800px-Sunflower.jpg",
  "Foggy": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Moonflower.jpg/800px-Moonflower.jpg",
  "Stuck": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Wilted_rose.jpg/800px-Wilted_rose.jpg",
  "Aligned": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Chakra_flower.jpg/800px-Chakra_flower.jpg"
};

const moodSuggestions = {
  "Root": { mood: "Energized", task: "Grounding yoga + affirmations.", video: "https://www.youtube.com/embed/4pLUleLdwY4" },
  "Sacral": { mood: "Calm", task: "Visualization & sacral breathwork.", video: "https://www.youtube.com/embed/KTZqX9W4Lz0" },
  "Solar Plexus": { mood: "Aligned", task: "Power pose + intention journaling.", video: "https://www.youtube.com/embed/6nZKb2wtDLg" },
  "Heart": { mood: "Calm", task: "Loving-Kindness Meditation.", video: "https://www.youtube.com/embed/MN8p-VrnZyI" },
  "Throat": { mood: "Energized", task: "Chanting or voice journaling.", video: "https://www.youtube.com/embed/vpFobQtxpWI" },
  "Third Eye": { mood: "Aligned", task: "Visualization meditation.", video: "https://www.youtube.com/embed/tK1DePbKf20" },
  "Crown": { mood: "Calm", task: "Silent cosmic meditation.", video: "https://www.youtube.com/embed/y0wP1xqaMAY" }
};

function generateAstroProfile(date) {
  const birthYear = new Date(date).getFullYear();
  const signs = ['Sun: Leo', 'Moon: Cancer', 'Mercury: Gemini', 'Venus: Taurus', 'Mars: Aries'];
  const missions = 'You are a celestial guide meant to anchor balance and help others awaken their cosmic memory.';
  return \`
    <div class="astro-box">
      <strong>Astrological Snapshot (\${birthYear}):</strong><br>
      \${signs.join('<br>')}<br><br>
      <strong>Mission:</strong><br>\${missions}
    </div>
  \`;
}

function saveProfile() {
  const profile = {
    name: document.getElementById('name').value,
    birthdate: document.getElementById('birthdate').value,
    birthplace: document.getElementById('birthplace').value,
    lifeGoals: document.getElementById('lifeGoals').value
  };
  localStorage.setItem('userProfile', JSON.stringify(profile));
  document.getElementById('profileSetup').classList.add('hidden');
  document.getElementById('tracker').classList.remove('hidden');
  document.getElementById('astroChart').innerHTML = generateAstroProfile(profile.birthdate);
}

function suggestMoodChange(currentChakra) {
  return moodSuggestions[currentChakra] || { mood: "Aligned", task: "Reflect silently.", video: "" };
}

function logEntry() {
  const chakra = document.getElementById('chakra').value;
  const mood = document.getElementById('mood').value;
  const notes = document.getElementById('notes').value;
  const entry = {
    date: new Date().toLocaleDateString(),
    chakra, mood, notes,
    timestamp: new Date().toISOString()
  };
  let logs = JSON.parse(localStorage.getItem('chakraLogs') || '[]');
  logs.push(entry);
  localStorage.setItem('chakraLogs', JSON.stringify(logs));
  displayLog();

  const suggestion = suggestMoodChange(chakra);
  const flower = flowerImages[mood] || flowerImages['Aligned'];

  document.getElementById('tasks').innerHTML = \`
    <div class="task">
      <strong>Suggested Mood Shift:</strong> \${suggestion.mood}<br>
      <strong>Today's Task:</strong> \${suggestion.task}<br>
      <img src="\${flower}" alt="Mood Flower" class="flower-img">
    </div>
  \`;

  const video = document.getElementById('guidedSession');
  video.src = suggestion.video;
  video.classList.remove('hidden');

  updateProgress();
}

function displayLog() {
  const logs = JSON.parse(localStorage.getItem('chakraLogs') || '[]');
  document.getElementById('log').innerHTML = logs.map(log => \`
    <div><strong>\${log.date}</strong>: \${log.chakra}, \${log.mood}<br>\${log.notes}</div>
  \`).join('');
}

function updateProgress() {
  const logs = JSON.parse(localStorage.getItem('chakraLogs') || '[]');
  const rewardBox = document.getElementById('reward');
  const eligibleLogs = logs.filter(log => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(log.timestamp) <= oneWeekAgo;
  });

  document.getElementById('progress').innerHTML = \`<strong>Total Entries:</strong> \${logs.length} | <strong>Eligible for Reward:</strong> \${eligibleLogs.length}\`;

  if (eligibleLogs.length >= 7) {
    rewardBox.innerHTML = \`
      <div class="reward-badge">
        <strong>Reward Unlocked!</strong><br>
        You’ve earned a Focus Reset Badge. Download your digital planner upgrade or join a bonus retreat session!
      </div>
    \`;
  } else {
    rewardBox.innerHTML = \`
      <div class="reward-badge">
        <em>7 unique week-long entries needed for next unlock. Keep tracking daily to grow your energy bank.</em>
      </div>
    \`;
  }
}

function exportLog() {
  const logs = localStorage.getItem('chakraLogs');
  const blob = new Blob([logs], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chakra_journal.json';
  a.click();
}

if (localStorage.getItem('userProfile')) {
  const profile = JSON.parse(localStorage.getItem('userProfile'));
  document.getElementById('profileSetup').classList.add('hidden');
  document.getElementById('tracker').classList.remove('hidden');
  document.getElementById('astroChart').innerHTML = generateAstroProfile(profile.birthdate);
  displayLog();
  updateProgress();
}
