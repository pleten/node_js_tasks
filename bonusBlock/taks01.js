const averageGrade = (student) => {
    return student.grades.reduce((prev,curr) => {
        return (prev.score ? prev.score : prev) + (curr.score ? curr.score : 0);
    }) / student.grades.length;
}

const result = averageGrade({
    name: 'Chill Student', grades: [
        {
            name: 'Math',
            score: 1,
        },
        {
            name: 'Science',
            score: 5
        },
        {
            name: 'Invalid Name',
            score: null
        },
        {
            name: 'Invalid Subject',
            score: undefined
        },
        {
            name: 'Biology',
            score: 10
        }]
});

console.log('Average score is:', result);
