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
    $.get('/templates/card.template.html', function(c) {
        $.get('/templates/error.template.html', function(e){
            inputBar.prop('disabled', false);
            error = e;
        })
        card = c;
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
                youtubeResult.html('');
                loading = false;
            },
            onSuccess : function(response) {
                console.log('Success');
                var videoLength = response.length;
                var videos      = response;
                var html        = '';
                var durationMap = {
                    PT : '',
                    H  : ':',
                    M  : ':',
                    S  : '',
                };
                for(var i = 0; i < videoLength; i++) {
                    var video       = videos[i];
                    var videoCard   = card;
                    var duration    = video.contentDetails.duration;
                    duration = duration.replace(/PT|H|M|S/gi, function(matched) {
                        return durationMap[matched];
                    });
                    duration = duration.split(':');
                    if(duration.length > 2) {
                        // Duration > 1 hour
                        if(duration[1] < 10) {
                            duration[1] = '0' + duration[1];
                        }
                        if(!duration[2]) {
                            duration[2] = '00';
                        } else if(duration[2] < 10) {
                            duration[2] = '0' + duration[2];
                        }
                        duration = duration[0] + ':' + duration[1] + ':' + duration[2];
                    } else if(duration.length > 1) {
                        // Duration > 1 minute
                        if(duration[1] < 10) {
                            duration[1] = '0' + duration[1];
                        }
                        duration = duration[0] + ':' + duration[1];
                    } else {
                        // Duration < 1 minute
                        duration = duration[0] + ' seconds';
                    }
                    videoCard = videoCard.replace('{{thumbnail}}', video.snippet.thumbnails.high.url);
                    videoCard = videoCard.replace('{{title}}', video.snippet.title)
                    videoCard = videoCard.replace('{{duration}}', duration)
                    html = html + videoCard;
                }
                youtubeResult.html(html);
                reloadCardHover();
            },
            onFailure : function(response) {
                console.log('Failure');
                youtubeError.html(error);
            }
        })

    function reloadCardHover(){
        $('.special.cards .image').dimmer({
            on: 'hover'
        });
    }
});
