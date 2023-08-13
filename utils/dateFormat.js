function dateFormat(date, format) {
    const today = new Date(date);
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();
  
    const formattedDate = format.replace(/DD/g, day);
    formattedDate = formattedDate.replace(/MM/g, month);
    formattedDate = formattedDate.replace(/YYYY/g, year);
    formattedDate = formattedDate.replace(/HH/g, hour);
    formattedDate = formattedDate.replace(/mm/g, minute);
    formattedDate = formattedDate.replace(/ss/g, second);
  
    return formattedDate;
  }