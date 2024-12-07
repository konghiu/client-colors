async function longPolling() {
    try {
        const response = await fetch("https://iot-colors.vercel.app");
        const data = await response.json();
        console.log("Dữ liệu mới:", data);
        longPolling();
    } catch (error) {
        console.error("Lỗi:", error);
        setTimeout(longPolling, 5000);
    }
}

longPolling();
