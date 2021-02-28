function formatMessage(username, text) {
  return {
    username,
    text,
    time: new Date().toLocaleDateString('pt-Br')
  }
}

module.exports = formatMessage