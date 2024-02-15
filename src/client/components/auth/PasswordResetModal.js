// TODO make modal for user to reset their password
// most of the functionality can be copied from the authModal component & authModal store
// - can be triggered to popup in a different way as the password reset modal can just be in one place (ie add to Verify page component)

// The VerifyPage component (/src/client/components/auth/VerifyPage.js) auto posts the verification hash from links
// and posts it to /verify (happens in /src/client/store/user.js)
// make the modal appear when the user goes to the password reset link they were sent
// - verify its a password reset link at the /verify endpoint (/src/server/auth/index.js)

// post the password to a new endpoint to reset password /auth/reset or smth
// validate the password client and server side


// other things to have on the form:
// checkbox where people have to say they'll use a password manager
// checkbox consenting to spending x dbux for the password reset lol
//   - show dbux balance