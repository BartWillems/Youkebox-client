$(function() {

    getCurrentVideo();

    function getCurrentVideo() {
        if($scope.playlist.length > 0) {
            if($scope.video.data('id') !== $scope.playlist[0].video_id) {
                // Set the currently playing video as the first entry in the playlist
                $scope.video.data('id', $scope.playlist[0].video_id);
            }
        }
        setTimeout(getCurrentVideo(), 1000);
    }
});
