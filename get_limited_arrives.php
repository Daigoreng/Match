<?php
  // すべてのarrive情報を取り出す
  // 取り出す最大数を指定する
  // limit: 最大数
  require "../common/common.php";
  require "../common/sql_server.php";
  require "../common1/pony_arrive_class.php";

  $arrive = new pony_arrive();
  $ret=pony_arrive_select("",
                          "order by id desc ".
                          "limit ".$_POST['limit']);
  echo json_encode($ret,JSON_UNESCAPED_UNICODE);
?>
