$(function() {
    var currentlyPlaying  = $('#currentlyPlaying');
    var playlistBody      = $('#playlistBody');
    var rowTemplate       = null;
    $.get('templates/playlist.template.html', function(p) {
        rowTemplate = p;
        fetchVideos();
    }, 'html');

    function fetchVideos() {
        $.get("api/get/playlist/", function(data) {
            var playlistLength = $scope.playlist.length;
            if(playlistLength !== data.length) {
                $scope.playlist = data;
                drawPlaylist();
            } else {
                for(i=0; i < playlistLength; i++) {
                    if($scope.playlist[i].id !== data[i].id) {
                        $scope.playlist = data;
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
            setTimeout(fetchVideos, 5000);
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
            row = row.replace('{{duration}}', parseDuration($scope.playlist[i].duration));
            row = row.replace('{{requestor}}', 'anonymous');
            html += row;
            y++;
        }
        playlistBody.html(html);
    }

    function getCurrentVideo() {
        if($scope.playlist.length > 0) {
            if($scope.currentVideo !== $scope.playlist[0].video_id) {
                var firstVideo  = $scope.playlist[0];
                var id          = firstVideo.video_id;
                var videoTime   = firstVideo.time;
                $scope.currentVideo = id;
                $scope.video.embed({
                    source  : 'youtube',
                    url     : '//www.youtube.com/embed/' + id + '?start=' + videoTime,
                    id      : id
                });
                currentlyPlaying.html(firstVideo.title);
            }
        }
    }
});
