async function longPolling() {
    try {
        const response = await fetch("https://iot-colors.vercel.app");
        const data = await response.json();
        console.log("Dữ liệu mới:", data);
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

longPolling();
