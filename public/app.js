function getResults(ptr) {
  var i = ptr;

  $('#results').empty();
  $.getJSON('/all', function(data) {
    if (i <= data.length) {
      $('#results').prepend('<h1>' + data[i].title + '</h1><br><br>');
      // $('#results').prepend('<p id="dataentry" data-id=' + data[i]._id + '>' + data[i].title + '</p><br><br>');
      $('#savenote').data('data-id', data[i]._id);
      $('#savenote').data('data-id', data[i]._id);
    }
  });
}


var ptr = 0
getResults(ptr);

$('#next').on('click', function() {
  if (ptr === 0) {
    $('#prev').show();
  }
  getResults(++ptr);

});

$('#prev').on('click', function() {
  if (ptr === 1) {
    $('#prev').hide();
  }
  if (ptr > 0) {
    getResults(--ptr);
  }
});

// $('#savenote').on('click', function() {
//   $.ajax({
//     type: "POST",
//     dataType: "json",
//     url: '/submit',
//     data: {
//       title: $('#title').val(),
//       note: $('#note').val(),
//       created: Date.now()
//     }
//   })
//     .done(function(data) {
//       $('#results').prepend('<p id="dataentry" data-id=' + data._id + '>' + data.title + '<span class=deleter>X</span></p>');
//       $('#note').val("");
//       $('#title').val("");
//     });
// });

$('#clearall').on('click', function() {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: '/clearall',
    success: function(response) {
      console.log(response);
      $('#results').empty();
    }
  });
});


$(document).on('click', '.deleter', function() {
  var selected = $(this).parent();
  $.ajax({
    type: "GET",
    url: '/delete/' + selected.data('id'),
    success: function(response) {
      console.log(response);
      selected.remove();
    }
  });
});


$(document).on('click', '#dataentry', function() {
  var selected = $(this);
  console.log(selected);
  $.ajax({
    type: "GET",
    url: '/find/' + selected.data('id'),
    success: function(data) {
      $('#note').val(data.note);
      $('#title').val(data.title);
      $('#actionbutton').html('<button id="updater" data-id="' + data._id + '">Update</button>');
    }
  });
});

$(document).on('click', '#savenote', function() {

  var noteid = $('#savenote').data('data-id');
  console.log('noteid = ' + noteid);
  $.ajax({
    type: "POST",
    url: '/update/' + noteid,
    dataType: "json",
    data: {
      note: $('#note').val()
    },
    success: function(data) {
      $('#note').val("");

      // getResults();
      console.log('success')
    }
  });
});