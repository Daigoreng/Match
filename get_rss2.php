<?php
  $rss = simplexml_load_file($_POST['url']);
  $ret=array();
  foreach($rss->channel->item as $item){
    $x = array();
    $x['title'] = (string)$item->title;
    $x['link'] = (string)$item->link;
    $x['description'] = (string)$item->description;
    // pubDateのフォーマットを綺麗にした
    $x['pubDate'] = date("Y-m-d H:i:s", strtotime($item->pubDate));
	  $ret[] = $x;
  }
  echo json_encode($ret,JSON_UNESCAPED_UNICODE);
?>