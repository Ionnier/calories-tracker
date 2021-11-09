const db = require('../db/index')

exports.addProduct = async function (product) {
    if (product.ingredients == undefined) {
        const id = await db.query('insert into Products(product_name,unit,no_units,calories,proteins,fats,carbohydrates,salt,fibers,sugars,saturated_fats) \
                                                values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id_product', [product.product_name, product.unit, product.no_units,
        product.calories, product.proteins, product.fats, product.carbohydrates,
        product.salt, product.fibers, product.sugars, product.saturated_fats])
        product.id_product = id.rows[0].id_product;
        return product;
    } else {
        const id = await db.query('insert into Products(product_name,unit) values($1,$2) RETURNING id_product', [product.product_name, product.unit]);
        product.id_product = id.rows[0].id_product;
        product.ingredients.forEach(async element => {
            await db.query('insert into Product_Ingredients(id_product,id_ingredient,no_units) values($1,$2,$3)', [product.id_product, element.id_product, element.no_units])
        });
        return product;
    }
}
exports.getProducts = async (name = undefined, limit = undefined) => {
    let sql = 'SELECT id_product,product_name,unit,no_units,calories,proteins,carbohydrates,sugars,fats,saturated_fats,fibers,salt \
    from All_Products where 1=1 ';
    if (name) {
        name = name.toLowerCase();
        let inside_sql = "";
        for (let c of name) {
            inside_sql += `%${c}%`
        }
        sql += `and lower(product_name) like '${inside_sql}' `
    }
    if (!isNaN(limit)) {
        sql += ` limit ${limit}`
    }
    console.log(sql)
    const results = await db.query(sql);
    return results.rows;
}