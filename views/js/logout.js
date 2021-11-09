async function logout() {
    try {
        let res = await fetch("api/v1/logout", { method: "GET" })
        res = await res.json();
        if (res.status == "success") {
            location.reload();
        }
    }
    catch (err) {
        console.log(err);
    }
}
