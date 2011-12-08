# Popcorn.scene.js

### Provides listenable scene change events.

Inspired by Mark Boas' [Videofingerprint](http://happyworm.com/jPlayerLab/videofingerprint/v01/)

Based on [chromaKey](http://github.com/rwldrn/chromakey)

-------------------------
Contributions should follow these guidelines:
http://github.com/rwldrn/idiomatic.js


-------------------------
Usage:

```js

// include popcorn.scene.js in your html page

var video = Popcorn("#video");

video.listen("scene", function( event, data ) {

	console.log( event, data );

});

```