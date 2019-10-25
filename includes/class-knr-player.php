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
		$this->loader->add_action( 'admin_init', $plugin_admin, 'knr_player_settings_init' );
		/**
		 * register our knr_player_options_pages to the admin_menu action hook
		 */
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'knr_player_options_pages' );

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

		$results = $wpdb->get_results("SELECT * FROM $table_name WHERE id='$id'");

		if ($results) {
			foreach($results as $result) { 
				$data = json_decode($result->data);

				$player = '
					<div class="knr_player knr_auto knr_box">
						<div class="knr_play_button" style="background-image: url('.plugin_dir_url( __FILE__ ) .'images/player-bg.png);">
						    <div class="player-bg knr_play">
						    	<img class="play-icon" src="'.plugin_dir_url( __FILE__ ) .'images/play.svg">
						    	<img class="pause-icon" src="'.plugin_dir_url( __FILE__ ).'images/pause.svg">
						    </div>
						</div>
						<audio class="knr_audio__play" src="'.esc_url($data->src).'" preload="auto"></audio>
					    <div class="knr-volume-controls text-center">
					        <img class="speaker-icon" src="'.plugin_dir_url( __FILE__ ).'images/speaker.svg">
					        <img class="mute-icon" src="'.plugin_dir_url( __FILE__ ).'images/mute.svg">
					    </div>
					</div>
				';
				return $player;
			}	
		}else{
			return __('Please specify a valid audio id', 'knr-player');
		}

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
