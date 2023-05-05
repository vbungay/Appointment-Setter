const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const generateDaysArray = (year, month) => {
    const daysArray = [];
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInCurrentMonth = daysInMonth(year, month);
    const lastDayOfPreviousMonth = daysInMonth(year, month - 1);

    // Add days from the previous month
    for (let i = 1; i <= firstDayOfMonth; i++) {
        daysArray.unshift({
            day: lastDayOfPreviousMonth - i + 1,
            date: new Date(year, month - 2, lastDayOfPreviousMonth - i + 1),
            isCurrentMonth: false,
        });
    }

    // Add days from the current month
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        daysArray.push({
            day: i,
            date: new Date(year, month - 1, i),
            isCurrentMonth: true,
        });
    }

    // Add days from the next month
    const daysToAddFromNextMonth = 7 - (daysArray.length % 7);
    for (let i = 1; i <= daysToAddFromNextMonth; i++) {
        daysArray.push({
            day: i,
            date: new Date(year, month, i),
            isCurrentMonth: false,
            dayName: daysOfWeek[new Date(year, month, i).getDay()],
        });
    }

    return daysArray;
};
