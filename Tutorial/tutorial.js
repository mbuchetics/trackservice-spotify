sp = getSpotifyApi(1);

window.Models = sp.require("sp://import/scripts/api/models");
window.Views = sp.require("sp://import/scripts/api/views");

exports.init = init;

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

function updatePageWithTrackDetails() {
	
	var header = document.getElementById("header");

	// This will be null if nothing is playing.
	var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();

	if (playerTrackInfo == null) {
		header.innerText = "Nothing playing!";
	} else {
		var track = playerTrackInfo.track;
		header.innerText = track.name + " on the album " + track.album.name + " by " + track.album.artist.name + ".";
	}
}

function searchGoogleForSpotify() {

	var req = new XMLHttpRequest();
	req.open("GET", "https://www.googleapis.com/customsearch/v1?q=spotify", true);

	req.onreadystatechange = function() {

		console.log(req.status);

   		if (req.readyState == 4) {
    		if (req.status == 200) {
       			console.log("Search complete");
     		}
   		}
  	};

	req.send();
}