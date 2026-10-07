<?php
/**
 * Executes the generated WordPress snippet against minimal stubs so the emitted
 * structured data can be inspected without a WordPress install.
 *
 * Usage: php wp-snippet-harness.php <snippet.php> [page-slug]
 * Prints a small report; the Node test parses it.
 */

$snippet = $argv[1];
$slug    = $argv[2] ?? 'paycheck-calculator';

$GLOBALS['head'] = '';
$GLOBALS['enqueued'] = [];

function add_action($hook, $fn) { $GLOBALS['actions'][$hook][] = $fn; }
function is_page($s) { return is_array($s) ? in_array($GLOBALS['slug'], $s, true) : $s === $GLOBALS['slug']; }
function content_url($p) { return 'https://afreetools.com/wp-content' . $p; }
function get_queried_object_id() { return 1; }
function get_post_field($field, $id) { return 'post_name' === $field ? $GLOBALS['slug'] : ''; }
function wp_enqueue_script_module(...$a) { $GLOBALS['enqueued'][] = $a; }
function wp_json_encode($d, $f = 0) { return json_encode($d, $f); }

$GLOBALS['slug'] = $slug;
require $snippet;

foreach ($GLOBALS['actions']['wp_head'] ?? [] as $fn) {
    ob_start();
    $fn();
    $GLOBALS['head'] .= ob_get_clean();
}
foreach ($GLOBALS['actions']['wp_enqueue_scripts'] ?? [] as $fn) {
    $fn();
}

$report = array(
    'enqueued'    => count($GLOBALS['enqueued']),
    'jsonldCount' => 0,
    'blocks'      => array(),
    'invalid'     => 0,
);

preg_match_all('#<script type="application/ld\+json">(.*?)</script>#s', $GLOBALS['head'], $m);
$report['jsonldCount'] = count($m[1]);
foreach ($m[1] as $json) {
    $d = json_decode($json, true);
    if ($d === null) {
        $report['invalid']++;
        continue;
    }
    $block = array('type' => $d['@type'] ?? null);
    if (($d['@type'] ?? null) === 'FAQPage') {
        $block['questions'] = array_map(
            function ($q) { return $q['name']; },
            $d['mainEntity'] ?? array()
        );
    }
    $report['blocks'][] = $block;
}

echo json_encode($report), "\n";
