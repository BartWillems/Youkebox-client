$(function() {

    var searchBar       = $('#searchBar');
    var youtubeResult   = $('#youtubeResult');

    $('#youtubeQuery').keypress(function (e) {
        if (e.which == 13) {
            searchBar.addClass('loading disabled');
            // This should go in the beforeSend API
            var loadingHTML  = '<div class="ui active inverted dimmer">';
                loadingHTML += '<div class="ui text loader">Loading</div></div><p></p>';
            youtubeResult.html(loadingHTML);
        }
    });
});
