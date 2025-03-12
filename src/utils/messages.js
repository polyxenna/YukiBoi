const feedingReminders = [
    "🐕 *Excited tail wags* @everyone Food time in 5 minutes! I can't wait!",
    "🦴 *Happy dance* @everyone Almost meal time! 5 more minutes!",
    "🐾 *Bouncing around* @everyone My food bowl needs filling in 5 minutes!",
    "🐶 *Nose boop* @everyone Time to prepare my meal in 5!",
    "🍽️ *Sitting patiently* @everyone Meal prep time! 5 minutes to go!",
    "🐕 *Playful bark* @everyone Food time approaching! 5 minutes!",
    "🦴 *Tail wagging* @everyone Almost dinner time! Can't wait!",
    "🐾 *Spinning circles* @everyone 5 minutes until food time!",
    "🐶 *Gentle whimper* @everyone My tummy says 5 minutes to meal time!",
    "🍖 *Excited jumping* @everyone Food time countdown: 5 minutes!",
];

const fedResponses = [
    "🐕 *Happy munching* Mmm, that was delicious! Thank you!",
    "🦴 *Tail wagging intensifies* The best meal ever!",
    "🐾 *Playful bark* Thanks for feeding me! Time to play!",
    "🐶 *Content smile* My tummy is so happy now!",
    "🍖 *Licks lips* Yum! That hit the spot!",
    "🐕‍🦺 *Wags tail excitedly* You're the best hooman ever!",
    "🌟 *Sparkly eyes* I feel so full and loved!",
    "💖 *Rolls over* Belly rubs now, please?",
    "😋 *Happy sniffs* That was pawsome! More later, okay?",
    "✨ *Jumps in joy* Woohoo! I'm fueled up and ready for fun!",
];


const feedingAlerts = [
    "🥺 *Sad puppy eyes* @everyone It's been {minutes} minutes past my meal time... I'm starving!",
    "🐕 *Gentle whimper* @everyone I'm getting quite hungry... {minutes} minutes late!",
    "🐾 *Paw on your leg* @everyone Hey, remember my food? It's {minutes} minutes late!",
    "🍽️ *Looks at empty bowl* @everyone Umm... it's been {minutes} minutes... did you forget me?",
    "😢 *Little whine* @everyone My tummy is rumbling! It's already {minutes} minutes late!",
    "🦴 *Stares longingly at you* @everyone It's been {minutes} minutes... feed me, please?",
    "🐶 *Big puppy eyes* @everyone I promise to be extra cute if you feed me soon... it's {minutes} minutes late!",
    "💤 *Lying down dramatically* @everyone I'll just nap and dream of food... {minutes} minutes late though. 😔",
    "🍗 *Sniff sniff* @everyone I can almost smell the food... but it's {minutes} minutes late!",
    "🐾 *Taps bowl with paw* @everyone Hello? It's been {minutes} minutes... just checking if you remembered me!",
];


const cleaningReminders = [
    "🧹 *Polite woof* Time for my potty area cleanup! @everyone",
    "✨ *Gentle nudge* Could someone tidy up my space? @everyone",
    "🐕 *Sitting properly* My area needs a little refresh! @everyone",
    "💩 *Wags tail shyly* Umm... it's getting a little messy over here! @everyone",
    "🐾 *Taps floor with paw* Hey, could we clean up? I like my space fresh! @everyone",
    "😶‍🌫️ *Sniffs around* Hmm... something smells funny. Time for cleanup? @everyone",
    "🌸 *Rolls over* I'd love a clean space to nap in, please! @everyone",
    "🧼 *Puppy eyes activated* I feel better in a clean place! Can you help? @everyone",
    "💖 *Happy tail wags* A clean home is a happy home, right? @everyone",
    "✨ *Little twirl* Cleaning time? I'll watch and cheer you on! @everyone",
];


const cleanedResponses = [
    "🐕 *Happy zoomies* Yay! My space is all clean!",
    "✨ *Joyful tail wags* Thank you for keeping my area tidy!",
    "🐾 *Playful bounce* Clean space means more room for play!",
    "💖 *Big puppy smile* I love my fresh and clean spot!",
    "🌸 *Rolls over happily* This feels sooo much better!",
    "🧼 *Sniff sniff* Mmm, smells fresh! You're the best!",
    "😄 *Excited wiggles* Thank you! Now I can relax in style!",
    "🐶 *Gentle nuzzle* Clean and cozy, just how I like it!",
    "🎉 *Happy bark* Clean space, happy face!",
    "🌟 *Lies down contentedly* Ahh, the perfect spot for a nap!",
];


const historyResponses = [
    "🐕 *Proud tail wags* Here's my meal diary for today:",
    "📝 *Sitting attentively* My feeding schedule today:",
    "🦴 *Happy bark* Here's when I got my yummy meals today:",
    "🐾 *Pawing at a notebook* Look at my care report for today!",
    "🐶 *Eager eyes* Here's how well I was taken care of today!",
    "📖 *Flips imaginary pages* My daily log is ready, hooman!",
    "💖 *Tail wagging proudly* Check out how loved I was today!",
    "🍽️ *Licks lips* Here's when I filled my belly today!",
    "✨ *Little twirl* Want to see how today went? Here it is!",
    "🕰️ *Glances at clock* Here's a timeline of my care today!",
];


const scheduleReminders = {
    dayBefore: [
        "🗓️ @everyone Don't forget! My {event} is tomorrow!",
        "📅 @everyone Reminder: {event} scheduled for tomorrow!",
        "🐕 @everyone *Gentle reminder* My {event} is coming up tomorrow!",
    ],
    threeHours: [
        "⏰ @everyone 3 hours until my {event}!",
        "🕒 @everyone Getting closer! {event} in 3 hours!",
        "🐾 @everyone *Excited paws* {event} coming up in 3 hours!",
    ],
    oneHour: [
        "⚡ @everyone 1 hour until my {event}!",
        "🔔 @everyone Almost time! {event} in 1 hour!",
        "🐕 @everyone *Waiting patiently* {event} in just 1 hour!",
    ],
};

const scheduleViewResponses = [
    "📅 *Checking my calendar* Here are my upcoming appointments:",
    "🗓️ *Tail wags* These are my scheduled events:",
    "📆 *Excited bounce* Here's what's coming up for me:",
];

const scheduleRemovalResponses = {
    success: [
        "🗑️ *Tail wag* Okay, I've removed that event from my schedule!",
        "📅 *Happy bark* All done! That event is now off my calendar!",
        "✨ *Playful bounce* Schedule updated! Event removed successfully!",
    ],
    notFound: [
        "🤔 *Confused head tilt* I couldn't find that event in my schedule...",
        "❓ *Gentle whimper* Are you sure that event was scheduled?",
        "🔍 *Searching look* That event doesn't seem to be in my calendar...",
    ],
};

const helpMessage = `
🐕 **Yuki's Care Bot Commands**
\`feed\` - Mark my meal as given (once per meal time)
\`clean\` - Mark my area as cleaned
\`history\` - See my feeding record for today
\`schedule\` - View all my upcoming events
\`sched [event] [MM/DD/YYYY] [HH:MM AM/PM]\` - Schedule an event
\`remove [event]\` - Remove a scheduled event
\`help\` - Show this message
\`invite\` - Invite me to your server!
`;

const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
};

module.exports = {
    feedingReminders,
    fedResponses,
    feedingAlerts,
    cleaningReminders,
    cleanedResponses,
    historyResponses,
    getRandomResponse,
    scheduleReminders,
    scheduleViewResponses,
    scheduleRemovalResponses,
    helpMessage,
};
