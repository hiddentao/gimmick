(function() {

  /* api */

  var _Gmk = window._Gmk = {
    id: Math.random().toString(36).substring(7),
    events: [],
    f: function(id, mode) {
      _Gmk.events.push([id, mode, Date.now()]);          
    }
  };

  /* get URL of gimmick server */

  var scriptTags = document.getElementsByTagName('script');
  var scriptTag;
  for (var i=0; scriptTags.length>i; ++i) {
    if (0 <= scriptTags[i].src.indexOf('/gimmick.js')) {
      scriptTag = scriptTags[i];
      break;
    }
  }
  if (!scriptTag) {
    return console.error('Gimmick disabled: unable to find SCRIPT tag which loads gimmick.js');
  }

  var serverUrl = scriptTag.src.substr(0, scriptTag.src.indexOf('/gimmick.js'));

  /* ajax POST to server */

  var noop = function() {};

  var postToServer = function(path, data, cb) {
    cb = cb || noop;

    var formData = new FormData();
    formData.append('data', JSON.stringify(data));

    var http = new XMLHttpRequest();
    http.open("POST", serverUrl + path + "?id=" + _Gmk.id, true);

    http.onreadystatechange = function() {
      if (4 === http.readyState) {
        if (200 !== http.status) {
          console.error('Gimmick: error posting to server', http.responseText);
          cb(new Error(http.responseText), http);
        } else {
          cb(null, http);
        }
      }
    }

    http.send(formData);
  };

  /* loop to push new event data to server */

  var sendEventsToServer = function() {
    if (!_Gmk.events.length) {
      return setTimeout(sendEventsToServer, 100);
    }

    postToServer('/events', { events: _Gmk.events}, function() {
      setTimeout(sendEventsToServer, 100);
    })

    _Gmk.events = [];
  };


  /* init - tell server about me */

  var keys = [
    'appName', 'appCodeName', 'appVersion', 'hardwareConcurrency',
    'language', 'maxTouchPoints', 'platform', 'product',
    'productSub', 'userAgent', 'vendor', 'vendorSub',
  ];
  var meta = {
    performance: window.performance || {}
  };
  keys.forEach(function(k){ meta[k] = navigator[k]; });

  postToServer('/register', meta);

  
  /* init - event submission loop */

  sendEventsToServer();

})();



