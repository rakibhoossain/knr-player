<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://github.com/rakibhoossain/
 * @since             1.0.0
 * @package           Knr_Player
 *
 * @wordpress-plugin
 * Plugin Name:       KNR Player
 * Plugin URI:        https://github.com/rakibhoossain/knr-player
 * Description:       Create awesome audio player that is compatible with all major browsers and devices (Android, iPhone, iPad).
 * Version:           1.0.1
 * Author:            Rakib Hossain
 * Author URI:        https://github.com/rakibhoossain/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       knr-player
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'KNR_PLAYER_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-knr-player-activator.php
 */
function activate_knr_player() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-knr-player-activator.php';
	Knr_Player_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-knr-player-deactivator.php
 */
function deactivate_knr_player() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-knr-player-deactivator.php';
	Knr_Player_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_knr_player' );
register_deactivation_hook( __FILE__, 'deactivate_knr_player' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-knr-player.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_knr_player() {

	$plugin = new Knr_Player();
	$plugin->run();

}
run_knr_player();
