$(document).ready(function(){

  $('#add-btn').on('click', function(event) {
    event.preventDefault();

    var $item = $('#item-name').val();
    var $itemImg = $('#item-image').val();
    var $itemPrice = $('#item-price').val();

    var start = $('#datepickerone').datepicker('getDate');
    var end   = $('#datepickertwo').datepicker('getDate');
    var days  = (end - start)/1000/60/60/24;

    if (days === 0) {
      days = 1;
    }

    var newItem = {
      name : $item,
      img : $itemImg,
      price : $itemPrice,
      duration : days,
      start: start,
      end: end
    }

    $.ajax({
     url: '/add',
     data: newItem,
     dataType: "json",
     method: 'POST'
    }).done(function(response) {


      var itemString = $('#item-template').html();
      var itemTemplateFn = Handlebars.compile(itemString);
      var itemHTML = itemTemplateFn({
        itemId: response.item._id,
        itemName: response.item.name,
        itemImg: response.item.imageUrl,
        itemStatus: 'incomplete',
        itemPrice: response.item.price,
        itemStart: response.item.start.slice(0,15),
        itemEnd: response.item.end.slice(0,15),
        itemDuration: response.item.duration,
        itemSave: (response.item.price/response.item.duration).toFixed(2)
      });

      var $newItem = $(itemHTML);
      $('#unique-item').append($newItem);
    });
 });


 $('#unique-item').on('click', '.delete-btn', function() {
   event.preventDefault();
   var itemId = $(this).closest('form').attr("action").slice(8);
   console.log(itemId);

   $.ajax({
    url: '/delete/' + itemId,
    dataType: "json",
    type: 'delete'
   }).done(function(response) {
     $('#'+response.item._id).remove();
   });
 });


 $('#unique-item').on('click','.done-btn', function() {

  var $divId = $(this).closest('.item-div').attr("id");
  console.log($divId);

   $.ajax({
    url: '/update/' + $divId,
    dataType: "json",
    type: 'post'
   }).done(function(response) {

      var $tick = $('<i>').text('done').addClass('material-icons');

      $tick.addClass('done-tick');

      $('#'+response.item._id).find('.item-icon').addClass('done-color').append($tick);

   });
 });

 $('#unique-item').on('click','.redo-btn', function() {

  var $redoId = $(this).closest('.item-div').attr("id");
  console.log($redoId);

   $.ajax({
    url: '/reverse/' + $redoId,
    dataType: "json",
    type: 'post'
   }).done(function(response) {

      $('#'+response.item._id).find('.item-icon').removeClass('done-color');
      $('#'+response.item._id).find('.item-icon').find('.done-tick').remove();

   });
 });



});
