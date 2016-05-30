$(document).ready(function(){
   // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
   $(function() {
     $( "#datepickerone" ).datepicker({ dateFormat: 'dd-mm-yy' });
     $( "#datepickertwo" ).datepicker({ dateFormat: 'dd-mm-yy', minDate: 0 });
    });

   $('.modal-trigger').leanModal();

 });
