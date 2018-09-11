Parse.initialize("npkxFoEevjqako73i8xO0h9qMH5SIQcA82YcvnII", "Kbaj5nm1fLpbPkvNTBVtBjl2ZYtYeKQ5K6ggOr79");

$(document).ready(function() {

    //predefine current user, antal af valgte overskrifter og bolean til multicharts
    var user = Parse.User.current();
    var countOverskrift = [];
    var hasBeenRun = 0;
    //var checked = [];

    //Link funktionen:
    function linkie(id, link){
      $(id).on('click', function () {
          $(".indhold").load(link);
      });
    }

    linkie("#information_link", "information.html");
    linkie("#kontakt_link", "kontakt.html");
    linkie("#generel_stats", "stats_general.html");

    //Logud
    $('#logud_link').on('click', function () {
        Parse.User.logOut();
        $(location).attr('href', 'index.html');
    });

    //Kontakt til vores tracking klasse i Parse:
    var Tracking = Parse.Object.extend("Tracking");
    var tracking = new Parse.Query(Tracking);

    //Relation til logget ind bruger
    tracking.equalTo("pointer", user);

    //Sorterer efter nyeste lavede track
    tracking.descending("createdAt");

    //Ny tracking info i Tracking klassen:
    var newTracking = new Tracking();

    //loader statistiksiden
    $('.indhold').load("stats.html", function () {

       //skjuler multichart div og ny tracking formen
       $(".multi_chart_div").hide();
       $("#ny_tracking").hide();

       //Finder alle tracks til current bruger:
       tracking.find({
           success: function (antal) {
               $('.row').empty();

               //array til kun at huske en af hver overskrift
               var uniqueNames = [];
               //Viser brugerens tracks
               for (var i = 0; i < antal.length; i++) {
                   var spesifik = antal[i],
                   spesifik_id = spesifik.id,
                   overskrift = spesifik.get('overskrift');

                   //fjerner overskrifter der er flere af og tilføjer til nyt array
                   countOverskrift.push(overskrift);
                   $.each(countOverskrift, function(i, el){
                       if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                   });
               }

               $('.indhold').on('click', '.slet_knap', function () {

                   var thisID = this.id;
                   tracking.equalTo("overskrift", this.id);

                   var r = confirm("Er du HELT sikker på du vil slette " + " ?");

                   tracking.find(function (object) {
                       if (r === true) {
                           Parse.Object.destroyAll(object);
                           alert(thisID + " er nu slettet");
                       }
                       else {
                           alert(thisID + " blev ikke slettet");
                       }
                   }).then(function (success) {
                       location.reload();
                   },
                   function (error) {
                       console.error("Error deleting related comments " + error.code + ": " + error.message);
                   });
               });

               //tegner kasser med indhold
               for(var k = 0; k < uniqueNames.length; k++) {
                   $('.row').append("" +
                   "<div class='col-xs-12 col-md-4 col-lg-3 statistikkasse'><img src='images/slet.png' class='slet_knap' id='" + uniqueNames[k] +
                   "'><h2 class='stat_overskrift'><a href='#' class='specifik_link' id='" + uniqueNames[k] + "_" + spesifik_id + "'>" + uniqueNames[k] +
                   "</a></h2>" + "<img src='images/diagram1.png'>" +
                   "<br>Sammenlign: <input name='checkbox_multi' class='checkbox_multi' id='" + uniqueNames[k] + "-" + spesifik_id + "' type='checkbox'></div>" );


                   //tæller til at bestemme antal af trykkede chckboxes
                   var count = 0;
                   //var isChecked = false;

                   //click på checkbox
                   $("#"+uniqueNames[k]+"-"+spesifik_id).click(function() {

                       //console.log("check spesifikId:"+ this.id);

                       //Title og Id fra checkboxens id, nu UDEN id:
                       var title = this.id.substr(0, this.id.indexOf('-'));
                       //Title og Id fra checkboxens id, nu UDEN overskrift:
                       var spesifikId = this.id.substr(this.id.indexOf('-') + 1);

                       tracking.equalTo("overskrift", title);
                       tracking.ascending("createdAt");
                       tracking.find({
                           success: function (overskrifter) {

                               //hvis checkbox er checked
                               if (document.getElementById(title+ "-" + spesifikId).checked) {
                                   //hvis multichart eksistere. Fjernes den.
                                   if (hasBeenRun === 1) {
                                       $('.multi_chart_div div').remove();
                                       hasBeenRun = 0;
                                   }
                                   //der er trykket på en checkbox
                                   count++;

                                   //tilføjer data til tablehead
                                   $(".highchartThead").append("<th class= '"+title+"'>" + title + ":</th>");

                                   //looper igennem gentagede overskrifter
                                   for (var z = 0; z < overskrifter.length; z++) {
                                       var multi_overskrift = overskrifter[z];
                                       var type = multi_overskrift.get("type");
                                       var amount = multi_overskrift.get("amount");
                                       var dato = multi_overskrift.createdAt;
                                       var td = "";
                                       var miliDato = Date.parse(dato);
                                       var finalDato = new Date(miliDato);
                                       finalDato.getDay();

                                       Date.prototype.month = function() {
                                           if (this.getMonth() == 0){this.currentMonth = "Januar"};
                                           if (this.getMonth() == 1){this.currentMonth = "Febuar"};
                                           if (this.getMonth() == 2){this.currentMonth = "Marts"};
                                           if (this.getMonth() == 3){this.currentMonth = "April"};
                                           if (this.getMonth() == 4){this.currentMonth = "Maj"};
                                           if (this.getMonth() == 5){this.currentMonth = "Juni"};
                                           if (this.getMonth() == 6){this.currentMonth = "Juli"};
                                           if (this.getMonth() == 7){this.currentMonth = "August"};
                                           if (this.getMonth() == 8){this.currentMonth = "September"};
                                           if (this.getMonth() == 9){this.currentMonth = "Oktober"};
                                           if (this.getMonth() == 10){this.currentMonth = "November"};
                                           if (this.getMonth() == 11){this.currentMonth = "December"};
                                       };

                                       finalDato.month();

                                       Date.prototype.day = function() {
                                           if (this.getDay() == 0){this.currentDay = "Man"};
                                           if (this.getDay() == 1){this.currentDay = "Tir"};
                                           if (this.getDay() == 2){this.currentDay = "Ons"};
                                           if (this.getDay() == 3){this.currentDay = "Tor"};
                                           if (this.getDay() == 4){this.currentDay = "Fre"};
                                           if (this.getDay() == 5){this.currentDay = "Lør"};
                                           if (this.getDay() == 6){this.currentDay = "Søn"};

                                       };

                                       finalDato.day();

                                       $(".highchartTbody").append("<tr id='" + [z] + title +"' class='" +title +"'></tr>");
                                       var tdCount = $(".highchart").children('tbody').children('#' + 1 + title).children('td').length;

                                       if (tdCount !== count) {
                                           for (var y = 1; y <= count - 1; y++) {
                                               td += "<td class='" + title +"'></td>";
                                           }
                                       }
                                       $("#" + [z] + title).append("<td >" + finalDato.currentDay + " " + finalDato.getDate() + ". " + finalDato.currentMonth + "</td >" + td + "<td>" + amount + "</td>");
                                   }
                               }
                               else {
                                   var titleClass = document.getElementsByClassName(title);
                                   var stopPoint = titleClass.length;
                                   for (var l = 0; l < stopPoint ; l++) {
                                       titleClass = document.getElementsByClassName(title);

                                       if(titleClass.length === 0) {
                                           break;
                                       }
                                       $(titleClass[l]).empty();
                                   }
                                   $('.multi_chart_div div').remove();
                               }
                               $(".multi_chart_div").show();
                               $(".highchart").hide();
                               $('.highchart').highchartTable();
                               hasBeenRun = 1;
                           }
                       });
                   });
               }

               //Specifiksiden:
               $('.specifik_link').on('click', function () {

                   //Title og Id fra checkboxens id, nu UDEN id:
                   var title2 = this.id.substr(0, this.id.indexOf('_'));
                   //Title og Id fra checkboxens id, nu UDEN overskrift:
                   var spesifikId2 = this.id.substr(this.id.indexOf('_') + 1);

                   //Viser ALLE brugerens tracks med samme overskrift
                   $('.indhold').load("specifik.html", function () {

                       tracking.equalTo("overskrift", title2);

                       tracking.find({
                           success: function (overskrifter) {
                               $("#specifik_overskrift").append(title2);
                               for (var z = 0; z < overskrifter.length; z++) {
                                   var multi_overskrift = overskrifter[z];
                                   var type = multi_overskrift.get("type");
                                   var amount = multi_overskrift.get("amount");


                                   //Tilføje til specifik track
                                   $('.indhold').on('click', '#indsend_sp_tracking', function () {
                                       //Fra hvilke felter
                                       var type = $('#type_sp_felt').val();
                                       var amount = parseInt($('#amount_sp_felt').val());

                                       if ($('#type_sp_felt').val().length === 0 || $('#amount_sp_felt').val().length === 0) {
                                           alert("Oops, du mangler noget!");
                                       }
                                       else {
                                           newTracking.set('overskrift', title2);
                                           newTracking.set('type', type);
                                           newTracking.set('pointer', user);
                                           newTracking.set('amount', amount);

                                           //Gemmer den nye tracking
                                           newTracking.save(null, {
                                               success: function (newTracking) {
                                                   // Opdaterer og giver feedback.
                                                   alert('Tracking opdateret med: ' + type + ', i: ' + title2);
                                                   location.reload();
                                               }
                                           });
                                       }
                                   });
                                   $(".highchart").append("<tr><td>" + type + "</td><td>" + amount + "</td></tr>");
                               }
                               $('table.highchart').highchartTable();
                           }
                       });
                       //Viser tilføjeformularen
                       $("#tracking_form").show();
                   });

               });
           },
           error: function (error) {
               alert("FEJL i statistiklisten! : " + error.code + " " + error.message);
           }
       });
    });

    //Tilbageknappen:
    $('.indhold').on('click', '#tilbage', function () {
        location.reload();
    });

    //Viser input-felter til ny tracking
    $('.indhold').on('click', '#maksimer_knap', function () {
        $("#ny_tracking").show();
    });

    //Ny tracking:
    //Lav Boolean til at bestemme positiv eller negativ!
    $('.indhold').on('click', '#indsend_tracking', function () {
        //Fra hvilke felter:
        var overskrift = $('#overskrift_felt').val();
        var type = $('#type_felt').val();
        var amount = parseInt($('#amount_felt').val());
        console.log("so far");
        //Alle felter skal udfyldes:
        if ($('#overskrift_felt').val().length === 0 || $('#type_felt').val().length === 0 ||$('#amount_felt').val().length === 0) {
            alert("Oops, du mangler noget!");
        }
        else  {
            newTracking.set('overskrift', overskrift);
            newTracking.set('type', type);
            newTracking.set('pointer', user);
            newTracking.set('amount', amount);

            //Gemmer den nye tracking
            newTracking.save(null, {
                success: function (newTracking) {
                    alert('Tracking tilføjet med: ' + overskrift);
                    location.reload();
                }
            });
        }
    });
});