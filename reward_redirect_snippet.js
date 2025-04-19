
function updateProgress() {
  const logs = JSON.parse(localStorage.getItem('chakraLogs') || '[]');
  const rewardBox = document.getElementById('reward');
  const eligibleLogs = logs.filter(log => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(log.timestamp) <= oneWeekAgo;
  });

  document.getElementById('progress').innerHTML = `<strong>Total Entries:</strong> ${logs.length} | <strong>Eligible for Reward:</strong> ${eligibleLogs.length}`;

  if (eligibleLogs.length >= 7) {
    rewardBox.innerHTML = `
      <div class="reward-badge">
        <strong>Reward Unlocked!</strong><br>
        <a class="button" href="rewards.html">Claim Your Focus Reset Reward</a>
      </div>
    `;
  } else {
    rewardBox.innerHTML = `
      <div class="reward-badge">
        <em>7 unique week-long entries needed for next unlock. Keep tracking daily to grow your energy bank.</em>
      </div>
    `;
  }
}
