// src/utils/dateUtils.js
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  export const formatTime = (timeString) => {
    return timeString;
  };
  
  export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${formatDate(date)} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };