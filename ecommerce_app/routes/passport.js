const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user , done) => {
	done(null , user);
})
passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID:"820978601716-b52vhsf00l9op9ue7brlqt3mvha6gtj0.apps.googleusercontent.com", // Your Credentials here.
	clientSecret:"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", // Your Credentials here.
	callbackURL:"http://localhost:4000/auth/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	return done(null, profile);
}
));
