$(function() {

    reloadCardHover();

    var searchBar       = $('#searchBar');      // The div around the input dink
    var inputBar        = $('#youtubeQuery');   // the input field itself
    var youtubeResult   = $('#youtubeResult');
    var youtubeError    = $('#youtubeError');
    var videos          = youtubeResult.html();
    var loading         = false;
    var card            = null;
    var error           = null;

    // Fetch the required template files
    // Only enable input when we have both
    $.get('templates/card.template.html', function(c) {
        $.get('templates/error.template.html', function(e){
            inputBar.prop('disabled', false);
            error = e;
        })
        card = c;
    }, 'html');


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
                searchBar.removeClass('loading disabled');
                inputBar.prop('disabled', false);
                youtubeResult.html('');
                loading = false;
            },
            onSuccess : function(response) {
                var videoLength = response.length;
                var videos      = response;
                $scope.videos   = response;
                var html        = '';
                for(var i = 0; i < videoLength; i++) {
                    var video       = videos[i];
                    var videoCard   = card;
                    var duration    = parseDuration(video.contentDetails.duration);
                    videoCard = videoCard.replace('{{thumbnail}}', video.snippet.thumbnails.high.url);
                    videoCard = videoCard.replace('{{title}}', video.snippet.title)
                    videoCard = videoCard.replace('{{duration}}', duration)
                    videoCard = videoCard.replace('{{videoID}}', video.id)
                    html = html + videoCard;
                }
                youtubeResult.html(html);
                reloadCardHover();
            },
            onFailure : function(response) {
                console.log('Failure');
                youtubeError.html(error);
                $scope.videos = null;
            }
        })

    function reloadCardHover(){
        $('.special.cards .image').dimmer({
            on: 'hover'
        });
    }
});

