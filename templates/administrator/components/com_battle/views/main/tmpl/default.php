<?php
defined( '_JEXEC' ) or die( 'Restricted access' );
JHTML::_('behavior.calendar');
$editor =& JFactory::getEditor();
JToolBarHelper::preferences( 'com_battle' );
JToolBarHelper::title( JText::_( 'Main Control panel' ), 'addedit.png' );
JToolBarHelper::save();
JToolBarHelper::apply();
JToolBarHelper::cancel( 'cancel', 'Close' );
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
$params = $this->form->params;
?>

<div id = "frame" style = "width:50%;float:left;">
	<form action="index.php" method="get" name="adminForm3" id="adminForm3">Factionalise Players
		<input type="hidden" name="task" value="factionalise"></input>
		<input type="hidden" name="option" value="com_battle" />
		<input type="hidden" name="controller" value="main" />
		<input type="submit" name="submit"/>
		<?php echo JHTML::_( 'form.token' ); ?>
	</form>
	
	<form action="index.php" method="get" name="adminForm4" id="adminForm2">Sync Players
		<input type="hidden" name="task" value="sync_players"></input>
		<input type="hidden" name="option" value="com_battle" /><input type="hidden" name="controller" value="main" />
		<input type="submit" name="submit"/>
	</form>

	<form action="index.php" method="get" name="adminForm5" id="adminForm2">Sync Players Health
		<input type="hidden" name="task" value="sync_players_health"></input>
		<input type="hidden" name="option" value="com_battle" />
		<input type="hidden" name="controller" value="main" />
		<input type="submit" name="submit"/>
	</form>
	
	<form action="index.php" method="get" name="adminForm6" id="adminForm2">Sync Players Batteries
		<input type="hidden" name="task" value="sync_players_batteries"></input>
		<input type="hidden" name="option" value="com_battle" />
		<input type="hidden" name="controller" value="main" />
		<input type="submit" name="submit"/>
	</form>

	<form action="index.php" method="get" name="adminForm7" id="adminForm2">Sync Players Message
		<input type="hidden" name="task" value="sync_players_message"></input>
		<input type="hidden" name="option" value="com_battle" />
		<input type="hidden" name="controller" value="main" />
		<input type="submit" name="submit"/>
	</form>
	
	<form action="index.php" method="get" name="adminForm8" id="adminForm2">Sync Players Leases
		<input type="hidden" name="task" value="sync_players_leases"></input>
		<input type="hidden" name="option" value="com_battle" />
		<input type="hidden" name="controller" value="main" />
		<input type="submit" name="submit"/>
	</form>

<?php
/*if (!$this->row->id) { echo "can add specifics after save"; }
else
{
	jimport( 'joomla.application.component.view' ) ;
	echo $this->loadTemplate ( $this->row->type ) ; 
}*/
?>

<form action="<?php echo JRoute::_('index.php?option=com_battle&layout=edit&id='.(int) $this->item->id); ?>"
      method="post" name="adminForm" id="helloworld-form" class="form-validate">
 
<input type="text" id="sbid" name="sbid" value="<?php echo $params ?>" />

 
        <div>
                <input type="hidden" name="task" value="" />
                <?php echo JHtml::_('form.token'); ?>
				<input type="hidden" name="option" value="com_battle" />
				<input type="hidden" name="controller" value="main" />
		<input type="submit" name="submit"/>
        </div>
</form>


</div>

<div id = "frame2" style = "width:50%;float:right;">
	<div id="messages">Connecting...</div>
</div>

<script type='text/javascript'>
function request_messages(){
	var messages = '';
	var all = '';
	var details = this.details;
	var a = new Request.JSON({
    url: "index.php?option=com_battle&controller=main&format=raw&task=get_message", 
    onSuccess: function(result)
    {
		
		
		
	   	Array.each(result, function(message,index)
	    {
	        messages = messages + '<p>' + message['time'] + ':' + message['text'] + '</p>';
	 	}
	 	);
		
		div ="<div id = 'message_table'>";
		div += messages;
		div +="</div>";
		
		$('messages').innerHTML = div;
    }	
 	
    }).get();		
		
	   	//Array.each(result, function(message,index)
	    //{
	    //    messages = messages + '<tr><td>' + message['message'] + '</td></tr>';
	 	//}
	 	//);
		
		//table ="<table id = 'message_table'>";
		//table += messages;
		//table +="</table>";
		
		//$('messages').innerHTML = table;
    //}	
 	
    //}).get();

}
request_messages();
request_messages.periodical(15000);

</script>
