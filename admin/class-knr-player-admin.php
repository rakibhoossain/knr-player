<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/rakibhoossain/
 * @since      1.0.0
 *
 * @package    Knr_Player
 * @subpackage Knr_Player/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Knr_Player
 * @subpackage Knr_Player/admin
 * @author     Rakib Hossain <serakib@gmail.com>
 */
class Knr_Player_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Knr_Player_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Knr_Player_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/knr-player-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Knr_Player_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Knr_Player_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/knr-player-admin.js', array( 'jquery' ), $this->version, false );

	}


/**
 * custom option and settings
 */
function knr_player_settings_init() {
 // register a new setting for "knr_player" page
 register_setting( 'knr_player', 'knr_player_options' );


 //register a new section in the "knr_player" page
 add_settings_section(
 'knr_player_section_developers',
 __( 'Player section test', 'knr_player' ),
 [$this,'knr_player_section_developers_cb'],
 'knr_player'
 );





 // register a new field in the "knr_player_section_developers" section, inside the "knr_player" page
 add_settings_field(
 'knr_player_field_pill', // as of WP 4.6 this value is used only internally
 // use $args' label_for to populate the id inside the callback
 __( 'Pill', 'knr_player' ),
 [$this,'knr_player_field_pill_cb'],
 'knr_player',
 'knr_player_section_developers',
 [
 'label_for' => 'knr_player_field_pill',
 'class' => 'knr_player_row',
 'knr_player_custom_data' => 'custom',
 ]
 );





 // register a new field in the "knr_player_section_developers" section, inside the "knr_player" page
 add_settings_field(
 'knr_player_textarea', // as of WP 4.6 this value is used only internally
 // use $args' label_for to populate the id inside the callback
 __( 'Description', 'knr_player' ),
 [$this,'knr_player_textarea_cb'],
 'knr_player',
 'knr_player_section_developers',
 [
 'label_for' => 'knr_player_textarea',
 'class' => 'knr_player_row',
 'knr_player_custom_data' => 'custom',
 ]
 );









}

/**
 * custom option and settings:
 * callback functions
 */
 
// developers section cb
 
// section callbacks can accept an $args parameter, which is an array.
// $args have the following keys defined: title, id, callback.
// the values are defined at the add_settings_section() function.
function knr_player_section_developers_cb( $args ) {
 ?>
 <p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Follow check......', 'knr_player' ); ?></p>
 <?php
}











// pill field cb
 
// field callbacks can accept an $args parameter, which is an array.
// $args is defined at the add_settings_field() function.
// wordpress has magic interaction with the following keys: label_for, class.
// the "label_for" key value is used for the "for" attribute of the <label>.
// the "class" key value is used for the "class" attribute of the <tr> containing the field.
// you can add custom key value pairs to be used inside your callbacks.
function knr_player_field_pill_cb( $args ) {
 // get the value of the setting we've registered with register_setting()
 $options = get_option( 'knr_player_options' );
 // output the field
 ?>
 <select id="<?php echo esc_attr( $args['label_for'] ); ?>"
 data-custom="<?php echo esc_attr( $args['knr_player_custom_data'] ); ?>"
 name="knr_player_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
 >
 <option value="red" <?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], 'red', false ) ) : ( '' ); ?>>
 <?php esc_html_e( 'red pill', 'knr_player' ); ?>
 </option>
 <option value="blue" <?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], 'blue', false ) ) : ( '' ); ?>>
 <?php esc_html_e( 'blue pill', 'knr_player' ); ?>
 </option>
 </select>
 <p class="description">
 <?php esc_html_e( 'You take the blue pill and the story ends. You wake in your bed and you believe whatever you want to believe.', 'knr_player' ); ?>
 </p>
 <p class="description">
 <?php esc_html_e( 'You take the red pill and you stay in Wonderland and I show you how deep the rabbit-hole goes.', 'knr_player' ); ?>
 </p>
 <?php
}


// you can add custom key value pairs to be used inside your callbacks.
function knr_player_textarea_cb( $args ) {
 // get the value of the setting we've registered with register_setting()
 $options = get_option( 'knr_player_options' );
 // output the field
 ?>
 <textarea id="<?php echo esc_attr( $args['label_for'] ); ?>" data-custom="<?php echo esc_attr( $args['knr_player_custom_data'] ); ?>" name="knr_player_options[<?php echo esc_attr( $args['label_for'] ); ?>]"> <?php echo $options[ $args['label_for'] ]; ?></textarea>


 <?php
}



/**
 * knr_plugin pages
 */
function knr_player_options_pages() {
// add top level menu page
add_menu_page('KNR Player', 'KNR Player', 'manage_options', 'knr_player', [$this,'knr_player_main_page_cb'],'dashicons-awards' );

// Add a submenu to the custom top-level menu:
add_submenu_page('knr_player', __('Add audio','knr_player'), __('Add audio','knr_player'), 'manage_options', 'knr_player_add_page', [$this,'knr_player_add_page_cb']);

add_submenu_page('knr_player', __('CRUD','knr_player'), __('CRUD','knr_player'), 'manage_options', 'knr_player_crud', [$this,'crudAdminPage']);

}


