async function signUp() {
    const email = document.getElementsByName('email-textbox')[0].value;
    const password = document.getElementsByName('password-textbox')[0].value;
    const first_name = document.getElementsByName('first_name-textbox')[0].value;
    const last_name = document.getElementsByName('last_name-textbox')[0].value;
    if (!email || !password || !first_name || !last_name) {
        alert('Form isn\'t completed.');
    } else {
        try {
            const body = Object.assign({ email, password, first_name, last_name });
            const result = await fetch('api/v1/signup', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            const json = await result.json();
            if (json.success === true) {
                window.location.href = "/login";
            }
        }
        catch (error) {
            alert(error);
        }
    }
}