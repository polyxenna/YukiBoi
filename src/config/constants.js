const FEEDING_TIMES = {
    morning: { hour: 9, minute: 0 },
    afternoon: { hour: 13, minute: 0 },
    evening: { hour: 18, minute: 0 },
};

const CLEANING_TIME = { hour: 23, minute: 0 };

let schedules = [];

const addSchedule = (event, date) => {
    schedules.push({ event, date: new Date(date) });
    schedules.sort((a, b) => a.date - b.date);
};

const getUpcomingSchedules = () => {
    const now = new Date();
    return schedules
        .filter((schedule) => schedule.date > now)
        .map((schedule) => ({
            event: schedule.event,
            date: schedule.date.toLocaleDateString(),
            time: schedule.date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            timeUntil: getTimeUntil(schedule.date),
        }));
};

const getTimeUntil = (date) => {
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
        return `${days} days and ${hours} hours`;
    }
    return `${hours} hours`;
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
    addSchedule,
    getUpcomingSchedules,
    removeSchedule,
};
