<?php
/**
 * Paycheck calculator: load the engine and add structured data.
 *
 * Two independent jobs in one file. Delete whichever block you don't need.
 *
 * Where to put this, pick ONE:
 *   a) A child theme's functions.php          (survives parent theme updates)
 *   b) A small site-specific plugin in wp-content/plugins/
 *   c) Code Snippets plugin (Code Snippets -> Add New)
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
 * 2. Add WebApplication and FAQPage structured data.
 *
 * Use this instead of Rank Math's Custom Schema field, which is a PRO feature.
 * Rank Math free emits BreadcrumbList and Article on its own, so we only add
 * the two types it cannot.
 *
 * The FAQ questions below must stay word-for-word identical to the visible FAQ
 * at the bottom of the page. Google requires the markup to match on-page text,
 * and will ignore the FAQ rich result if it does not.
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

    $faq = array(
        '@context'   => 'https://schema.org',
        '@type'      => 'FAQPage',
        'mainEntity' => array(
            array(
                '@type'          => 'Question',
                'name'           => 'How accurate is this paycheck calculator?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text'  => "It produces an estimate for planning. It covers federal income tax, Social Security, Medicare, and state income tax, but not local or paid-leave taxes. Your employer's payroll system may withhold a different amount.",
                ),
            ),
            array(
                '@type'          => 'Question',
                'name'           => 'Why is my actual paycheck different from this estimate?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text'  => 'It depends on local or municipal income taxes, state disability or paid-leave programs, benefit deductions, and the withholding method your employer uses.',
                ),
            ),
            array(
                '@type'          => 'Question',
                'name'           => 'Does this calculator work for all 50 states?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text'  => 'Yes. It covers all 50 states and Washington, DC for tax years 2025 and 2026. Nine states have no state income tax on wages, so only federal tax and FICA apply there.',
                ),
            ),
            array(
                '@type'          => 'Question',
                'name'           => 'What is the difference between gross pay and net pay?',
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text'  => 'Gross pay is your total earnings before any deductions. Net pay, also called take-home pay, is what remains after income tax, FICA, and any benefit deductions are subtracted.',
                ),
            ),
        ),
    );

    printf(
        "<script type="application/ld+json">%s</script>
<script type="application/ld+json">%s</script>
",
        wp_json_encode( $webapp, JSON_UNESCAPED_SLASHES ),
        wp_json_encode( $faq, JSON_UNESCAPED_SLASHES )
    );
} );
