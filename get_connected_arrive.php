<?php
  // 指定したタイトルと紐づいているarrive情報を持ってくる
  // title: ブログのタイトル＋"::"+日付の文字列
  require "../common/common.php";
  require "../common/sql_server.php";
  require "../common1/pony_arrive_class.php";

  $arrive = new pony_arrive();
  $ret=pony_arrive_select("where blog_title = '".$_POST['title']."'","");
  echo json_encode($ret,JSON_UNESCAPED_UNICODE);
?>