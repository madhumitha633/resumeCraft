
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // ELEMENTS
    // =====================================

    const signinForm = document.getElementById("signinForm");
    const signupForm = document.getElementById("signupForm");

    const signinTab = document.getElementById("signinTab");
    const signupTab = document.getElementById("signupTab");

    const showSignup = document.getElementById("showSignup");
    const showSignin = document.getElementById("showSignin");

    const signinMessage = document.getElementById("signinMessage");
    const signupMessage = document.getElementById("signupMessage");

    const forgotPassword = document.getElementById("forgotPassword");


    // =====================================
    // LOCAL STORAGE KEY
    // =====================================

    const ACCOUNT_KEY = "resumeCraftUserAccount";


    // =====================================
    // GET SAVED ACCOUNT
    // =====================================

    function getSavedAccount() {

        try {

            const account = localStorage.getItem(ACCOUNT_KEY);

            return account ? JSON.parse(account) : null;

        } catch (error) {

            console.error("Unable to read account:", error);

            return null;
        }
    }


    // =====================================
    // SAVE ACCOUNT
    // =====================================

    function saveAccount(account) {

        localStorage.setItem(
            ACCOUNT_KEY,
            JSON.stringify(account)
        );
    }


    // =====================================
    // STORE CURRENT USER
    // =====================================

    function setCurrentUser(user) {

        const currentUser = {
            name: user.name,
            email: user.email
        };

        sessionStorage.setItem(
            "resumeCraftCurrentUser",
            JSON.stringify(currentUser)
        );
    }


    // =====================================
    // REDIRECT TO DASHBOARD
    // =====================================

    function redirectToDashboard() {

        window.location.href = "dashbord.html";
    }


    // =====================================
    // SWITCH TO SIGN IN
    // =====================================

    function showSignInForm() {

        signinForm.hidden = false;
        signupForm.hidden = true;

        signinTab.classList.add("active");
        signupTab.classList.remove("active");

        signinMessage.textContent = "";
        signupMessage.textContent = "";
    }


    // =====================================
    // SWITCH TO SIGN UP
    // =====================================

    function showSignUpForm() {

        signinForm.hidden = true;
        signupForm.hidden = false;

        signinTab.classList.remove("active");
        signupTab.classList.add("active");

        signinMessage.textContent = "";
        signupMessage.textContent = "";
    }


    // =====================================
    // TAB EVENTS
    // =====================================

    signinTab.addEventListener("click", showSignInForm);

    signupTab.addEventListener("click", showSignUpForm);

    showSignup.addEventListener("click", showSignUpForm);

    showSignin.addEventListener("click", showSignInForm);


    // =====================================
    // CREATE ACCOUNT
    // =====================================

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document
            .getElementById("signupName")
            .value.trim();

        const email = document
            .getElementById("signupEmail")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("signupPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;


        // Validate password length

        if (password.length < 6) {

            signupMessage.textContent =
                "Password must contain at least 6 characters.";

            signupMessage.className = "form-message error";

            return;
        }


        // Validate password confirmation

        if (password !== confirmPassword) {

            signupMessage.textContent =
                "Passwords do not match.";

            signupMessage.className = "form-message error";

            return;
        }


        // Check whether account already exists

        const existingAccount = getSavedAccount();

        if (
            existingAccount &&
            existingAccount.email === email
        ) {

            signupMessage.textContent =
                "An account with this email already exists. Please sign in.";

            signupMessage.className = "form-message error";

            return;
        }


        // Create account

        const user = {

            name: name,

            email: email,

            password: password
        };


        // Save account in localStorage

        saveAccount(user);


        // Store current user

        setCurrentUser(user);


        // Display success message

        signupMessage.textContent =
            "Account created successfully! Redirecting to dashboard...";

        signupMessage.className = "form-message success";


        // Redirect to dashboard

        setTimeout(function () {

            redirectToDashboard();

        }, 1000);

    });


    // =====================================
    // SIGN IN
    // =====================================

    signinForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document
            .getElementById("signinEmail")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("signinPassword")
            .value;


        // Get saved account

        const savedUser = getSavedAccount();


        // Check account existence

        if (!savedUser) {

            signinMessage.textContent =
                "No account found. Please create an account first.";

            signinMessage.className = "form-message error";

            return;
        }


        // Validate email and password

        if (
            savedUser.email !== email ||
            savedUser.password !== password
        ) {

            signinMessage.textContent =
                "Incorrect email or password.";

            signinMessage.className = "form-message error";

            return;
        }


        // Store current user

        setCurrentUser(savedUser);


        // Display success message

        signinMessage.textContent =
            "Sign in successful! Redirecting to dashboard...";

        signinMessage.className = "form-message success";


        // Redirect to dashboard

        setTimeout(function () {

            redirectToDashboard();

        }, 700);

    });


    // =====================================
    // FORGOT PASSWORD
    // =====================================

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();


        // Get account

        const savedUser = getSavedAccount();


        // Check whether account exists

        if (!savedUser) {

            signinMessage.textContent =
                "No account found. Please create an account first.";

            signinMessage.className = "form-message error";

            return;
        }


        // Ask for registered email

        const email = prompt(
            "Enter the email address you used to create your account:"
        );


        if (email === null) {

            return;
        }


        // Check email

        if (
            email.trim().toLowerCase() !==
            savedUser.email.toLowerCase()
        ) {

            signinMessage.textContent =
                "This email address does not match your account.";

            signinMessage.className = "form-message error";

            return;
        }


        // Ask for new password

        const newPassword = prompt(
            "Enter your new password (at least 6 characters):"
        );


        if (newPassword === null) {

            return;
        }


        // Validate new password

        if (newPassword.length < 6) {

            signinMessage.textContent =
                "New password must contain at least 6 characters.";

            signinMessage.className = "form-message error";

            return;
        }


        // Ask to confirm password

        const confirmNewPassword = prompt(
            "Confirm your new password:"
        );


        if (confirmNewPassword === null) {

            return;
        }


        // Check confirmation

        if (newPassword !== confirmNewPassword) {

            signinMessage.textContent =
                "Passwords do not match. Please try again.";

            signinMessage.className = "form-message error";

            return;
        }


        // Update password

        savedUser.password = newPassword;


        // Save updated account

        saveAccount(savedUser);


        // Display success message

        signinMessage.textContent =
            "Password changed successfully! You can now sign in using your new password.";

        signinMessage.className = "form-message success";


        // Clear password field

        document.getElementById("signinPassword").value = "";

    });

});
