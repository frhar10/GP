//Linker til gruppens parse profil
Parse.initialize("npkxFoEevjqako73i8xO0h9qMH5SIQcA82YcvnII", "Kbaj5nm1fLpbPkvNTBVtBjl2ZYtYeKQ5K6ggOr79");


$(document).ready(function() {

    //Kontrollerer om man er logget ind
    var currentUser = Parse.User.current();
    if (currentUser) {       //Hvis man er logget ind
        $(location).attr('href','userIndex.html');
    } else {
        $(".indhold").load('forside.html');
    }

    //Link funktionen:
    function linkie(id, link){
        $(id).on('click', function () {
            $(".indhold").load(link);
        });
    }
    linkie("#home_link", "forside.html");
    linkie("#login_link", "login.html");
    linkie("#signup_link", "signup.html");
    linkie("#stats_gen_link", "stats_general.html");
    linkie("#kontakt_link", "kontakt.html");

    $('#information_link').on('click', function () {

        $(".indhold").load('information.html');
        $(".tilbageGem").hide();
    });

    $('#kontakt_link').on('click', function () {

        $(".indhold").load('kontakt.html');
        $(".tilbageGem").hide();
    });




    //Login:
    $('.indhold').on('click', '#loginknap', function () {
        var bruger = $('#bruger').val();
        var password = $('#passw').val();

        Parse.User.logIn(bruger, password, {
            success: function(user) {
                alert("Hej " + bruger + "!");
                $(location).attr('href','userIndex.html');


            },
            error: function(user, error) {
                alert("Fejl i login information");
            }
        });
    });



    //Sign-up:
    $('.indhold').on('click', '#signupknap', function () {

        //Fra inputfelt til parse:
        var bruger = $('#ny_bruger').val();
        var email = $('#ny_email').val();
        var password = $('#ny_passw').val();

        var new_user = new Parse.User();
        new_user.set("username", bruger);
        new_user.set("email", email);
        new_user.set("password", password);

        new_user.signUp(null, {
            success: function(new_user) {
                alert("Du er nu blevet oprettet! Dit nye liv begynder NU!");
                $(location).attr('href','userIndex.html');

                $('#user_link').append(bruger);
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Fejl i signup: " + error.message);
            }
        });
    });

    $('#logo').on('click', function () {
        var lampeSound = document.createElement('audio');
        lampeSound.setAttribute('src', 'sound/ding1.m4a');
        //audioElement.load()

        $.get();

        lampeSound.addEventListener("load", function () {
            lampeSound.play();
        }, true);

        lampeSound.play();

    });

});