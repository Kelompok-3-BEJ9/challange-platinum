function formatEmail(email) {
  // Split email into local and domain parts
  const [localPart, domainPart] = email.split("@");

  // Check if both parts exist and have non-empty values
  if (
    localPart &&
    domainPart &&
    localPart.length > 0 &&
    domainPart.length > 0
  ) {
    // Check if the domain part has at least one dot (.)
    if (domainPart.includes(".")) {
      return true;
    }
  }

  return false;
}

module.exports = { formatEmail };