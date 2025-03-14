const FEEDING_TIMES = {
    morning: { hour: 8, minute: 0 },
    afternoon: { hour: 13, minute: 0 },
    evening: { hour: 20, minute: 0 },
};

const CLEANING_TIME = { hour: 23, minute: 0 };

let schedules = [];

const addSchedule = (event, date) => {
    schedules.push({ event, date: new Date(date) });
    schedules.sort((a, b) => a.date - b.date);
};

const getTimeUntil = (date) => {
    const now = new Date();
    // Convert both dates to Asia/Manila timezone
    const targetDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    const currentDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));

    const diff = targetDate - currentDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days} days, ${hours} hours, and ${minutes} minutes`;
    }
    if (hours > 0) {
        return `${hours} hours and ${minutes} minutes`;
    }
    return `${minutes} minutes`;
};

const getUpcomingSchedules = () => {
    const now = new Date();
    return schedules
        .filter((schedule) => schedule.date > now)
        .map((schedule) => ({
            event: schedule.event,
            date: schedule.date.toLocaleDateString("en-US", { timeZone: "Asia/Manila" }),
            time: schedule.date.toLocaleTimeString("en-US", {
                timeZone: "Asia/Manila",
                hour: "2-digit",
                minute: "2-digit",
            }),
            timeUntil: getTimeUntil(schedule.date),
        }));
};
const calculateCronTime = (hour, minute, offsetMinutes = 0) => {
    let newMinute = minute + offsetMinutes;
    let newHour = hour;

    if (newMinute < 0) {
        newHour = hour - 1;
        newMinute = 60 + newMinute;
    }
    if (newMinute >= 60) {
        newHour = hour + Math.floor(newMinute / 60);
        newMinute = newMinute % 60;
    }

    return { hour: newHour, minute: newMinute };
};

const removeSchedule = (eventName) => {
    const initialLength = schedules.length;
    schedules = schedules.filter(
        (schedule) => schedule.event.toLowerCase() !== eventName.toLowerCase(),
    );
    return initialLength !== schedules.length;
};

module.exports = {
    FEEDING_TIMES,
    CLEANING_TIME,
    calculateCronTime,
    getTimeUntil,
    addSchedule,
    getUpcomingSchedules,
    removeSchedule,
};
