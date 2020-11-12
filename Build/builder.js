// Simple webpage generator. 2020 Kona Arctic. Some rights reserved. NO WARRANTY!

export default class {
	constructor( element ) {
		this.element = element;
		this.hooks = { };
		this.errorthrow = false;
		this.errorhandle = function( error ) {
			return "ERROR: cant load: " + error ;
		}
	}

	// Registers handle to name
	async reg( name , hook ) {
		this.hooks[ name ] = hook;
		return;
	}

	// Actually builds entire page
	async run( element , hook ) {
		for ( let element of this.element.querySelectorAll( "[build]" ) ) {
			this.use( element , undefined )
		}
		return;
	}

	// Process a single hook on a single element
	async use( element , hook ) {
		if ( ! hook )
			hook = element.getAttribute( "build" );
		if ( ! hook )
			return;

		try {

			//
			// Get name, type, and hook
			hook = hook.split( ":" );
			var html = hook.shift( ).split( "-" );
			var type = html.shift( );
			var answer = "";
			html = html[ 0 ]
			hook = hook.join( ":" );
			//
			// Lets get the content of a hook

			// Is there a hook?
			if ( type == "hook" ) {
				if ( this.hooks[ hook ] )
					if ( typeof( this.hooks[ hook ] ) == "function" )
						answer = this.hooks[ hook ]( );
					else if ( typeof( this.hooks[ hook ] ) == "object" )
						answer = this.hooks[ hook ];	// Im just gonna assume this is a HTML element
					else {
						this.use( element , this.hooks[ hook ] )
						return;
					}
				else
					throw "hook \"" + hook + "\" is not defined.";

			// Is it a part?
			} else if ( type == "part" ) {
				if ( hook == "true" || this.hooks[ hook ] )
					element.hidden = false;
				else
					element.hidden = true;
				return;

			// Is it on the web?
			} else if ( type == "web" )
				answer = await ( await window.fetch( hook , { } ) ).text( );

			// Javascript?
			else if ( type == "script" )
				answer = eval( hook );

			else
				throw "I dont know what \"" + type + "\" is.";

			//
			// is it HTML or text?

			if ( ! html || html == "html" ) {
				if ( typeof( answer ) == "object" ) {
					element.innerHTML = "";
					element.append( answer );
				} else
					element.innerHTML = answer;
				let object = this;
				object.element = element;
				object.run( );

			} else if ( html == "text" )
				element.innerText = answer;

			else
				throw "I dont know what \"" + html + "\" is.";

		} catch( error ) {
			if ( this.errorthrow )
				throw error;
			else
				element.innerHTML = this.errorhandle( error );
		}
	}
}


