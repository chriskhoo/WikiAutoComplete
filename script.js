$(function(){
  console.log('script file linked');

  // WIKIPEDIA SEARCH function ----------------------------------------------------------------------------------------

  // autocomplete from http://w3lessons.info/2015/03/01/autocomplete-search-using-wikipedia-api-and-jquery-ui/
  // autocomplete docs - http://api.jqueryui.com/autocomplete/

  $('#input-search').autocomplete({
    minLength: 2,
    delay: 800,
    source: function(request, response){
      // note request is an object with term as it's only key
      $.ajax({
        url: "http://en.wikipedia.org/w/api.php",
        dataType: "jsonp",
        data: {
            'action': "opensearch",
            'format': "json",
            'search': request.term
        },
        success: function(data) {
          // response is a jquery fn
          // data is an array with 0 being the searched term and 1 being the first 10 ranked responses, length dependent on number of results
          response(data[1]);
        }
      })
    },
    // create function to run search on clicking the auto complete option
    select: function(event, ui) {
        $("#input-search").val(ui.item.label);
        updateResults(); }
  })
  // note an alternative method not requiring UI library can be found here: https://simplestepscode.com/autocomplete-data-tutorial/

  // fade in (val=1) or out (val=0) the after-search-line with chosen speed
  var displayAfterSearchLine = function(speed, val) {
    $('.awesome-line').css({
      transition: 'opacity ' + speed + 's ease-in-out',
      'opacity': val
    });
  };


  /* click button event */
  $('#button-search').click(function(event){
    event.preventDefault();
    updateResults();
  });

  var updateResults = function(){
    // clear previous results
    $('.results').empty();
    // run the search function with the text in the input field
    runWiki($('input#input-search').val());
  }

  /* search value in wikipedia and parse it to a list */
  var runWiki = function(val) {
    displayAfterSearchLine(0.3, 1);

    var URL_wiki = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + val + '&callback=?';

    $.getJSON(URL_wiki, function(data) {

    // go over all values
      for (var i = 0; i < data[1].length; i++) {
        var title = data[1][i];
        // if title ends with - omit it
        if (title.length - 1 === '-') {
          title = title.substring(0, str.length - 1);
        }

        // if there is no description - add 'No Description'
        var desc;
        if (data[2][i] !== '') {
          desc = data[2][i];
        } else {
          desc = 'No Description';
        }

        // define page link
        var link = data[3][i];
        // declare th<li> html
        var listLi = '<li><a href="' + link + '" target="_blank"><span class="title">' + title + '</span><span class="desc"> - ' + desc + '</span></a></li>';

        // append to <ul>
        $('.results').append(listLi);
      } // close 'for' loop
    }); // close JSON call
  }; // close runWiki function


  /* clearing the results if user press Backspace */
  $('input#input-search').keyup(function(e) {
    if (e.which === 8) {
      displayAfterSearchLine(0, 0);
      $('.results').empty();
    }
  });

});
