$(function() {

    reloadCardHover();

    var searchBar       = $('#searchBar');      // The div around the input dink
    var inputBar        = $('#youtubeQuery');   // the input field itself
    var youtubeResult   = $('#youtubeResult');
    var videos          = youtubeResult.html();
    var loading         = false;
    var card            = null;

    $.get('/templates/card.template.html', function(r) {
        inputBar.prop('disabled', false);
        card = r;
    }, 'html');

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
                console.log(response);
                searchBar.removeClass('loading disabled');
                inputBar.prop('disabled', false);
                loading = false;
            },
            onSuccess : function(response) {
                console.log('Success');
                var videoLength = response.results.length;
                var videos      = response.results;
                var html        = '';
                for(var i = 0; i < videoLength; i++) {
                    var video = videos[i];
                    var videoCard = card;
                    videoCard = videoCard.replace('{{thumbnail}}', video.snippet.thumbnails.high.url);
                    videoCard = videoCard.replace('{{title}}', video.snippet.title)
                    html = html + videoCard;
                }
                youtubeResult.html(html);
                reloadCardHover();
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
