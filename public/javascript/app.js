$(document).ready(function(){


  var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

  if (isSafari) {
    $('#login-form').css("margin-bottom", "4em");
    $('#sign-up-form').css("margin-bottom","4em");
  }

  if(navigator.userAgent.match('CriOS')) {
    $('#login-form').css("margin-bottom", "1em");
    $('#sign-up-form').css("margin-bottom","1em");
  }


  $(function() {
    $( "#datepickerone" ).datepicker({ dateFormat: 'dd-mm-yy', minDate: 0 });
    $( "#datepickertwo" ).datepicker({ dateFormat: 'dd-mm-yy', minDate: 0 });
  });

  $("#datepickerone").datepicker({
        dateFormat: "dd-M-yy",
        minDate: 0,
        onSelect: function (date) {
            var date2 = $('#datepickerone').datepicker('getDate');
            date2.setDate(date2.getDate() + 1);
            $('#datepickertwo').datepicker('setDate', date2);
            //sets minDate to datepickerone date + 1
            $('#datepickertwo').datepicker('option', 'minDate', date2);
        }
    });
    $('#datepickertwo').datepicker({
        dateFormat: "dd-M-yy",
        onClose: function () {
            var datepickerone = $('#datepickerone').datepicker('getDate');
            var datepickertwo = $('#datepickertwo').datepicker('getDate');
            //check to prevent a user from entering a date below date of datepickerone
            if (datepickertwo <= datepickerone) {
                var minDate = $('#datepickertwo').datepicker('option', 'minDate');
                $('#datepickertwo').datepicker('setDate', minDate);
            }
        }
    });

  $('select').material_select();

  $('nav').on('click','a', function() {
    $('.modal-trigger').leanModal();
  });

  $('#unique-item').on('click','a', function() {
    $('.modal-trigger').leanModal();
  });

  $('.logins').on('click','a', function() {
    $('.modal-trigger').leanModal();
  });

 });
