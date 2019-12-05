<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://github.com/rakibhoossain/
 * @since      1.0.0
 *
 * @package    Knr_Player
 * @subpackage Knr_Player/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Knr_Player
 * @subpackage Knr_Player/includes
 * @author     Rakib Hossain <serakib@gmail.com>
 */
class Knr_Player {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Knr_Player_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'KNR_PLAYER_VERSION' ) ) {
			$this->version = KNR_PLAYER_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'knr-player';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		
		add_filter( 'widget_text', 'do_shortcode' );
		add_shortcode( 'KNR_Player', [$this,'KNR_Player_shortcode_handler'] );


	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Knr_Player_Loader. Orchestrates the hooks of the plugin.
	 * - Knr_Player_i18n. Defines internationalization functionality.
	 * - Knr_Player_Admin. Defines all hooks for the admin area.
	 * - Knr_Player_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-knr-player-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-knr-player-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-knr-player-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-knr-player-public.php';

		$this->loader = new Knr_Player_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Knr_Player_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Knr_Player_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Knr_Player_Admin( $this->get_plugin_name(), $this->get_version() );


		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		/**
		 * register our knr_player_settings_init to the admin_init action hook
		 */
		// $this->loader->add_action( 'admin_init', $plugin_admin, 'knr_player_settings_init' );
		/**
		 * register our knr_player_options_pages to the admin_menu action hook
		 */
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'knr_player_options_pages' );

		// Add Settings link to the plugin
		$plugin_basename = plugin_basename( plugin_dir_path( __DIR__ ) . $this->plugin_name . '.php');
		$this->loader->add_filter('plugin_action_links_' . $plugin_basename, $plugin_admin, 'add_action_links');

		//AJax handler
		// Here we register our "send_form" function to handle our AJAX request, do you remember the "superhypermega" hidden field? Yes, this is what it refers, the "send_form" action.
		$this->loader->add_action( 'wp_ajax_knr_player_ajax_form', $plugin_admin, 'knr_player_ajax_form' );
		$this->loader->add_action( 'wp_ajax_nopriv_knr_player_ajax_form', $plugin_admin, 'knr_player_ajax_form' );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Knr_Player_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
	}


	/**
	 * Register all of shortcode
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   public
	 */
	public function KNR_Player_shortcode_handler($atts) {

		if ( !isset($atts['id']) ) return __('Please specify a audio id', 'knr-player');
		
		global $wpdb;
		$table_name = $wpdb->prefix . "knr_player";
		$id = $atts['id'];

		$result = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$id'");

		if ($result) {
			foreach ($result as $res) {
				$audio_crnt_data = json_decode($res->data);
				$audio_data = (array)$audio_crnt_data->audio;

				$audio = reset($audio_data); //getting only first item
				$autoplay = ($audio->autoplay == 'true')? 'autoplay  muted' : '';

				if($audio_crnt_data->skin == '2') {
				return '
					<div class="knr_player_2 knr" style="background-color:#fff;">
						<div class="knr_player_rect">
							<img src="'.esc_attr($audio->image).'" class="knr_player_icon">
							<div class="knr_player_box">
								<div class="info">
									<strong>'.esc_attr($audio->title).'</strong>
									<p>'.esc_attr($audio->author).'</p>
									<p>'.esc_attr($audio->info).'</p>
								</div>
								<div class="knr_control">
									<div class="knr_play_control">
										<img class="play-icon" src="'.plugin_dir_url( __FILE__ ) .'images/play.svg">
										<img class="pause-icon" src="'.plugin_dir_url( __FILE__ ).'images/pause.svg">
									</div>
									<div class="knr_volume_control" volume="'.esc_attr($audio->volume).'">
										<div class="knr_volume animated slideInLeft"></div>
										<img class="speaker-icon" src="'.plugin_dir_url( __FILE__ ).'images/speaker.svg">
										<img class="mute-icon" src="'.plugin_dir_url( __FILE__ ).'images/mute.svg">
									</div>
									<audio preload="auto" '.esc_attr($autoplay).'>
										<source src="'.esc_url($audio->src).'" type="audio/mpeg">
									</audio>
								</div>
							</div>
						</div>
					</div>
				';

				}

				if($audio_crnt_data->skin == '3') return $this->knr_player_pl($audio_data);

				return '
					<div class="knr_player knr knr_auto knr_box" style="background-color:#fff;">
						<div class="knr_play_button" style="background-image: url('.plugin_dir_url( __FILE__ ) .'images/player-bg.png);">
						    <div class="player-bg knr_play">
						    	<img class="play-icon" src="'.plugin_dir_url( __FILE__ ) .'images/play.svg">
						    	<img class="pause-icon" src="'.plugin_dir_url( __FILE__ ).'images/pause.svg">
						    </div>
						</div>
						<audio preload="auto" '.esc_attr($autoplay).'>
							<source src="'.esc_url($audio->src).'" type="audio/mpeg">
						</audio>
					    <div class="knr-volume-controls" volume="'.esc_attr($audio->volume).'">
					        <img class="speaker-icon" src="'.plugin_dir_url( __FILE__ ).'images/speaker.svg">
					        <img class="mute-icon" src="'.plugin_dir_url( __FILE__ ).'images/mute.svg">
					    </div>
					</div>
				';
			}	
		}else{
			return __('Please specify a valid audio id', 'knr-player');
		}

	}

	/**
	 * Playlist player.
	 *
	 * @since    1.0.0
	 */
	private function knr_player_pl($audio_data){
			$first = reset($audio_data); //getting only first item
			$volume = ($first->volume / 10); //playlist volume
		?>
      <div class="knr_palyer_pl_play">
         <div class="audio-image"></div>
         <div class="audio-player">
            <div class="audio-info text-center">
            	<span class="title"></span> - 
               	<span class="artist text-bold"></span>
            </div>
            <input class="volume" type="range" min="0" max="10" value="<?php echo esc_attr($volume); ?>">
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
				foreach ($audio_data as $audio) {
					echo'<li song="'.esc_attr($audio->src).'" cover="'.esc_url($audio->image).'" artist="'.esc_attr($audio->author).'">'.esc_attr($audio->title).'</li>';
				}
			?>
            </ul>
         </div>
      </div>
	<?php
	}


	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Knr_Player_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
