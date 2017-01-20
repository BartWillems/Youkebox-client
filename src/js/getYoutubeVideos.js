$(function() {

    var searchBar       = $('#searchBar');
    var youtubeResult   = $('#youtubeResult');
    var videos          = youtubeResult.html();

    $('#youtubeQuery').keypress(function (e) {
        if (e.which == 13) {
            $('form#search').submit();
            searchBar.addClass('loading disabled');
            var loadingHTML  = '<div class="ui active inverted dimmer">';
            loadingHTML += '<div class="ui text loader">Loading</div></div><p></p>';
            youtubeResult.html(loadingHTML);
            return false;
        }
    });

    $('form#search')
        .api({
            url: 'http://www.google.com?q=dink',
            onComplete : function(response) {
                setTimeout(function(){
                    console.log('Fake delay');
                    console.log(response);
                    searchBar.removeClass('loading disabled');
                    youtubeResult.html(videos);
                }, 3000);
            },
            onSuccess : function(response) {
                console.log('Success');
            },
            onFailure : function(response) {
                console.log('Failure');
            }
        })
});
