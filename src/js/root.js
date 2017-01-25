var $scope = {
    video       : $('#current-video'),
    playlist    : {}
};

$(function() {

    $.fn.api.settings.api = {
        'search'    : 'api/search/?videos=1&query={query}',
        'add video' : 'api/add/video'
    };

    $.fn.embed.settings.sources = {
        youtube: {
            name   : 'youtube',
            type   : 'video',
            icon   : 'video play',
            domain : 'youtube.com',
            url    : '//www.youtube.com/embed/{id}',
            parameters: function(settings) {
                return {
                    autohide       : !settings.showUI,
                    autoplay       : true,
                    color          : settings.colors || undefined,
                    hq             : settings.hd,
                    jsapi          : settings.api,
                    modestbranding : 1
                };
            }
        }
    }
});

function parseDuration(duration) {
    var durationMap = {
        PT : '',
        H  : ':',
        M  : ':',
        S  : '',
    };
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
    return duration;
}
