var

	// Map over dmui in case of overwrite
	_dmui = window.dmui;

dmui.noConflict = function( deep ) {
	if ( deep && window.dmui === dmui ) {
		window.dmui = _dmui;
	}

	return dmui;
};

// Expose dmui and $ identifiers, even in AMD
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.dmui = dmui;
}
