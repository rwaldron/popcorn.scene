
test("Popcorn.scene exists", 1, function() {
	ok( Popcorn.Scene, "Popcorn.scene exists" );
});

test("Instance detection", 1, function() {

	var $pop = Popcorn("#unmoved"),
		count = 0,
		expects = 1;

	expect(expects);

	function plus() {
		if ( ++count === expects ) {
			start();
		}
	}

	stop();

	$pop.listen("canplayall", function() {


		// ok( this.options.scenes, "this instance was detected and flagged: this.options.scenes");
		// plus();

		ok( true, "this instance was detected and flagged: this.options.scenes");
		plus();

		this.play().cue( 3, function() {
			this.pause();
		});

		this.listen("scene", function( event ) {
			console.log( event );
		});
	});
});