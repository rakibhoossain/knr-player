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
		wp_register_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/knr-player-admin.js', array( 'jquery','jquery-ui-tabs' ), $this->version, false );

		wp_localize_script( $this->plugin_name, 'knr_player', array(
		    'ajax_url' =>  admin_url( 'admin-ajax.php' ),
		    'nonce' => wp_create_nonce( "knr_save_data" )
		));      
   		wp_enqueue_script( $this->plugin_name );
	}
	
	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function add_action_links($links) {
		$settings_link = array(
			'<a href="' . admin_url( 'admin.php?page=knr_player_settings') . '">' . __('Settings','knr-player') . '</a>',
		);
		return array_merge($settings_link, $links);
	}


	/**
	 * Add plugin pages.
	 *
	 * @since    1.0.0
	 */
	function knr_player_options_pages() {
		add_menu_page(__('KNR Player','knr-player'), __('KNR Player','knr-player'), 'manage_options', 'knr_player', [$this,'knrAudioAdd'],'dashicons-awards' );
		add_submenu_page('knr_player', __('Playlist','knr-player'), __('Playlist','knr-player'), 'manage_options', 'knr_player_playlists', [$this,'knr_player_playlists']);
		add_submenu_page('knr_player', __('Settings','knr-player'), __('Settings','knr-player'), 'manage_options', 'knr_player_settings', [$this,'knr_player_settings']);
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
* Render add page
* @return void
*/
function knr_player_settings() {

 
 // add error/update messages
 
 // check if the user have submitted the settings
 // wordpress will add the "settings-updated" $_GET parameter to the url
 if ( isset( $_GET['settings-updated'] ) ) {
 // add settings saved message with the class of "updated"
 add_settings_error( 'knr_player_messages', 'knr_player_message', __( 'Settings Saved', 'knr-player' ), 'updated' );
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




public function knr_player_ajax_form() {
	if ( !wp_verify_nonce( $_REQUEST['_ajax_nonce'], "knr_save_data")) {
			print 'Sorry, your nonce did not verify.';
	  	exit("Woof Woof Woof");
	}  

	global $wpdb, $user_ID;
	$table_name = $wpdb->prefix . "knr_player";


	if(isset($_POST["audio_data"])) {
		$data = $_POST["audio_data"];
		$time = current_time('mysql');
		$authorid = $user_ID;

		$audios = $data[data];
		$name = $data[name];
		$skin = $data[skin];

		$options = [
			'playlist' => false,
			'skin'=> $skin,
			'audio' => [] 
		];

		if ($data[id]) {

			$audioID = $data[id];

			$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$audioID'");

			foreach ($result as $res) {
				$audio_crnt_data = json_decode($res->data);
				$options[audio] = (array)$audio_crnt_data->audio;
			}


			foreach ($audios as $i=>$audio) {
				$option = [
					'src' => $audio[src],
					'is_live' => $audio[is_live],
					'image' => $audio[image],
					'title' => $audio[title],
					'author' => $audio[author],
					'info' => $audio[info],
					'volume' => $audio[volume] 
				];

				$options[audio][$i] = $option;
			}

			$audio_data = json_encode($options);

			$ret = $wpdb->update( 
				$table_name, 
				array( 
					'name'		=>	$name,
					'data'		=>	$audio_data,
					'time'		=>	$time,
					'authorid'	=>	$authorid
				), 
				array( 'id' => $audioID ), 
				array( 
					'%s',
					'%s',
					'%s',
					'%d'
				), 
				array( '%d' ) 
			);


		}else{

			foreach ($audios as $i=>$audio) {
				$option = [
					'src' => $audio[src],
					'is_live' => $audio[is_live],
					'image' => $audio[image],
					'title' => $audio[title],
					'author' => $audio[author],
					'info' => $audio[info],
					'volume' => $audio[volume] 
				];

				$options[audio][$i] = $option;
			}

			$audio_data = json_encode($options);

			$ret = $wpdb->insert( 
				$table_name,
				array( 
					'name'		=>	$name,
					'data'		=>	$audio_data,
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

	}

// delete audio
	if(isset($_POST["delete_audio"])) {

		$data = $_POST["delete_audio"];
		$post_id = $data["pid"];
		$audio_id = $data["id"];

		$options = [
			'playlist' => false,
			'skin'=> $skin,
			'audio' => [] 
		];

		$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$post_id'");

		foreach ($result as $res) {
			$audio_crnt_data = json_decode($res->data);
			$options[audio] = (array)$audio_crnt_data->audio;
			$options[skin] = $audio_crnt_data->skin;
			$options[playlist] = $audio_crnt_data->playlist;

			unset($options[audio][$audio_id]);
		}

		$audio_data = json_encode($options);

		$ret = $wpdb->update( 
			$table_name, 
			array( 
				'data'		=>	$audio_data
			), 
			array( 'id' => $post_id ), 
			array( 
				'%s'
			), 
			array( '%d' ) 
		);
	}


	if (isset($_POST["find_audio"])) {
		$find_item = $_POST["find_audio"];

		$src = $is_live = $image = $title = $author = $info = $audio_id = null;

		if ($find_item["option"] == 'find') {

			$post_id = $find_item["pid"];
			$audio_id = $find_item["id"];

			$audio_data = [];
			$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$post_id'");

			foreach ($result as $res) {
				$audio_crnt_data = json_decode($res->data);
				$audio_data = (array)$audio_crnt_data->audio;
				$music_info = $audio_data[$audio_id];

				$src = $music_info->src;
				$is_live = $music_info->is_live;
				$image = $music_info->image;
				$title = $music_info->title;
				$author = $music_info->author;
				$info = $music_info->info;
			}

		};

		?>
	  	<table class="form-table">
	  		<tbody>
	  			<tr>
	  				<th><label for="knr_player_mp3"><?php _e('Mp3 URL', 'knr-player');?></label></th>
	  				<td>
	  					<input name="knr_player_mp3" type="text" id="knr_player_mp3" data="<?php echo $audio_id;?>" value="<?php echo $src;?>" class="regular-text">
	  					<p>
	  						<label><input name="knr_player_is_live" type="checkbox" id="knr_player_is_live" <?php echo ($is_live == 'true')? 'checked':''; ?>><?php _e('This is a live streaming', 'knr-player');?></label>
	  					</p>
	  				</td>
	  			</tr>
	  			<tr>
	  				<th><label for="knr_player_image"><?php _e('Image URL', 'knr-player');?></label></th>
	  				<td>
	  					<input name="knr_player_image" type="text" id="knr_player_image" value="<?php echo $image;?>" class="regular-text">
	  				</td>
	  			</tr>
	  			<tr>
	  				<th><label for="knr_player_title"><?php _e('Title', 'knr-player');?></label></th>
	  				<td>
	  					<input name="knr_player_title" type="text" id="knr_player_title" value="<?php echo $title;?>" class="large-text">
	  				</td>
	  			</tr>

	  			<tr>
	  				<th><label for="knr_player_author"><?php _e('Author', 'knr-player');?></label></th>
	  				<td>
	  					<input name="knr_player_author" type="text" id="knr_player_author" value="<?php echo $author;?>" class="large-text">
	  				</td>
	  			</tr>


	  			<tr>
	  				<th><label for="knr_player_info"><?php _e('Information', 'knr-player');?></label></th>
	  				<td>
	  					<textarea name="knr_player_info" id="knr_player_info" class="large-text" rows="2"><?php echo $info;?></textarea>
	  				</td>
	  			</tr>
	  			<tr>
	  				<th><label for="knr_player_default_volume"><?php _e('Default volume', 'knr-player');?></label></th>
	  				<td>
	  					<input name="knr_player_default_volume" type="range" id="knr_player_default_volume" min="0" max="100" value="<?php echo $volume;?>" class="large-text">
	  				</td>
	  			</tr>
	  		</tbody>
	  	</table>
		<?php
	}

	exit();
}




	/**
	 * Audio manage page.
	 *
	 * @since    1.0.0
	 */
	function knrAudioAdd() {
		global $wpdb, $user_ID;
		$table_name = $wpdb->prefix . "knr_player";

		$update = false;
		$knr_player_name = $audio_crnt_data = $upt_id = $knr_player_skin = null;

		if(isset($_GET["knr_upt"])) {
			$upt_id = sanitize_text_field($_GET["knr_upt"]);
			$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$upt_id'");

			foreach($result as $print) {
				$audio_crnt_data = json_decode($print->data);
				$knr_player_name = $print->name;
				$knr_player_skin = $audio_crnt_data->skin;
				$update = true;
			}
		}

		if(isset($_GET["knr_del"])) {
			$del_id = sanitize_text_field($_GET["knr_del"]);
			$wpdb->query("DELETE FROM $table_name WHERE id='$del_id'");
			echo "<script>location.replace('admin.php?page=knr_player');</script>";
		}

		if(isset($_POST["knr_player_cancel"])) {
			echo "<script>location.replace('admin.php?page=knr_player');</script>";
		}

		?>

		<!-- Frontend -->
		<div class="wrap">
			<h2><?php _e('Add audio', 'knr-player');?></h2>
			<form action="" method="post" id="knr_audio_form">
				<div class="knr_player-box">
					<h2><?php _e('General settings', 'knr-player');?></h2>
					<label for="knr_player_name"><?php _e('Title', 'knr-player');?></label>
					<input name="knr_player_name" type="text" value="<?php echo $knr_player_name; ?>" id="knr_player_name" placeholder="Player title" class="widefat">		
				</div>
				<div id="knr_player-tabs">
				  <ul id="knr_player-nav">
				    <li><a href="#knr_player-add-audio"><?php echo ($update)? __('Audio', 'knr-player') : __('Add audio', 'knr-player'); ?></a></li>
				    <li class="mr-30"><a href="#knr_player-add-skin"><?php _e('Skin', 'knr-player');?></a></li>
					<?php
					if ($update) {
						echo '<li><input name="knr_player_update" type="button" class="knr_button knr_primary knr_player_save" upid="'.$upt_id.'" option="update" value="'.__('Update', 'knr-player').'"></li>';
						echo '<li><button name="knr_player_cancel" type="submit" class="knr_button knr_info">'.__('Cancel', 'knr-player').'</button></li>';
					}else{
						echo '<li><input name="knr_player_save" type="button" class="knr_button knr_primary knr_player_save" option="save" value="'.__('Save', 'knr-player').'"></li>';
					}
					?>
				  </ul>
				  <div id="knr_player-add-audio">
				  	<!-- Trigger/Open The Modal -->
					<input type="button" id="knr_open_modal" value="<?php _e('Add Mp3', 'knr-player');?>">
					<ul id="knr_list_mp3">
						<?php
							if ($update) {
								$audio_crnt = $audio_crnt_data->audio;
								foreach ($audio_crnt as $i=> $audio) {
									echo '<li val="'.$i.'"><input type="button" pid="'.$upt_id.'" auid="'.$i.'" value="'.$audio->title.'" class="knr_open_modal_update"></li>';
								}
							}
						?>
					</ul>
				  </div>

				  <div id="knr_player-add-skin">
					<label>
					  <input type="radio" name="knr_player_skin" id="knr_player_skin_1" value="1" <?php echo ($knr_player_skin == '1')? 'checked' : '';?> class="knr_checkbox">
					  <img src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/skin-1.jpg'); ?>">
					</label>

					<label>
					  <input type="radio" name="knr_player_skin" id="knr_player_skin_2" value="2" <?php echo ($knr_player_skin == '2')? 'checked' : '';?> class="knr_checkbox">
					  <img src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/skin-2.jpg'); ?>">
					</label>

					<label>
					  <input type="radio" name="knr_player_skin" id="knr_player_skin_3" value="3" <?php echo ($knr_player_skin == '3')? 'checked' : '';?> class="knr_checkbox">
					  <img src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/skin-3.jpg'); ?>">
					</label>
				  </div>

				</div>
			</form>

			<!-- The Modal -->
			<div id="knr_player_Modal" class="modal">
			  <div class="modal-content">
			    <span class="close">&times;</span>
				<div id="knr_modal_table"> </div>
				<input type="button" name="save" value="Save" id="save" class="knr_button knr_primary">
				<input type="button" name="update" value="Update" id="update" class="knr_button knr_primary" style="display: none;">
				<input type="button" name="delete" value="Delete" id="delete_btn" class="knr_button knr_info" style="display: none;">
			  </div>
			</div>

			<!-- Show all audio -->
			<table class="wp-list-table widefat striped">
				<thead>
					<tr>
						<th width="25%"><?php _e('Shortcode', 'knr-player');?></th>
						<th width="25%"><?php _e('Name', 'knr-player');?></th>
						<th width="25%"><?php _e('Actions', 'knr-player');?></th>
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
									<td width='25%'>
										<a href='admin.php?page=knr_player&knr_upt=$print->id'>
											<button type='button' class='knr_button knr_primary'>".__('UPDATE', 'knr-player')."</button>
										</a>
										<a href='admin.php?page=knr_player&knr_del=$print->id'>
											<button type='button' class='knr_button knr_info'>".__('DELETE', 'knr-player')."</button>
										</a>
									</td>
								</tr>
							";
						}
					?>
				</tbody>	
			</table><br><br>

		</div>
		<?php
	}


	/**
	 * Audio manage page.
	 *
	 * @since    1.0.0
	 */
	public function knr_player_playlists(){
		global $wpdb, $user_ID;
		$table_name = $wpdb->prefix . "knr_player";
		$results = $wpdb->get_results("SELECT * FROM $table_name");

		if ($results):
		?>

      <div class="knr_palyer_pl_play">
         <div class="audio-image"></div>
         <div class="audio-player">
            <div class="audio-info text-center">
               <span class="artist text-bold"></span> - 
               <span class="title"></span>
            </div>
            <input class="volume" type="range" min="0" max="10" value="5">
            <div class="knr_control">
               <div class="buttons">
                  <img class="prev" src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/player/prev.png'); ?>">
                  <img class="play" src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/player/play.png'); ?>">
                  <img class="pause" src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/player/pause.png'); ?>">
                  <img class="stop" src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/player/stop.png'); ?>">
                  <img class="next" src="<?php  echo esc_url(plugin_dir_url( __FILE__ ).'images/player/next.png'); ?>">
               </div>
            </div>
            <div class="tracker">
               <div class="progress-bar stripes">
                  <span class="progress-bar-inner progress"></span>
               </div>
               <span class="duration">0:00</span>
            </div>
            <ul class="playlist">
			<?php
				foreach ($results as $result) {
					$data = json_decode($result->data);
					echo'<li song="'.$data->src.'" cover="'.$data->image.'" artist="">'.$data->title.'</li>';
				}
			?>
            </ul>
         </div>
      </div>
	<?php
	endif;
	}



}