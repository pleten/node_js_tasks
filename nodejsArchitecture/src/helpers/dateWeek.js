export const getWeek = (date) => {
    const janFirst = new Date(date.getFullYear(), 0, 1);
    const millisecondInDay = 86400000;
    return Math.ceil((((date.getTime() - janFirst.getTime()) / millisecondInDay) + janFirst.getDay() + 1) / 7);
};