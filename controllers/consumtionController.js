const db = require('../db/index')

exports.addConsumedProduct = async function (user, product) {
    if (Array.isArray(product)) {
        product.forEach(async element => {
            await db.query('INSERT INTO Consumed(id_user,id_product,no_consumed) values($1,$2,$3)', [user.id_user, element.id_product, element.no_consumed]);
        })
    } else {
        await db.query('INSERT INTO Consumed(id_user,id_product,no_consumed) values($1,$2,$3)', [user.id_user, product.id_product, product.no_consumed]);
    }
}
exports.addActivityDone = async function (user, activity) {
    await db.query('INSERT INTO Activity(id_user,activity_name,calories_consumed,duration) values($1,$2,$3,$4)', [user.id_user,
    activity.activity_name,
    activity.calories_consumed,
    activity.duration])
}