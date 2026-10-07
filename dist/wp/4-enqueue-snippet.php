<?php
/**
 * Paycheck calculator: load the engine and add structured data.
 *
 * Two independent jobs in one file. Delete whichever block you don't need.
 *
 * Where to put this, pick ONE:
 *   a) Code Snippets plugin -> Add New -> Run Everywhere
 *      IMPORTANT: paste from the "/**" line below, NOT the "<?php" line.
 *      The plugin adds the opening tag itself; a second one is an error.
 *   b) A small site-specific plugin in wp-content/plugins/
 *   c) A child theme's functions.php  (paste inside the file, no second <?php)
 *
 * Do NOT paste into the parent GeneratePress theme — a theme update erases it.
 */

/**
 * 1. Load the engine without pasting any <script> into the page body.
 *
 * Inline <script type="module"> is the riskiest part of a WordPress install,
 * because the editor can reformat it and break the JS. The engine auto-mounts
 * itself, so enqueueing it alone is enough. Nothing inline, nothing to mangle.
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

/**
 * 2. Add WebApplication structured data.
 *
 * Use this instead of Rank Math's Custom Schema field, which is a PRO feature.
 * Rank Math free already emits BreadcrumbList, Article, and the FAQPage for the
 * visible FAQ block, so we only add the one type it cannot: WebApplication.
 */
add_action( 'wp_head', function () {
    if ( ! is_page( 'paycheck-calculator' ) ) {
        return;
    }

    $url = 'https://afreetools.com/finance/paycheck-calculator';

    $webapp = array(
        '@context'             => 'https://schema.org',
        '@type'                => 'WebApplication',
        'name'                 => 'Paycheck Calculator',
        'url'                  => $url,
        'applicationCategory'  => 'FinanceApplication',
        'operatingSystem'      => 'All',
        'browserRequirements'  => 'Requires JavaScript',
        'offers'               => array(
            '@type'         => 'Offer',
            'price'         => '0',
            'priceCurrency' => 'USD',
        ),
        'description'          => 'Free US paycheck calculator. Estimate take-home pay after federal income tax, Social Security, Medicare, and state income tax.',
    );

    printf(
        '<script type="application/ld+json">%s</script>' . "\n",
        wp_json_encode( $webapp, JSON_UNESCAPED_SLASHES )
    );
} );
