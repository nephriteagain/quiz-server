function passwordLengthChecker(password) {
  return password.length >= 6
}

function passwordCharChecker(password) {

  let hasUpper = false
  let hasLower = false
  let hasNum = false

  password.split('').forEach(char => {
    if (char >= 'A' && char <= 'Z') {
      hasUpper = true
    }
    else if (char >= 'a' && char <= 'z') {
      hasLower = true
    }
    if (char >= '0' && char <= '9') {
      hasNum = true
    }

  })

  if (hasUpper && hasLower && hasNum) {
    return true
  } else {
    return false
  }

}

function specialSymbolChecker(password, callback) {
  const regex = /[^a-zA-Z0-9]/g

  if (regex.test(password)) {
    return false
  } else {
    return true
  }

}

module.exports = {
  passwordLengthChecker,
  passwordCharChecker,
  specialSymbolChecker
}