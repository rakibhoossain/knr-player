<?php

/**
 * Fired during plugin activation
 *
 * @link       https://github.com/rakibhoossain/
 * @since      1.0.0
 *
 * @package    Knr_Player
 * @subpackage Knr_Player/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Knr_Player
 * @subpackage Knr_Player/includes
 * @author     Rakib Hossain <serakib@gmail.com>
 */
class Knr_Player_Activator {

function knrPlayerTable() {
	global $wpdb;
	$table_name = $wpdb->prefix . "knr_player";
	
	$charset = '';
	if ( !empty($wpdb -> charset) )
		$charset = "DEFAULT CHARACTER SET $wpdb->charset";
	if ( !empty($wpdb -> collate) )
		$charset .= " COLLATE $wpdb->collate";

	$sql = "CREATE TABLE $table_name (
	id INT(11) NOT NULL AUTO_INCREMENT,
	name tinytext DEFAULT '' NOT NULL,
	data MEDIUMTEXT DEFAULT '' NOT NULL,
	time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
	authorid tinytext NOT NULL,
	PRIMARY KEY  (id)
	) $charset;";

	if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
		require_once(ABSPATH . "wp-admin/includes/upgrade.php");
		dbDelta($sql);
	}
}

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		self::knrPlayerTable();
	}

}
