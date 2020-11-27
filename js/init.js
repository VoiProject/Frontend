(function ($) {
  $(function () {

    $('.sidenav').sidenav();
    $(document).ready(function () {
      $('input#input_text, textarea#textarea2').characterCounter();
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
