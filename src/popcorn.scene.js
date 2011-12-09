(function( window, Popcorn ) {

	var floor = Math.floor,
			abs = Math.abs,
			detected = 0,
			requestAnimFrame;

	requestAnimFrame = (function( window ) {
		var suffix = "equestAnimationFrame",
			rAF = [ "r", "webkitR", "mozR", "msR", "oR" ].filter(function( val ) {
				return val + suffix in window;
			})[ 0 ] + suffix;

		return window[ rAF ] || function( callback, element ) {
			window.setTimeout(function() {
				callback( +new Date() );
			}, 1000 / 60);
		};
	})( window );

	// Values from an object, returns an array
	function values( obj ) {
		var ret = [],
				prop;

		for ( prop in obj ) {
			ret.push( obj[ prop ] );
		}

		return ret;
	}

	// From http://github.com/rwldrn/chromakey.git
	function createCanvas( node, id ) {

		var canvas = document.createElement("canvas");

		canvas.id = id;
		canvas.width = node.width;
		canvas.height = node.height;

		node.parentNode.appendChild( canvas );

		return canvas;
	}

	// Scene constructor
	// 1-to-1 with a Popcorn instance.
	function Scene( instance ) {
		// Store reference to this instance
		this.instance = instance;

		this.dims = {
			width: instance.media.width,
			height: instance.media.height
		};

		// Track frames for this instance
		this.frame = 0;

		// Create a context reference
		this.context = createCanvas( instance.media, +new Date() ).getContext("2d");

		// Sum of RGB in last frame
		this.last = 0;
	}

	Scene.prototype.throttle = function() {
		// If media is not playing, end process throttle loop
		if ( !this.instance.media.paused && !this.instance.media.ended ) {
			// Process frame
			this.process();
		}

		var self = this;

		// Continue process throttle loop
		requestAnimFrame(function() {
			self.throttle();
		});
	};


	Scene.prototype.process = function() {

		var average, total, frame, length,
				pixel, gray, current, diff, k;

		average = {
			r: 0,
			g: 0,
			b: 0
		};

		total = {
			r: 0,
			g: 0,
			b: 0
		};


		this.context.drawImage( this.instance.media, 0, 0, this.dims.width, this.dims.height );

		frame = this.context.getImageData( 0, 0, this.dims.width, this.dims.height );

		length = frame.data.length / 4;

		for ( k = 0; k < length; k++ ) {
			pixel = k * 4;

			total.r += frame.data[ pixel + 0 ];
			total.g += frame.data[ pixel + 1 ];
			total.b += frame.data[ pixel + 2 ];
		}

		average.r = floor( total.r / length );
		average.g = floor( total.g / length );
		average.b = floor( total.b / length );

		current = values(average).reduce(function(p, v) { return p + v; });
		diff = this.last - current;

		// If the absolute difference of the last frame's RGB and
		// the current frame's RGB is greater then 10 (completely arbitrary)
		// fire a "scene" change event
		this.instance.trigger("scene", { type: "scene" });

		// Update last RGB sum value
		this.last = current;


		// visual representation, inspired by Mark Boas
		document.body.style.backgroundColor = "rgb(" + values(average).join() + ")";

		this.frame++;

		return;
	};


	// Expose constructor
	Popcorn.Scene = function( instance ) {
		return new Scene( instance );
	};

	// Instance detection loop
	requestAnimFrame(function detect() {

		if ( detected < Popcorn.instances.length ) {
			Popcorn.instances.forEach(function( instance ) {
				var scene;

				if ( !instance.options.scenes ) {
					scene = new Scene( instance );

					scene.throttle();

					instance.options.scenes = true;
				}
			});

			detected = Popcorn.instances.length;
		}

		requestAnimFrame(function() {
			detect();
		});
	});
})( this, this.Popcorn );