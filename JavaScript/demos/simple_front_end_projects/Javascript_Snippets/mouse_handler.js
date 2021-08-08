
//
//Method to detect when a mouse button is pressed (detects all 3 possible buttons) 
//
$(document).on('mousedown', function(evt) 
{
	//For chrome, firefox, safari, edge
	//evt.button 0 = The left mouse button
	//evt.button 1 = The middle mouse button
	//evt.button 2 = The right mouse button

	//For internet explorer 8 and earlier
	//evt.button 1 = The left mouse button
	//evt.button 4 = The middle mouse button
	//evt.button 2 = The right mouse button
	
	//alert(evt.button + " down");
	console.log(evt.button);
});

//
//Method to detect when a mouse button is released (detects all 3 possible buttons) 
//
$(document).on('mouseup', function(evt) 
{
	//For chrome, firefox, safari, edge
	//evt.button 0 = The left mouse button
	//evt.button 1 = The middle mouse button
	//evt.button 2 = The right mouse button

	//For internet explorer 8 and earlier
	//evt.button 1 = The left mouse button
	//evt.button 4 = The middle mouse button
	//evt.button 2 = The right mouse button
	
    //alert(evt.button + " up");
	console.log(evt.button);
});



//
//Method to detect when the user uses the mouse wheel
//
$(document).bind('mousewheel DOMMouseScroll', function(event)
{
    //console.log(event.type);

    //This code works for chrome, internet explorer
	if (event.type == 'mousewheel')
	{
		if(event.originalEvent.wheelDelta > 0)
		{
			//console.log("Scrolling up");
			//alert("Scrolling up");
			console.log("Scrolling up");
		}
		else
		{
			//console.log("Scrolling down");
			//alert("Scrolling down");
			console.log("Scrolling down");
		}
	}

	//This code works for firefox
	else if (event.type == 'DOMMouseScroll')
	{
		if(event.originalEvent.detail > 0)
		{
			//console.log("Scrolling down");
			//alert("Scrolling down");
			console.log("Scrolling down");
		}
		else
		{
			//console.log("Scrolling up");
			//alert("Scrolling up");
			console.log("Scrolling up");
		}
	}
});


