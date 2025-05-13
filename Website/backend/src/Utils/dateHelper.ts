const getTodayDate = (): string => {
    const today = new Date();
    const utcYear = today.getFullYear();
    const utcMonth = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const utcDay = String(today.getDate()).padStart(2, "0");
    return `${utcYear}-${utcMonth}-${utcDay}`; // YYYY-MM-DD format in UTC
};

const getTimeNow = (): string => {
    const now = new Date();
    const utcHours = String(now.getHours()).padStart(2, "0");
    const utcMinutes = String(now.getMinutes()).padStart(2, "0");
    const utcSeconds = String(now.getSeconds()).padStart(2, "0");
    return `${utcHours}:${utcMinutes}:${utcSeconds}`; // HH:mm:ss format in UTC
};

const getLocalDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 3);
    return now;
}

export{getTimeNow, getTodayDate, getLocalDate}