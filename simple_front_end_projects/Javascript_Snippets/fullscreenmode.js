/**
 * Method to enter or exit fullscreen mode on the browser
 */
function toggleFullscreen() {
    if (isFullScreen()) {
		exitFullScreen();
	}
    else {
		requestFullScreen("<element>");
	}
}


/**
 * Method to detect when the browser is on fullscreen mode
 * Works only with Firefox and Chrome
 * @return {boolean} isFullScreen
 */
function isFullScreen()
{
    return (document.fullScreenElement && document.fullScreenElement !== null) 
        || document.mozFullScreen  //Firefox property
        || document.webkitIsFullScreen; //Chrome property
}


/**
 * Method to request fullscreen mode of an element
 * @param {element} Element to be presented in fullscreen mode
 */
function requestFullScreen(element)
{
    if (element.requestFullscreen){ //Other browsers method
		element.requestFullscreen();
	}
    else if (element.msRequestFullscreen) { //IE method
		element.msRequestFullscreen();
	}
    else if (element.mozRequestFullScreen) { //Firefox method
		element.mozRequestFullScreen();
	}
    else if (element.webkitRequestFullscreen) { //Chrome method
		element.webkitRequestFullscreen();
	} 
}

/**
 * Method to exit the browser's fullscreen mode
 */
function exitFullScreen()
{
    if (document.exitFullscreen) { //Other browsers method
		document.exitFullscreen();
	}
    else if (document.msExitFullscreen) { //IE method
		document.msExitFullscreen();
	} 
    else if (document.mozCancelFullScreen) { //Firefox method
		document.mozCancelFullScreen();
	}
    else if (document.webkitExitFullscreen) { //Chrome method
		document.webkitExitFullscreen();
	}
}