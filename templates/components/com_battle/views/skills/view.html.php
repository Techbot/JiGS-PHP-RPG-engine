<?php
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view');

JTable::addIncludePath(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_battle'.DS.'tables');

class BattleViewskills extends JView
{	
	function display($tpl = null)
	{
	//	$id = (int) JRequest::getVar('id', 0);
		$user =& JFactory::getUser();
		$id= $user->id;			
		$players =& JTable::getInstance('players', 'Table');
		$players->load($id);
	//		echo '<pre>';
	//		echo	$gun_number;
	//	print_r($mygun);
	//	echo '</pre>';
		$model = &$this->getModel();
		$this->assignRef('skills',$model->get_skills());
		$backlink = JRoute::_('index.php?option=com_battle');
		$this->assignRef('players', $players);		
		$this->assignRef('backlink', $backlink);
				parent::display($tpl);
	}
}
