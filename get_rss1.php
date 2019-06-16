<?php
  $rss = simplexml_load_file($_POST['url']);
  $ret = array();
  foreach($rss->item as $item){
    $x = array();
    $x['title'] = (string)$item->title;
    $x['link'] = (string)$item->link;
    $x['description'] = (string)$item->description;
    // RSS1.0は2.0のpubDateがde:dateになっていて取れないので置き換えている
    $x['pubDate'] = (string)$item->children('http://purl.org/dc/elements/1.1/')->date;
    $x['pubDate'] = str_replace('T', ' ', $x['pubDate']);
    $x['pubDate'] = str_replace('+09:00', '', $x['pubDate']);
	  $ret[] = $x;
  }
  echo json_encode($ret,JSON_UNESCAPED_UNICODE);
?>