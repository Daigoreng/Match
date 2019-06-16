<?php
  // ブログと紐づいていないarrive情報を取り出す
  // 2つの日付を指定し、その間のデータのみ
  // date1: 古い日付
  // date2: 新しい日付
  require "../common/common.php";
  require "../common/sql_server.php";
  require "../common1/pony_arrive_class.php";

  $date1=date("Y-m-d H:i:s",strtotime($_POST['date1']));
  $date2=date("Y-m-d H:i:s",strtotime($_POST['date2']));
  $arrive = new pony_arrive();
  $ret=pony_arrive_select("where url = '' && ".
                          "blog_title = '' && ".
                          "trace_info_time>='".$date1."' && ".
                          "trace_info_time<='".$date2."'",
                          "order by id desc");
  /*$ret=array();
  $ret[0]=$date1;
  $ret[1]=$date2;
  $ret[2]=$_POST['date1'];
  $ret[3]=$_POST['date2'];*/
  echo json_encode($ret,JSON_UNESCAPED_UNICODE);
?>
