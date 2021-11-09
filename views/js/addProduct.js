document.getElementById('checkbox-ingredient').checked = false;
Array.prototype.forEach.call(document.getElementsByTagName('input'), element => {
    if (element.type === "text" || element.type === "number" || element.type == "search") {
        element.value = "";
    }
});
function hidenutrients() {
    if (document.getElementById('checkbox-ingredient').checked) {
        var list = document.getElementsByClassName("nutrient");
        for (let item of list) {
            item.style.display = "none";
        }
        list = document.getElementsByClassName("ingredient");
        for (let item of list) {
            item.style.display = "flex";
        }
    } else {
        var list = document.getElementsByClassName("nutrient");
        for (let item of list) {
            item.style.display = "flex";
        }
        list = document.getElementsByClassName("ingredient");
        for (let item of list) {
            item.style.display = "none";
        }
    }
}
document.getElementById('search-ingredients-cc535').addEventListener('input', async () => {
    const text = document.getElementById('search-ingredients-cc535').value;
    if (text.length > 4) {
        document.getElementById("search-ingredients-cc535").readOnly = true;
        const results = await fetch(`/api/v1/products?name=${text}`);
        const json = await results.json();
        // https://www.encodedna.com/javascript/populate-json-data-to-html-table-using-javascript.htm
        // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < json.length; i++) {
            for (var key in json[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < json.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = json[i][col[j]];
            }
            tr.setAttribute("onclick", "var elements = document.getElementsByClassName(this.cells[0].textContent);console.log(elements);while(elements.length>0){elements[0].parentNode.removeChild(elements[0])};const to_add =document.getElementById(\"addedingredients\");\
                                        var p = document.createElement(\"p\");p.classList.add(this.cells[0].textContent);p.classList.add(\"ingredient\");\
                                        var text = document.createTextNode(this.cells[1].textContent);\
                                        p.appendChild(text);\
                                        to_add.appendChild(p);\
                                        var input = document.createElement(\"input\");\
                                        input.classList.add(this.cells[0].textContent);input.classList.add(\"ingredient\");\
                                        input.required=true;\
                                        input.setAttribute('type','number');\
                                        to_add.appendChild(input);\
                                        var p2 = document.createElement(\"p\");p2.classList.add(this.cells[0].textContent);p2.classList.add(\"ingredient\");\
                                        var text2 = document.createTextNode(this.cells[2].textContent);\
                                        p2.appendChild(text2);\
                                        to_add.appendChild(p2);\
                                        var remove=document.createElement(\"input\");\
                                        remove.setAttribute('type','button');\
                                        remove.setAttribute('value','Remove');\
                                        remove.classList.add(this.cells[0].textContent);remove.classList.add(\"ingredient\");\
                                        remove.setAttribute(\"onclick\", `var elements = document.getElementsByClassName(${this.cells[0].textContent});console.log(elements);while(elements.length>0){elements[0].parentNode.removeChild(elements[0])};return false; `);\
                                        to_add.appendChild(remove);\
                                        ")
        }
        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("searchresults");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);

        document.getElementById("search-ingredients-cc535").readOnly = false;
    }
})
async function addProduct() {
    if (document.getElementById('checkbox-ingredient').checked) {
        if (document.getElementsByName('product_name-cc535')[0].value === "" || !document.getElementsByName('product_unit-cc535')[0].value === "") {
            throw new Error('Product Name or Unit not filled.');
        }
        try {
            if (document.getElementsByName('product_name-cc535')[0].value === "" || !document.getElementsByName('product_unit-cc535')[0].value === "") {
                throw new Error('Product Name or Unit not filled.');
            }
            const ingredients = [];
            Array.prototype.forEach.call(document.getElementById('addedingredients').getElementsByTagName('input'), element => {
                if (element.type === "number") {
                    if (element.value == "") {
                        throw new Error('Not all units completed');
                    }
                    element.classList.forEach((element2) => {
                        if (!isNaN(element2)) {
                            ingredients.push(Object.assign({ id_product: element2, no_units: element.value }))
                        }
                    })
                }
            })
            const product = Object.assign({
                product_name: document.getElementsByName('product_name-cc535')[0].value,
                unit: document.getElementsByName('product_unit-cc535')[0].value,
                ingredients
            })
            const results = await fetch("/api/v1/products", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
            console.log(await results.json())
            location.reload();
        }
        catch (err) {
            alert(err);
        }
    }
    else {
        try {
            if (document.getElementsByName('product_name-cc535')[0].value === "" || !document.getElementsByName('product_unit-cc535')[0].value === "") {
                throw new Error('Product Name or Unit not filled.');
            }
            const product = Object.assign({
                product_name: document.getElementsByName('product_name-cc535')[0].value,
                unit: document.getElementsByName('product_unit-cc535')[0].value,
                calories: document.getElementsByName('calories-cc535')[0].value,
                no_units: document.getElementsByName('no_units-cc535')[0].value,
                proteins: document.getElementsByName('proteins-cc535')[0].value,
                carbohydrates: document.getElementsByName('carbohydrates-cc535')[0].value,
                sugars: document.getElementsByName('sugars-cc535')[0].value,
                fats: document.getElementsByName('fats-cc535')[0].value,
                saturated_fats: document.getElementsByName('saturated_fats-cc535')[0].value,
                fibers: document.getElementsByName('fibers-cc535')[0].value,
                salt: document.getElementsByName('salt-cc535')[0].value
            })
            const results = await fetch("/api/v1/products", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) })
            console.log(await results.json())
            location.reload();
        }
        catch (err) {
            alert(err);
        }
    }

}