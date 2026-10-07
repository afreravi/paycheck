<?php
/**
 * Texas paycheck calculator: load the engine and add structured data.
 *
 * Same two jobs as the national snippet, but guarded to the Texas Page.
 * Paste from the "/**" line below, NOT the "<?php" line (Code Snippets plugin
 * adds the opening tag itself). Deleting block 1 keeps the page making no
 * structured-data claim; deleting block 2 keeps the calculator unloaded.
 */

/**
 * 1. Load the engine on the Texas Page only.
 */
add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_page( 'texas' ) ) {
        return;
    }

    // Same handle as the national snippet, so WordPress prints it once if both
    // are active. Bump the version after re-uploading the engine.
    wp_enqueue_script_module(
        'paycheck-engine',
        content_url( '/uploads/tools/paycheck-engine.js' ),
        array(),
        '1.0.0'
    );
} );

/**
 * 2. Add WebApplication structured data for the Texas Page.
 *
 * Rank Math free emits the FAQPage from the visible FAQ block; we only add the
 * one type it cannot, and only on this Page.
 */
add_action( 'wp_head', function () {
    if ( ! is_page( 'texas' ) ) {
        return;
    }

    $webapp = array(
        '@context'             => 'https://schema.org',
        '@type'                => 'WebApplication',
        'name'                 => 'Texas Paycheck Calculator',
        'url'                  => 'https://afreetools.com/finance/paycheck-calculator/texas',
        'applicationCategory'  => 'FinanceApplication',
        'operatingSystem'      => 'All',
        'browserRequirements'  => 'Requires JavaScript',
        'offers'               => array(
            '@type'         => 'Offer',
            'price'         => '0',
            'priceCurrency' => 'USD',
        ),
        'description'          => 'Free Texas paycheck calculator. Texas has no state income tax, so estimate take-home pay after federal income tax, Social Security, and Medicare. 2026.',
    );

    printf(
        '<script type="application/ld+json">%s</script>' . "\n",
        wp_json_encode( $webapp, JSON_UNESCAPED_SLASHES )
    );
} );
