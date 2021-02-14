
const checkSession = async (req, res, next) => {
    if (!req.session.loggedin) {
        return res.redirect("/login");
    } 
    next();
};



exports.checkSession = checkSession;
