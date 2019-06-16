<?php
    
    require "../common/common.php";
    require "../common/sql_server.php";
    require "../common1/pony_arrive_class.php";
   
    $arrive=new pony_arrive();
 
    $arrive->id=$_POST["id"];
    $arrive->blog_title=$_POST["title"];
    $arrive->url=$_POST["url"];
    echo "<p>id=".$arrive->id." title=".$arrive->blog_title." url=".$arrive->url."</p>";
//
    $arrive->update();

    
    ?>


