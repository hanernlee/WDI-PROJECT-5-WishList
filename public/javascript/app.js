$(document).ready(function(){

  $(function() {
    $( "#datepickerone" ).datepicker({ dateFormat: 'dd-mm-yy' });
    $( "#datepickertwo" ).datepicker({ dateFormat: 'dd-mm-yy', minDate: 0 });
  });

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
