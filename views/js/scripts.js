async function login_add_alert_text(content) {
    let p = document.getElementById('login-form-alert')
    if (p) {
        p.innerHTML(content);
    } else {
        let doc = document.getElementById('login-div');
        const para = document.createElement("p");
        const node = document.createTextNode(content);
        para.appendChild(node);
        para.setAttribute("id", "login-form-alert");
        console.log(para, doc)
        doc.appendChild(para)
    }
}
async function login() {
    const email = document.getElementById('email-textbox').value;
    const password = document.getElementById('password-textbox').value;
    if (!email || !password) {
        login_add_alert_text('Incomplete login')
    } else {
        fetch("api/v1/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: `{"email":"${email}","password":"${password}"}`
        }).then(res => res.json()).then(data => {
            if (data.token) {
                window.location.replace('/')
            } else {
                login_add_alert_text(data.message);
            }
        })

    }
}

