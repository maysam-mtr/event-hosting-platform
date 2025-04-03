export default function getEventStatus(eventDate, eventTime) {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const now = new Date();
  
    if (now < eventDateTime) {
      return "upcoming";
    } else if (now.toDateString() === eventDateTime.toDateString()) {
      return "live";
    } else {
      return "closed";
    }
  }