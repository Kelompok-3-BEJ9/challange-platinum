const passport = require("../middlewares/passportMiddleware")

const authentication = passport.authenticate("jwt", {session: false})

module.exports = {authentication}