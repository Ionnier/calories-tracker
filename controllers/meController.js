const db = require('../db/index')

exports.getActivities = async function (id_user) {
    const results = await db.query('SELECT * from Tracker where id_user=$1', [id_user]);
    const map = new Map();
    results.rows.forEach(element => {
        if (map.has(element.on.toLocaleDateString())) {
            map.get(element.on.toLocaleDateString()).push(element);
        } else {
            map.set(element.on.toLocaleDateString(), [element]);
        }
    })
    const activities = [];
    for (const [key, value] of map.entries()) {
        console.log(value);
        activities.push(Object.assign({ date: key, activities: value, summary: value.reduce((sum, current) => sum + current.calories, 0) }));
    }
    return activities;
}