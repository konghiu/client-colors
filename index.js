// const HOST = "https://iot-colors.vercel.app";
const HOST = "http://localhost:8000";
const RED = document.getElementById("red_quantity");
const GREEN = document.getElementById("green_quantity");
const BLUE = document.getElementById("blue_quantity");
const OTHERS = document.getElementById("others_quantity");

const FILTER_DATE = document.getElementById("button_filter_date");
const INPUT_DATEFROM = document.getElementById("date-from");
const INPUT_DATETO = document.getElementById("date-to");

let from_prev = "0";
let to_prev = "0";

const CONTAINER_DETAIL = document.querySelector(".container-details");
const NAVBAR_PAGES = document.querySelector(".navbar_pages");
const PAGE_PREV = document.querySelector(".page_prev");
const PAGE_NEXT = document.querySelector(".page_next");
const NUMBER_PER_ALL = document.querySelector(".number_per_all");

let list_details = [];
let number_of_pages = 0;
let current_page = 0;

let stop_get;

const colors_basic = { RED: true, GREEN: true, BLUE: true };

async function longPolling() {
    try {
        await fetch(HOST + "/colors/quantity", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok) return res.json();
                return "conghieu";
            })
            .then((data) => {
                // console.log(data);
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

FILTER_DATE.onclick = async () => {
    let from = INPUT_DATEFROM.value;
    let to = INPUT_DATETO.value;

    if (to == to_prev && from == from_prev) return;
    from_prev = from;
    to_prev = to;

    if (!from && to) {
        from = new Date(to);
        from = new Date(from.setHours(0, 0, 0, 0));
    } else {
        const now = new Date();
        if (!from) from = now;
        else from = new Date(from);

        if (!to) to = new Date(now.setHours(0, 0, 0, 0));
        else to = new Date(to);
    }

    if (from > to) alert("SAI NGAY");
    else {
        await fetch(
            HOST +
                "/colors/details?" +
                new URLSearchParams({
                    from: from,
                    to: to,
                }),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                CONTAINER_DETAIL.innerHTML = "";
                list_details = data;
                number_of_pages = Math.ceil(list_details.length / 8);
                let n = number_of_pages > 1 ? 8 : number_of_pages;

                for (let i = 0; i < n; i++) {
                    handle_create_detail_color(list_details[i]);
                }
                if (number_of_pages > 1) NAVBAR_PAGES.style.display = "flex";
                else NAVBAR_PAGES.style.display = "none";

                NUMBER_PER_ALL.textContent = `1/${number_of_pages}`;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};

PAGE_PREV.onclick = () => {
    if (current_page <= 0) return;
    CONTAINER_DETAIL.innerHTML = "";
    current_page -= 1;
    for (let i = current_page * 8; i < 8; i++) {
        handle_create_detail_color(list_details[i]);
    }
    NUMBER_PER_ALL.textContent = `${current_page + 1}/${number_of_pages}`;
};

PAGE_NEXT.onclick = () => {
    if (current_page >= number_of_pages - 1) return;
    current_page++;
    let n = current_page * 8 + 8;
    n = n < list_details.length ? n : list_details.length;
    CONTAINER_DETAIL.innerHTML = "";
    for (let i = current_page * 8; i < n; i++) {
        handle_create_detail_color(list_details[i]);
    }
    NUMBER_PER_ALL.textContent = `${current_page + 1}/${number_of_pages}`;
};

function handle_create_detail_color(detail) {
    const TIME_DETAIL = new Date(detail.time);
    let dd = TIME_DETAIL.getDate();
    dd = dd > 9 ? dd : "0" + dd;
    let mm = TIME_DETAIL.getMonth() + 1;
    mm = mm > 9 ? mm : "0" + mm;
    let yy = TIME_DETAIL.getFullYear();

    let h = TIME_DETAIL.getHours();
    h = h > 9 ? h : "0" + h;
    let m = TIME_DETAIL.getMinutes();
    m = m > 9 ? m : "0" + m;
    let s = TIME_DETAIL.getSeconds();
    s = s > 9 ? s : "0" + s;

    const elementColor = document.createElement("div");
    const color = detail.classified.classify;
    elementColor.style = `background-color: ${
        colors_basic[color] ? color : "rgb(100, 100, 100)"
    }; height: 50px; width: 50px`;

    const elementContent = document.createElement("div");
    elementContent.className = "detail_content";
    elementContent.innerHTML = `
        <h4>${detail.classified.classify}</h4>
        <p>${h}:${m}:${s} - ${dd}/${mm}/${yy}</p>
    `;

    const elementDetail = document.createElement("div");
    elementDetail.className = "detail_color";
    elementDetail.appendChild(elementColor);
    elementDetail.appendChild(elementContent);
    CONTAINER_DETAIL.appendChild(elementDetail);
}
