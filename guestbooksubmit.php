<?php
date_default_timezone_set('Asia/Chongqing');
$file=fopen("guestbook.html","a");
$datestr=date("Y-m-d G:i:s");
fwrite($file,"<li>".$_POST["txt"].'  '.$datestr."</li>"."\n");
echo $txtstr;
/*
$i=0;
$lines=array('xx');
while(!feof($file)){
	$i+=1;
	$lines[$i]=fgets($file);
}
echo $lines[1];*/
fclose($file);
?>