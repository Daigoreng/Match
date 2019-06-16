<?php
  // 指定したIDのtrace_infoデータを取り出す
  // id: IDの配列
  require "../common/common.php";
  require "../common/sql_server.php";
  require "../common1/trace_info_class.php";
    
  //$info = new trace_info();
  $id_array=$_POST['id'];
  foreach($id_array as $id){
    $info[] = trace_info_select("where id= $id","");
  }
  echo json_encode($info,JSON_UNESCAPED_UNICODE);
?>