// knr_player_main_page_cb() displays the page content for the Toplevel menu
function knr_player_main_page_cb() {
	?>
	<div class="wrap">
    	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	</div>
	<h2>Welcome</h2>
    <?php
}











 
/**
* Render add page
* @return void
*/
function knr_player_add_page_cb() {

 
 // add error/update messages
 
 // check if the user have submitted the settings
 // wordpress will add the "settings-updated" $_GET parameter to the url
 if ( isset( $_GET['settings-updated'] ) ) {
 // add settings saved message with the class of "updated"
 add_settings_error( 'knr_player_messages', 'knr_player_message', __( 'Settings Saved', 'knr_player' ), 'updated' );
 }
 
 // show error/update messages
 settings_errors( 'knr_player_messages' );
 ?>
 <div class="wrap">
 <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
 <form action="options.php" method="post">
 <?php
 // output security fields for the registered setting "knr_player"
 settings_fields( 'knr_player' );
 // output setting sections and their fields
 // (sections are registered for "knr_player", each field is registered to a specific section)
 do_settings_sections( 'knr_player' );
 // output save settings button
 submit_button( 'Save Settings' );
 ?>
 </form>
 </div>
 <?php
}









function crudAdminPage() {
	global $wpdb, $user_ID;

	$table_name = $wpdb->prefix . "knr_player";
	if(isset($_POST["newsubmit"])) {
		$name = $_POST["newname"];

	$time = current_time('mysql');
	$authorid = $user_ID;
$data = '{empty:no}';
	$ret = $wpdb->insert( 
		$table_name,
		array( 
			'name'		=>	$name,
			'data'		=>	$data,
			'time'		=>	$time,
			'authorid'	=>	$authorid
		), 
		array( 
			'%s',
			'%s',
			'%s',
			'%d'

		) 
	);



var_dump($ret);





			// $ret = $wpdb->query( $wpdb->prepare(
			// 		"
			// 		INSERT INTO $table_name (, demail)
			// 		VALUES (%s, %s)
			// 		",
			// 		$name,
			// 		$email
			// ) );
		// $wpdb->query("INSERT INTO $table_name(name,email) VALUES('$name','$')");

			if ($ret) {
				var_dump("yes");
			}
		//echo "<script>location.replace('admin.php?page=knr_player_crud');</script>";
	}
	if(isset($_POST["uptsubmit"])) {
		$id = $_POST["uptid"];
		$name = $_POST["uptname"];
		$email = $_POST["uptemail"];
		$wpdb->query("UPDATE $table_name SET name='$name' WHERE id='$id'");
		echo "<script>location.replace('admin.php?page=knr_player_crud');</script>";
	}
	if(isset($_GET["del"])) {
		$del_id = $_GET["del"];
		$wpdb->query("DELETE FROM $table_name WHERE id='$del_id'");
		echo "<script>location.replace('admin.php?page=knr_player_crud');</script>";
	}
	?>
	<div class="wrap">
		<h2>CRUD Operations</h2>
		<table class="wp-list-table widefat striped">
			<thead>
				<tr>
					<th width="25%">Shortcode</th>
					<th width="25%">Name</th>
					<th width="25%">Actions</th>
				</tr>
			</thead>
			<tbody>
				<form action="" method="post">
					<tr>
						<td><input type="text" value="AUTO_GENERATED" disabled></td>
						<td><input type="text" id="newname" name="newname"></td>
						<td><button id="newsubmit" name="newsubmit" type="submit">INSERT</button></td>
					</tr>
				</form>
				<?php
					$result = $wpdb->get_results("SELECT * FROM $table_name");
					foreach ($result as $print) {
						echo "
							<tr>
								<td width='25%'><input type='text' value='[KNR_Player id=\"$print->id\"]' disabled></td>
								<td width='25%'>$print->name</td>
								<td width='25%'><a href='admin.php?page=knr_player_crud&upt=$print->id'><button type='button'>UPDATE</button></a> <a href='admin.php?page=knr_player_crud&del=$print->id'><button type='button'>DELETE</button></a></td>
							</tr>
						";
					}
				?>
			</tbody>	
		</table><br><br>
		<?php
			if(isset($_GET["upt"])) {
				$upt_id = $_GET["upt"];
				$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$upt_id'");
				foreach($result as $print) {
					$name = $print->name;
				}
				echo "
				<table class='wp-list-table widefat striped'>
					<thead>
						<tr>
							<th width='25%'>ID</th>
							<th width='25%'>Name</th>
							<th width='25%'>Actions</th>
						</tr>
					</thead>
					<tbody>
						<form action='' method='post'>
							<tr>
								<td width='25%'>$print->id <input type='hidden' id='uptid' name='uptid' value='$print->id'></td>
								<td width='25%'><input type='text' id='uptname' name='uptname' value='$print->name'></td>
								<td width='25%'><button id='uptsubmit' name='uptsubmit' type='submit'>UPDATE</button> <a href='admin.php?page=knr_player_crud'><button type='button'>CANCEL</button></a></td>
							</tr>
						</form>
					</tbody>
				</table>";
			}
		?>
	</div>
	<?php
}









}
