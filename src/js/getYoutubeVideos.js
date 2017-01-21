$(function() {

    reloadCardHover();

    var searchBar       = $('#searchBar');      // The div around the input dink
    var inputBar        = $('#youtubeQuery');   // the input field itself
    var youtubeResult   = $('#youtubeResult');
    var videos          = youtubeResult.html();
    var loading         = false;

    $.fn.api.settings.api = {
        'search' : '/api/search/?videos=1&query={query}'
    };

    $('#youtubeQuery').keypress(function (e) {
        if (e.which == 13 && !loading && inputBar.length > 0) {
            loading = true;
            $('form#search').submit();
            searchBar.addClass('loading disabled');
            inputBar.prop('disabled', true);

            var loadingHTML  = '<div class="ui active inverted dimmer">';
                loadingHTML += '<div class="ui text loader">Loading</div></div><p></p>';

            youtubeResult.html(loadingHTML);
            return false;
        }
    });

    $('.ui.form')
        .api({
            action : 'search',
            beforeSend: function(settings) {
                settings.urlData = {
                    query : inputBar.val()
                };
                return settings;
            },
            onComplete : function(response) {
                setTimeout(function(){
                    console.log('Fake delay');
                    console.log(response);
                    searchBar.removeClass('loading disabled');
                    inputBar.prop('disabled', false);
                    youtubeResult.html(videos);
                    reloadCardHover();
                    loading = false;
                }, 3000);
            },
            onSuccess : function(response) {
                console.log('Success');
            },
            onFailure : function(response) {
                console.log('Failure');
            }
        })

    function reloadCardHover(){
        $('.special.cards .image').dimmer({
              on: 'hover'
        });
    }
});
