$(function() {
    var currentlyPlaying  = $('#currentlyPlaying');
    var currentlyListening= $('#currentlyListening');
    var playlistBody      = $('#playlistBody');
    var rowTemplate       = null;
    $.get('templates/playlist.template.html', function(p) {
        rowTemplate = p;
        fetchVideos();
    }, 'html');

    function fetchVideos() {
        $.get("api/get/playlist/", function(data) {

            var playlistLength  = $scope.playlist.length;   // The number of videos in the local playlist
            var videos          = data.videos;              // The video list received from the server
            var meta            = data.meta;                // The metadata from the server(# listeners, ...)

            if(meta.userCount === 1) {
                currentlyListening.html(meta.userCount + ' user listening');
            } else {
                currentlyListening.html(meta.userCount + ' users listening');
            }

            if(playlistLength !== videos.length) {
                $scope.playlist = videos;
                drawPlaylist();
            } else {
                for(i=0; i < playlistLength; i++) {
                    if($scope.playlist[i].id !== videos[i].id) {
                        $scope.playlist = videos;
                        drawPlaylist();
                        break;
                    }
                }
            }
            if($scope.playlist.length > 0) {
                getCurrentVideo();
            } else {
                currentlyPlaying.html('Nothing');
            }
            setTimeout(fetchVideos, 2000);
        }, "json");
    }

    function drawPlaylist() {
        var playlistLength  = $scope.playlist.length;
        var row             = '';
        var html            = '';
        var y               = 1;
        for(i = 0; i < playlistLength; i++) {
            row = rowTemplate;
            row = row.replace('{{index}}', y);
            row = row.replace('{{title}}', $scope.playlist[i].title);
            row = row.replace('{{video_id}}', $scope.playlist[i].video_id);
            row = row.replace('{{duration}}', parseDuration($scope.playlist[i].duration));
            row = row.replace('{{requestor}}', 'anonymous');
            html += row;
            y++;
        }
        playlistBody.html(html);
    }

    function getCurrentVideo() {
        // console.log('DEBUG: getCurrentVideo');
        if($scope.playlist.length > 0) {
            if($scope.currentVideo !== $scope.playlist[0].video_id) {
                var firstVideo  = $scope.playlist[0];
                var id          = firstVideo.video_id;
                var videoTime   = firstVideo.time;
                $scope.currentVideo = id;
                $scope.video.embed({
                    source  : 'youtube',
                    url     : '//www.youtube.com/embed/' + id,
                    id      : id
                });
                currentlyPlaying.html(firstVideo.title);
            }
        }
    }
});
