var sp = getSpotifyApi(1);

window.Models = sp.require("sp://import/scripts/api/models");
window.Views = sp.require("sp://import/scripts/api/views");

function init() {

    updatePageWithTrackDetails();
    
    var track = Models.Track.fromURI("spotify:track:4n6AGL10M8fbm8oHxhK16j");
    //var playlist = new Models.Playlist("TestPlaylist");
    //playlist.add(track);

    sp.trackPlayer.addEventListener("playerStateChanged", function (event) {
        
        // Only update the page if the track changed
        if (event.data.curtrack == true) {
            updatePageWithTrackDetails();
        }
    });
}

function updateSongs() {
    console.log("updating ...");
    
    window.CurrentPlaylist = new Models.Playlist();
    
    $.getJSON('http://trackservice.herokuapp.com/api/plays?count=10', function(data) {    
        for(i = 0; i < data.length; i++) {
            var song = data[i];                
            
            console.log(song);
            
            if (song.spotify) {
                var track = Models.Track.fromURI(song.spotify);
                
                if (track) {                
                    console.log(track.toString());
                    
                    CurrentPlaylist.add(track);
                    
                    if (track.data && track.data.album) {
                        var cover = track.data.album.cover;
                    
                        if (cover)
                            $('#covers').append("<div class=song><div class=title>" + song.artist + " - " + song.title + "</div><div class=cover><img src=" + cover + "></img></div></div>");
                    }
                }
            }
            else {
                console.log("TEST");
                var track = Models.Track.fromURI("spotify:local:" + song.artist + ":UnknownAlbum:" + song.title + ":000");
                console.log(track);
                CurrentPlaylist.add(track);
            }   
        }
        
        var FIELD       = Views.Track.FIELD,
            TRACK_FLAGS = FIELD.STAR | FIELD.NAME | FIELD.ARTIST;
        
        var viewlist = new Views.List(CurrentPlaylist, function(track) {
            return new Views.Track(track);
        });
        
        console.log(viewlist);
        $('#playlist').html(viewlist.node);
    });
}

$(document).ready(function() {
    updateSongs();
    
    $('.add-playlist').click(function() {
        console.log("clicked");
        
        sp.core.library.createPlaylist("FM4 Songs", CurrentPlaylist.data.all());
        
    });
});