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
		    'nonce' => wp_create_nonce( "knr_save_data" ),
		    'knr_player_url' => plugin_dir_url( __FILE__ )
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
			'<a href="https://github.com/rakibhoossain/knr-player" target="_blank">' . __('Document','knr-player') . '</a>',
		);
		return array_merge($settings_link, $links);
	}
	/**
	 * Add plugin pages.
	 *
	 * @since    1.0.0
	 */
	function knr_player_options_pages() {
		add_menu_page(__('KNR Player','knr-player'), __('KNR Player','knr-player'), 'manage_options', 'knr_player', [$this,'knrAudio'],'dashicons-admin-collapse' );
		add_submenu_page('knr_player', __('Add new audio','knr-player'), __('Add new audio','knr-player'), 'manage_options', 'knr_audio', [$this,'knrAudioAdd']);
	}

	public function knr_player_ajax_form() {
		if ( !wp_verify_nonce( $_REQUEST['_ajax_nonce'], "knr_save_data")) {
			_e('Sorry, your nonce did not verify.','knr-player');
		  	exit("Woof Woof Woof");
		}  

		global $wpdb, $user_ID;
		$table_name = $wpdb->prefix . "knr_player";


		if(isset($_POST["audio_data"])) {

 			if ( empty($_POST["audio_data"]) || !is_array($_POST["audio_data"]) ) return;
			$data = (array)$_POST["audio_data"];
			if( empty( $data[name] ) || !array_key_exists( 'name', $data ) ) return;
	
			$time = current_time('mysql');
			$authorid = $user_ID;

			$name = sanitize_text_field($data[name]);
			if(!preg_match('/\s*(?:[\w\.]\s*){5,100}$/', $name)) return;

			$skin = sanitize_text_field($data[skin]);
			$audios = (array)$data[data];

			$options = [
				'playlist' => false,
				'skin'=> $skin,
				'audio' => [] 
			];

			if ($data[id]) {

				$audioID = sanitize_text_field($data[id]);

				$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$audioID'");

				foreach ($result as $res) {
					$audio_crnt_data = json_decode($res->data);
					$options[audio] = (array)$audio_crnt_data->audio;
				}


				foreach ($audios as $i=>$audio) {
					$option = [
						'src' => esc_url($audio[src]),
						'autoplay' => sanitize_text_field($audio[autoplay]),
						'image' => esc_url($audio[image]),
						'title' => sanitize_text_field($audio[title]),
						'author' => sanitize_text_field($audio[author]),
						'info' => sanitize_text_field($audio[info]),
						'volume' => sanitize_text_field($audio[volume])
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

				echo sanitize_text_field($ret);


			}else{

				foreach ($audios as $i=>$audio) {
					$option = [
						'src' => esc_url($audio[src]),
						'autoplay' => sanitize_text_field($audio[autoplay]),
						'image' => esc_url($audio[image]),
						'title' => sanitize_text_field($audio[title]),
						'author' => sanitize_text_field($audio[author]),
						'info' => sanitize_text_field($audio[info]),
						'volume' => sanitize_text_field($audio[volume])
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
				echo sanitize_text_field($ret);	
			}
		exit();
		}

		// delete audio
		if(isset($_POST["delete_audio"])) {

 			if ( empty($_POST["delete_audio"]) || !is_array($_POST["delete_audio"]) ) return;
			$data = (array)$_POST["delete_audio"];
			if ( ! array_key_exists( 'pid', $data ) )  return;
			if ( ! array_key_exists( 'id', $data ) ) return;

			$post_id = sanitize_text_field($data["pid"]);
			$audio_id = sanitize_text_field($data["id"]);

			$options = [
				'playlist' => false,
				'skin'=> $skin,
				'audio' => [] 
			];

			$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$post_id'");

			foreach ($result as $res) {
				$audio_crnt_data = json_decode($res->data);
				$options[audio] = $audio_crnt_data->audio;
				$options[skin] = $audio_crnt_data->skin;
				$options[playlist] = $audio_crnt_data->playlist;
				unset( $options[audio]->$audio_id );
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

		// update audio
		if(isset($_POST["update_audio"])) {

 			if ( empty($_POST["update_audio"]) || !is_array($_POST["update_audio"]) ) return;
			$data = (array)$_POST["update_audio"];
			if ( ! array_key_exists( 'pid', $data ) )  return;
			if ( ! array_key_exists( 'id', $data ) ) return;

			$post_id = sanitize_text_field($data["pid"]);
			$audio_id = sanitize_text_field($data["id"]);

			$audio = $data[data];

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

				$options[audio][$audio_id] = $audio;
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
			$find_item = (array)$_POST["find_audio"];

			$src = $autoplay = $image = $title = $author = $info = $audio_id = $volume = null;

			if ($find_item["option"] == 'find') {

				$post_id = sanitize_text_field($find_item["pid"]);
				$audio_id = sanitize_text_field($find_item["id"]);

				$audio_data = [];
				$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$post_id'");

				foreach ($result as $res) {
					$audio_crnt_data = json_decode($res->data);

					$audio_data = $audio_crnt_data->audio;
					$music_info =  $audio_data->$audio_id;
					
					$src = esc_url($music_info->src);
					$autoplay = sanitize_text_field($music_info->autoplay);
					$image = esc_url($music_info->image);
					$title = sanitize_text_field($music_info->title);
					$author = sanitize_text_field($music_info->author);
					$info = sanitize_text_field($music_info->info);
					$volume = sanitize_text_field($music_info->volume);
				}

			};

			?>
		  	<table class="form-table">
		  		<tbody>
		  			<tr>
		  				<th><label for="knr_player_mp3"><?php _e('Mp3 URL', 'knr-player');?></label></th>
		  				<td>
		  					<input name="knr_player_mp3" type="text" id="knr_player_mp3" data="<?php echo esc_attr($audio_id);?>" value="<?php echo esc_url($src);?>" class="regular-text">
		  					<p>
		  						<label><input name="knr_player_autoplay" type="checkbox" id="knr_player_autoplay" <?php echo ($autoplay == 'true')? 'checked':''; ?>><?php _e('Autoplay', 'knr-player');?></label>
		  					</p>
		  				</td>
		  			</tr>
		  			<tr>
		  				<th><label for="knr_player_image"><?php _e('Image URL', 'knr-player');?></label></th>
		  				<td>
		  					<input name="knr_player_image" type="text" id="knr_player_image" value="<?php echo esc_url($image);?>" class="regular-text">
		  				</td>
		  			</tr>
		  			<tr>
		  				<th><label for="knr_player_title"><?php _e('Title', 'knr-player');?></label></th>
		  				<td>
		  					<input name="knr_player_title" type="text" id="knr_player_title" value="<?php echo esc_html($title);?>" class="large-text">
		  				</td>
		  			</tr>

		  			<tr>
		  				<th><label for="knr_player_author"><?php _e('Author', 'knr-player');?></label></th>
		  				<td>
		  					<input name="knr_player_author" type="text" id="knr_player_author" value="<?php echo esc_html($author);?>" class="large-text">
		  				</td>
		  			</tr>


		  			<tr>
		  				<th><label for="knr_player_info"><?php _e('Information', 'knr-player');?></label></th>
		  				<td>
		  					<textarea name="knr_player_info" id="knr_player_info" class="large-text" rows="2"><?php echo esc_textarea($info);?></textarea>
		  				</td>
		  			</tr>
		  			<tr>
		  				<th><label for="knr_player_default_volume"><?php _e('Default volume', 'knr-player');?></label></th>
		  				<td>
		  					<input name="knr_player_default_volume" type="range" id="knr_player_default_volume" min="0" max="100" value="<?php echo esc_attr($volume);?>" class="large-text knr-range-slide">
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

		if(isset($_POST["knr_player_cancel"])) {
			echo "<script>location.replace('admin.php?page=knr_player');</script>";
		}

		?>

		<!-- Frontend -->
		<div class="wrap">
			<h1 class="wp-heading-inline"><?php _e('Add new audio', 'knr-player');?></h1>
			<hr class="wp-header-end">
			<form action="" method="post" id="knr_audio_form">
				<div class="knr_player-box">
					<label for="knr_player_name"><h2><?php _e('Title', 'knr-player');?></h2></label>
					<input name="knr_player_name" type="text" value="<?php echo esc_html($knr_player_name); ?>" id="knr_player_name" placeholder="Player title" class="widefat">		
				</div>
				<div id="knr_player-tabs">
				  <ul class="knr_player-nav pull-left">
				    <li><a href="#knr_player-add-audio"><?php echo ($update)? __('Audio', 'knr-player') : __('Add audio', 'knr-player'); ?></a></li>
				    <li class="mr-30"><a href="#knr_player-add-skin"><?php _e('Skin', 'knr-player');?></a></li>
				</ul>

				<ul class="knr_player-nav pull-right">
					<?php
					if ($update) {
						echo '<li><input name="knr_player_update" type="button" class="knr_button knr_primary knr_player_save" upid="'.esc_attr($upt_id).'" option="update" value="'.__('Update', 'knr-player').'"></li>';
						echo '<li><button name="knr_player_cancel" type="submit" class="knr_button knr_info">'.__('Cancel', 'knr-player').'</button></li>';
					}else{
						echo '<li><input name="knr_player_save" type="button" class="knr_button knr_primary knr_player_save" option="save" value="'.__('Save', 'knr-player').'"></li>';
					}
					?>
				  </ul>
				  <div class="clear_knr"></div>
				  <div id="knr_player-add-audio">
				  	<!-- Trigger/Open The Modal -->
					<ul id="knr_list_mp3">
						<li><input type="button" id="knr_open_modal" value="<?php _e('Add Mp3', 'knr-player');?>"></li>
						<?php
							if ($update) {
								$audio_crnt = $audio_crnt_data->audio;
								foreach ($audio_crnt as $i=> $audio) {
									echo '<li val="'.esc_attr($i).'"><input type="button" pid="'.esc_attr($upt_id).'" auid="'.esc_attr($i).'" value="'.esc_attr($audio->title).'" class="knr_open_modal_update"></li>';
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
			<br><br>

		</div>
		<?php
	}

	/**
	 * Audio manage page.
	 *
	 * @since    1.0.0
	 */
	function knrAudio() {
		global $wpdb, $user_ID;
		$table_name = $wpdb->prefix . "knr_player";

		if(isset($_GET["knr_del"])) {
			$del_id = sanitize_text_field($_GET["knr_del"]);
			$wpdb->query("DELETE FROM $table_name WHERE id='$del_id'");
			?>
			<script>location.replace('admin.php?page=knr_player');</script>
			<?php
		}
		?>

		<!-- Frontend -->
		<div class="wrap">
			<h1 class="wp-heading-inline"><?php _e('KNR Player', 'knr-player');?></h1>
			<a href="<?php echo esc_url(admin_url( 'admin.php?page=knr_audio'));?>" class="page-title-action"><?php _e('Add New', 'knr-player');?></a>
			<hr class="wp-header-end">
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
									<td width='25%'><input type='text' value='[KNR_Player id=\"".esc_attr($print->id)."\"]' onclick=\"select();document.execCommand('copy')\"></td>
									<td width='25%'>".esc_attr($print->name)."</td>
									<td width='25%'>
										<a href='admin.php?page=knr_audio&knr_upt=".esc_attr($print->id)."'>
											<button type='button' class='knr_button knr_warning'>".__('Edit', 'knr-player')."</button>
										</a>
										<a href='admin.php?page=knr_player&knr_del=".esc_attr($print->id)."'>
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

}