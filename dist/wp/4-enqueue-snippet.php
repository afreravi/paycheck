<?php
/**
 * Optional: load the engine without pasting any <script> into the page body.
 *
 * Inline <script type="module"> is the riskiest part of a WordPress install,
 * because the editor can reformat it and break the JS. The engine auto-mounts
 * itself, so enqueueing it alone is enough. Nothing inline, nothing to mangle.
 *
 * Where to put this, pick ONE:
 *   a) A child theme's functions.php          (survives parent theme updates)
 *   b) A small site-specific plugin in wp-content/plugins/
 *   c) Code Snippets plugin (Code Snippets -> Add New)
 *
 * Do NOT paste into the parent GeneratePress theme — a theme update erases it.
 */

add_action( 'wp_enqueue_scripts', function () {
    // Loads on the calculator page only, so other pages stay unaffected.
    if ( ! is_page( 'paycheck-calculator' ) ) {
        return;
    }

    // Registers and prints as <script type="module" src="...">.
    wp_enqueue_script_module(
        'paycheck-engine',
        content_url( '/uploads/tools/paycheck-engine.js' ),
        array(),
        '1.0.0'   // bump this after re-uploading to bust browser cache
    );
} );
