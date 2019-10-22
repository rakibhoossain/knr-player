<?php 

if ( ! defined( 'ABSPATH' ) )
	exit;
require_once 'class-knr-player-controller.php';

class KNR_Plugin_Controller {

	private $view, $model;

	function __construct() {
		$this->model = new KNR_Player_Model($this);	
	}


	function delete_item($id)
	{
		return $this->model->delete_item($id);
	}
	
	// function clone_item($id)
	// {
	// 	return $this->model->clone_item($id);
	// }
	
	function save_item($item)
	{
		return $this->model->save_item($item);	
	}
	
	function get_list_data() {
	
		return $this->model->get_list_data();
	}
	
	function get_item_data($id) {
		
		return $this->model->get_item_data($id);
	}

}