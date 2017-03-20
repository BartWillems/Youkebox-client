$(function() {

    $('#youtubeResult').on('click', '.cstm_playlist_button', function() {
        var vod     = $(this);
        var id      = $(this).data('id');
        var video   = getVideoFromPlaylist(id);

        if(!video) return false;

        vod.addClass('loading');

        $.post('api/add/video/', {
            'addVideo'  : true,
            'video'     : video,
            'user'      : null
        }).always(function() {
            vod.removeClass('loading');
        }).done(function(data) {
            vod.addClass('disabled');
            vod.html('Added to playlist!');
        }).fail(function(data){
            console.log(data);
        });
    });
});

function getVideoFromPlaylist(id) {
    var videoLength = $scope.videos.length;
    for(i=0; i < videoLength; i++) {
        if($scope.videos[i].id == id) {
            return $scope.videos[i];
        }
    }
    return false;
}
