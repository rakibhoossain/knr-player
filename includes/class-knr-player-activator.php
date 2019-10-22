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

function crudOperationsTable() {
	global $wpdb;
	$charset_collate = $wpdb->get_charset_collate();
	$table_name = $wpdb->prefix . "userstabletest";
	$sql = "CREATE TABLE `$table_name` (
	`user_id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(220) DEFAULT NULL,
	`email` varchar(220) DEFAULT NULL,
	PRIMARY KEY(user_id)
	) ENGINE=MyISAM DEFAULT CHARSET=latin1;
	";
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
		self::crudOperationsTable();
	}

}
