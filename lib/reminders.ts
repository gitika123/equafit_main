export const WITTY_REMINDERS = [
  "Your abs are calling. They said they miss you. 📞",
  "Sweat now, glow later. Your future self will high-five you. ✨",
  "The couch is not going to work out for you. You are. 🛋️",
  "Even 5 minutes counts. Your body is like: 'Thanks, I needed that.' 🙏",
  "Your muscles have amnesia. Remind them who's boss. 💪",
  "Netflix will still be there. This energy might not. Let's go! 🏃",
  "You're one workout away from a good mood. No cap. 😤",
  "Beyoncé didn't skip leg day. Just saying. 👑",
  "Your future fit self is watching. Don't disappoint them. 👀",
  "The only bad workout is the one you didn't do. This one's waiting! 🎯",
  "Stress is temporary. Gains are (kind of) forever. 🏋️",
  "Your bed will hug you later. Right now, the mat needs you. 🧘",
  "Procrastination said 'later.' Your body said 'now.' Listen to your body. 🫵",
  "5 minutes. That's one song. You got this. 🎵",
  "Sore today, strong tomorrow. Let's make tomorrow jealous. 💥",
  "Your phone can wait. Your heart rate cannot. ❤️",
  "Rest days are for tomorrow. Today we move! 🌟",
  "The only thing you'll regret is not starting. Go! 🚀",
  "Your mind will thank you. Your body will thank you. We're all thanking you. 🙌",
  "Skipping is for jump rope, not workouts. 😏",
];

export function getRandomReminder(): string {
  return WITTY_REMINDERS[Math.floor(Math.random() * WITTY_REMINDERS.length)];
}
