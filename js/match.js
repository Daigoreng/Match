$(function () {

  // マップの準備
  var map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(31.57, 130.54),
    zoom: 10
  });

  // グローバル変数
  var icon = null;
  var arrive = null; // すべての到着情報
  var arrive_id = null;
  var rss_data = null;
  var rss_done_count = 0;
  var selected_rss_id = -1;
  var marker_list = [];

  // RSSデータをHTMLにセットする
  var set_rss_data = function () {
    var sel = $('#rss_select');

    for (var i in rss_data) {
      var title = rss_data[i]['title'];
      var desc = rss_data[i]['description'];
      // 1.0もpubDateと名付けて取ってきている
      var date = rss_data[i]['pubDate'];
      rss_data[i]['set'] = false;
      for (var j in arrive) {
        console.log("arrive " + j + " : " + arrive[j]['blog_title']);
        if (title + "::" + date == arrive[j]['blog_title']) {
          rss_data[i]['set'] = true;
          break;
        }
      }
      var set = (rss_data[i]['set']) ? "【済】" : "【　】";
      if (!Object.keys(desc).length)
        desc = "";
      else
        desc = "(" + desc + ")";
      // setが済みの表示or非表示 & 日付けを追加した
      sel.append("<option value='" + i + "'>" + set + title + desc + "[" + date + "]" + "</option>");
    }

  }

  // RSSをチェックする
  // タイトルが空なら「タイトルなし」に
  // URLが空なら「未記入」に
  var check_rss = function (d) {
    for (var i in d) {
      if (!Object.keys(d[i].title).length)
        d[i].title = "タイトルなし";
      if (!Object.keys(d[i].link).length)
        d[i].link = "未記入";
    }
  }

  // RSS情報の取得
  var get_rss_done = function (data) {
    console.log(data);
    var d = JSON.parse(data);
    if (rss_data == null)
      rss_data = d;
    else
      for (var i in d)
        rss_data.push(d[i]);
    if (++rss_done_count == 2) {
      check_rss(rss_data);
      set_rss_data();
    }
  }
  var get_rss_fail = function () {
    alert("Get RSS failed");
  }
  var get_rss = function (url, rss_url) {
    $.ajax({
        url: url,
        type: 'post',
        datatype: 'json',
        data: {
          url: rss_url,
        },
        timeout: 5000
      })
      .done(get_rss_done)
      .fail(get_rss_fail);
  }

  // マップピン情報を更新する
  var update_mappin = function (id, date) {
    $("#map_id").text(id);
    $("#map_date").text(date);
  }

  // 失敗の時
  var when_fail = function (str) {
    alert("失敗:" + str);
  }
  // trace_infoの情報を得て、
  // マーカーを作成する
  var get_trace_info = function (data) {
    console.log(data);
    // マーカーがあれば消す
    for (var i in marker_list) {
      marker_list[i].setMap(null);
      marker_list[i] = null;
    }
    marker_list = [];
    // trace_infoの情報を基にマーカーを生成する
    icon = JSON.parse(data);
    for (var i in icon) {
      marker_list[i] = new google.maps.Marker({ //マーカーを置く
        map: map,
        position: new google.maps.LatLng(icon[i][0].lat, icon[i][0].lng),
        metadata: {
          id: arrive_id[i],
          time_stamp: icon[i][0].time_stamp,
        },
      });
      marker_list[i].addListener('click', function () {
        update_mappin(this.metadata.id, this.metadata.time_stamp)
      });
    }
    if (selected_rss_id != -1) {
      if (rss_data[selected_rss_id]['set']) {
        update_mappin(arrive[0]['id'], arrive[0]['trace_info_time']);
        $("#bt_regist").text("解除");
      } else {
        update_mappin(" ", " ");
        $("#bt_regist").text("登録");
      }
    }
  }
  // pony_arriveの情報を得る
  var get_pony_arrive_info = function (data) {
    arrive = JSON.parse(data);
    console.log(data);
    var prev_id = -1; // 重複するIDを登録しないようにするため
    arrive_id = [];
    trace_info_id = [];
    var j = 0;
    for (var i in arrive) {
      if (arrive[i].trace_info_id != prev_id) {
        trace_info_id[j] = arrive[i].trace_info_id;
        arrive_id[j] = arrive[i].id;
        prev_id = arrive[i].trace_info_id;
        j++;
      }
    }
    console.log(trace_info_id);
    console.log(arrive_id);
    // trace_infoの情報を得る
    $.ajax({
        url: 'get_trace_info.php',
        type: 'post',
        datatype: 'json',
        data: {
          id: trace_info_id
        },
        timeout: 5000
      })
      .done(get_trace_info)
      .fail(when_fail, "map_data.php");
  }

  // pony_arriveでタイトルとURLが入っていないものをリストアップし、
  // そのtrace_info_idからtrace_infoの情報を持ってくる
  var get_pony_arrive = function (url, data) {
    $.ajax({
        url: url,
        type: 'post',
        datatype: 'json',
        data: data,
        timeout: 5000
      })
      .done(get_pony_arrive_info)
      .fail(when_fail, "map_load.php");
  }


  // 登録ボタンをクリックした時
  var regist_done = function () {
    alert("登録しました。");
    location.reload();
  }
  var unregist_done = function () {
    alert("解除しました。");
    location.reload();
  }
  var regist_blog = function () {
    var id = $("#map_id").text();
    var title = $("#rss_title").text();
    var date = $("#rss_date").text();
    var url = $("#rss_url").text();
    console.log(id, title, url);
    $.ajax({
        url: 'blog_loc.php',
        type: 'post',
        datatype: 'json',
        data: {
          id: id,
          title: title + "::" + date,
          url: url,
        },
        timeout: 5000
      })
      .done(regist_done)
      .fail(when_fail, "blog_loc.php");
  }
  var unregist_blog = function () {
    var id=$("#map_id").text();
    $.ajax({
        url: 'blog_loc.php',
        type: 'post',
        datatype: 'json',
        data: {
          id: id,
          title: "",
          url: "",
        },
        timeout: 5000
      })
      .done(unregist_done)
      .fail(when_fail, "blog_loc.php");
  }
  $('#bt_regist').click(function (event) {
    if ($("#bt_regist").text() == "登録") {
      regist_blog();
    } else {
      unregist_blog();
    }
  });

  // RSSタイトルが選択された時
  $("#rss_select").on("change", function (ev) {
    var id = $("#rss_select").val();
    selected_rss_id = id;
    $("#rss_title").text(rss_data[id]['title']);
    //titleの後ろにdescriptionもつけるように変更した
    $("#rss_desc").text(rss_data[id]['description']);
    $("#rss_date").text(rss_data[id]['pubDate']);
    $("#rss_url").text(rss_data[id]['link']);
    if (rss_data[id]['set']) {
      // 登録されているブログの時
      get_pony_arrive('get_connected_arrive.php', {
        title: rss_data[id]['title'] + "::" + rss_data[id]['pubDate'],
      });
    } else {
      // 登録されていないブログの時
      var date2 = rss_data[id]['pubDate'];
      var dt2 = new Date(date2);
      console.log("dt2=" + dt2);
      var dt1 = new Date(dt2);
      dt1.setDate(dt2.getDate() - 3);
      var date1 = dt1.getFullYear() + "-" + (dt1.getMonth() + 1) + "-" + dt1.getDate() + " " +
        dt1.getHours() + ":" + dt1.getMinutes() + ":" + dt1.getSeconds();
      console.log("dt1=" + dt1);
      get_pony_arrive('get_date_specified_unconnected_arrives.php', {
        date1: date1,
        date2: date2,
      });
    }
  });


  // 最初に行う処理
  get_pony_arrive('get_limited_arrives.php', {
    limit: 100,
  });
  get_rss('get_rss2.php', 'https://blogs.mbc.co.jp/smile/category/cat_smile/feed'); // モーニングスマイル
  get_rss('get_rss2.php', 'https://blogs.mbc.co.jp/asa/feed/'); // 土曜の朝は
});
