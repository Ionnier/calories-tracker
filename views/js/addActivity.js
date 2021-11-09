async function addActivity() {
    try {
        if (document.getElementsByName('calories_consumed')[0].value < 0 || document.getElementsByName('duration')[0].value) {
            throw new Error('Calories or duration can\'t be negative.')
        }
        const activity = Object.assign({
            activity_name: document.getElementsByName('add-activity')[0].value,
            calories_consumed: document.getElementsByName('calories_consumed')[0].value,
            duration: parseInt(document.getElementsByName('duration')[0].value)
        })
        console.log(activity);
        const result = await fetch('/api/v1/products/activity', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(activity) })
        window.location.href = "/me";
        return false;
    }
    catch (err) {
        alert(err);
        return false;
    }

}
