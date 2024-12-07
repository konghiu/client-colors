const URL = "https://iot-colors.vercel.app/colors/quantity";
// const URL = "http://localhost:8000/colors/quantity";
const RED = document.getElementById("red_quantity");
const GREEN = document.getElementById("green_quantity");
const BLUE = document.getElementById("blue_quantity");
const OTHERS = document.getElementById("others_quantity");

async function longPolling() {
    try {
        await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                console.log(res);
                if (res.ok) return res.json();
                return "conghieu";
            })
            .then((data) => {
                console.log(data);
                RED.innerHTML = data.red;
                GREEN.innerHTML = data.green;
                BLUE.innerHTML = data.blue;
                OTHERS.innerHTML = data.others;
            })
            .finally(() => {
                setTimeout(() => {
                    longPolling();
                }, 100);
            });
    } catch (error) {
        console.error("Lỗi:", error);
        setTimeout(longPolling, 3000);
    }
}

longPolling();
