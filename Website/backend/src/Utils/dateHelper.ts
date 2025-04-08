const getTodayDate = (): string => {
    const today = new Date();
    const utcYear = today.getUTCFullYear();
    const utcMonth = String(today.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const utcDay = String(today.getUTCDate()).padStart(2, "0");
    return `${utcYear}-${utcMonth}-${utcDay}`; // YYYY-MM-DD format in UTC
};

const getTimeNow = (): string => {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, "0");
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, "0");
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, "0");
    return `${utcHours}:${utcMinutes}:${utcSeconds}`; // HH:mm:ss format in UTC
};
export{getTimeNow, getTodayDate}