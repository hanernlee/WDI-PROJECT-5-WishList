$(document).ready(function(){

  $('#add-btn').on('click', function(event) {
    event.preventDefault();

    var $item = $('#item-name').val();
    var $itemImg = $('#item-image').val();
    var $itemPrice = $('#item-price').val();

    var start = $('#datepickerone').datepicker('getDate');
    var end   = $('#datepickertwo').datepicker('getDate');
    var days  = (end - start)/1000/60/60/24;

    var newItem = {
      name : $item,
      img : $itemImg,
      price : $itemPrice,
      duration : days
    }

    $.ajax({
     url: '/add',
     data: newItem,
     dataType: "json",
     method: 'POST'

    }).done(function(response) {

      console.log('yes');

    });

 });






});
