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
            $scope.playlist = data;
            drawPlaylist();
            if($scope.playlist.length > 0) {
                currentlyPlaying.html(data[0].title);
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
});