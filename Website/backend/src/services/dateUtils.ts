const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD format
};

const getTimeNow = (): string => {
    const now = new Date();
    return now.toTimeString().split(" ")[0]; // HH:mm:ss format
};

export{getTimeNow, getTodayDate}