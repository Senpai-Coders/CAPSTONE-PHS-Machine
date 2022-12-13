var moment = require('moment'); 

export const dateMomentBeautify = ( date, format) => {
    //"MMMM Do YYYY, h:mm a"
    return moment(
        date
      ).format(format)
}

export const getDateAgo = (current, given) => {
    let a = moment(current);
    let b = moment(given);

    return a.diff(b, "days");
  };