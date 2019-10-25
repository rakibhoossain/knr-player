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
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/knr-player-admin.js', array( 'jquery','jquery-ui-tabs' ), $this->version, false );



	}




function ttt_wpmdr_add_action_plugin( $actions, $plugin_file ) 
{
	static $plugin;

	if (!isset($plugin))
		$plugin = plugin_basename(__FILE__);
	if ($plugin == $plugin_file) {

			$settings = array('settings' => '<a href="options-general.php#redirecthere">' . __('Settings', 'General') . '</a>');
			$site_link = array('support' => '<a href="http://thetechterminus.com" target="_blank">Support</a>');
		
    			$actions = array_merge($settings, $actions);
				$actions = array_merge($site_link, $actions);
			
		}
		
		return $actions;
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
add_menu_page('KNR Player', 'KNR Player', 'manage_options', 'knr_player', [$this,'knrAudioAdd'],'dashicons-awards' );

// Add a submenu to the custom top-level menu:
add_submenu_page('knr_player', __('Settings','knr_player'), __('Settings','knr_player'), 'manage_options', 'knr_player_settings', [$this,'knr_player_settings']);

}
 
/**
* Render add page
* @return void
*/
function knr_player_settings() {

 
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









function knrAudioAdd() {
	global $wpdb, $user_ID;

	$table_name = $wpdb->prefix . "knr_player";

	$update = false;

	$knr_player_name = $knr_player_mp3 = $knr_player_is_live = $knr_player_image = $knr_player_title = $knr_player_info = $knr_h_id = $knr_player_skin= null;
	$knr_player_default_volume = 50;

	if(isset($_GET["knr_upt"])) {
		$upt_id = $_GET["knr_upt"];
		$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$upt_id'");
		foreach($result as $print) {
			$data = json_decode($print->data);
			$knr_player_name = $print->name;
			$knr_player_mp3 = $data->src;
			$knr_player_is_live = $data->is_live;
			$knr_player_image = $data->image;
			$knr_player_title = $data->title;
			$knr_player_info = $data->info;
			$knr_player_skin = $data->skin;
			$knr_player_default_volume = $data->volume;

			$knr_h_id = $upt_id;
			$update = true;
		}
	}


	if(isset($_POST["knr_player_save"])) {

		$time = current_time('mysql');
		$authorid = $user_ID;
		$name = $_POST["knr_player_name"];

		$url = isset($_POST["knr_player_mp3"])? $_POST["knr_player_mp3"] : '';
		$is_live = ($_POST["knr_player_is_live"])? true : false;
		$image = isset($_POST["knr_player_image"])? $_POST["knr_player_image"] : '';
		$title = isset($_POST["knr_player_title"])? $_POST["knr_player_title"] : '';
		$info = isset($_POST["knr_player_info"])? $_POST["knr_player_info"] : '';
		$skin = isset($_POST["knr_player_skin"])? $_POST["knr_player_skin"] : 1;
		$volume = isset($_POST["knr_player_default_volume"])? $_POST["knr_player_default_volume"] : $knr_player_default_volume;
		$option = [
			'src' => $url,
			'is_live' => $is_live,
			'image' => $image,
			'title' => $title,
			'info' => $info,
			'skin'=> $skin,
			'volume' => $volume 
		];
		$data = json_encode($option);

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
	}


	if(isset($_POST["knr_player_update"])) {

		$time = current_time('mysql');
		$authorid = $user_ID;
		$name = $_POST["knr_player_name"];
		$id = $_POST["knr_audio_id"]; 

		$url = $_POST["knr_player_mp3"];
		$is_live = ($_POST["knr_player_is_live"])? true : false;
		$image = $_POST["knr_player_image"];
		$title = $_POST["knr_player_title"];
		$info = $_POST["knr_player_info"];
		$skin = $_POST["knr_player_skin"];
		$volume = $_POST["knr_player_default_volume"];

		$option = [
			'src' => $url,
			'is_live' => $is_live,
			'image' => $image,
			'title' => $title,
			'info' => $info,
			'skin'=> $skin,
			'volume' => $volume 
		];
		$data = json_encode($option);

		$ret = $wpdb->update( 
			$table_name, 
			array( 
				'name'		=>	$name,
				'data'		=>	$data,
				'time'		=>	$time,
				'authorid'	=>	$authorid
			), 
			array( 'id' => $id ), 
			array( 
				'%s',
				'%s',
				'%s',
				'%d'
			), 
			array( '%d' ) 
		);
		echo "<script>location.replace('admin.php?page=knr_player');</script>";
	}
	if(isset($_GET["knr_del"])) {
		$del_id = $_GET["knr_del"];
		$wpdb->query("DELETE FROM $table_name WHERE id='$del_id'");
		echo "<script>location.replace('admin.php?page=knr_player');</script>";
	}
	if(isset($_POST["knr_player_cancel"])) {
		echo "<script>location.replace('admin.php?page=knr_player');</script>";
	}
	?>




	<!-- Frontend -->
	<div class="wrap">
		<h2>Add audio</h2>
		<form action="" method="post">
			<div class="knr_player-box">
				<h2>General settings</h2>
				<label for="knr_player_name">Title</label>
				<input name="knr_player_name" type="text" value="<?php echo $knr_player_name; ?>" placeholder="Player title" class="widefat">
				<input type='hidden' name='knr_audio_id' value='<?php echo $knr_h_id; ?>'>		
			</div>
			<div id="knr_player-tabs">
			  <ul id="knr_player-nav">
			    <li><a href="#knr_player-add-audio"><?php echo ($update)? 'Audio' : 'Add audio'; ?></a></li>
			    <li class="mr-30"><a href="#knr_player-add-skin">Skin</a></li>
				<?php
				if ($update) {
					echo '<li><button name="knr_player_update" type="submit" class="knr_button knr_primary">Update</button></li>';
					echo '<li><button name="knr_player_cancel" type="submit" class="knr_button knr_info">Cancel</button></li>';
				}else{
					echo '<li><button name="knr_player_save" type="submit" class="knr_button knr_primary">Save</button></li>';
				}
				?>
			  </ul>
			  <div id="knr_player-add-audio">
			  	<table class="form-table">
			  		<tbody>
			  			<tr>
			  				<th>Mp3 URL</th>
			  				<td>
			  					<input name="knr_player_mp3" type="text" id="knr_player_mp3" value="<?php echo $knr_player_mp3; ?>" class="regular-text">
			  					<p>
			  						<label><input name="knr_player_is_live" type="checkbox" id="knr_player_is_live" <?php echo ($knr_player_is_live)? 'checked':'';?>>This is a live streaming</label>
			  					</p>
			  				</td>
			  			</tr>
			  			<tr>
			  				<th>Image URL</th>
			  				<td>
			  					<input name="knr_player_image" type="text" id="knr_player_image" value="<?php echo $knr_player_image; ?>" class="regular-text">
			  				</td>
			  			</tr>
			  			<tr>
			  				<th>Title</th>
			  				<td>
			  					<input name="knr_player_title" type="text" id="knr_player_title" value="<?php echo $knr_player_title; ?>" class="large-text">
			  				</td>
			  			</tr>
			  			<tr>
			  				<th>Information</th>
			  				<td>
			  					<textarea name="knr_player_info" id="knr_player_info" class="large-text" rows="2"><?php echo $knr_player_info; ?></textarea>
			  				</td>
			  			</tr>
			  			<tr>
			  				<th>Default volume</th>
			  				<td>
			  					<input name="knr_player_default_volume" type="range" id="knr_player_default_volume" min="0" max="100" value="<?php echo $knr_player_default_volume; ?>" class="large-text">
			  				</td>
			  			</tr>
			  		</tbody>
			  	</table>
			  </div>

			  <div id="knr_player-add-skin">
				<label>
				  <input type="radio" name="knr_player_skin" value="1" <?php echo ($knr_player_skin == '1')? 'checked' : '';?> class="knr_checkbox">
				  <img src="<?php echo plugin_dir_url( __FILE__ ); ?>images/skin-1.jpg">
				</label>

				<label>
				  <input type="radio" name="knr_player_skin" value="2" <?php echo ($knr_player_skin == '2')? 'checked' : '';?> class="knr_checkbox">
				  <img src="<?php echo plugin_dir_url( __FILE__ ); ?>images/skin-2.jpg">
				</label>

			  </div>

			</div>
		</form>

		<!-- Show all audio -->
		<table class="wp-list-table widefat striped">
			<thead>
				<tr>
					<th width="25%">Shortcode</th>
					<th width="25%">Name</th>
					<th width="25%">Actions</th>
				</tr>
			</thead>
			<tbody>
				<?php
					$result = $wpdb->get_results("SELECT * FROM $table_name");
					foreach ($result as $print) {
						echo "
							<tr>
								<td width='25%'><input type='text' value='[KNR_Player id=\"$print->id\"]' disabled></td>
								<td width='25%'>$print->name</td>
								<td width='25%'><a href='admin.php?page=knr_player&knr_upt=$print->id'><button type='button' class='knr_button knr_primary'>UPDATE</button></a> <a href='admin.php?page=knr_player&knr_del=$print->id'><button type='button' class='knr_button knr_info'>DELETE</button></a></td>
							</tr>
						";
					}
				?>
			</tbody>	
		</table><br><br>

	</div>
	<?php
}

}
