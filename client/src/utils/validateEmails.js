const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const trailingComma = /$|,|/

export default (emails) => {
  // if (trailingComma.test(emails) === true) {
  //   emails.charAt(emails.length-1).replace(",", "");
  // }
  const invalidEmails = emails
  .split(',')
  .map(email => email.trim())
  // in a filter function the TRUE values will be kept so we want to tell
  //filter to keep INVALID emails so we say === false .
  .filter(email => re.test(email) === false);
  
  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`
  }
  return;
};