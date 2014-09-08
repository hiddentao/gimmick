(function() {

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

  /* setup loop to push new event data to server */

  var events = [];

  var tellServer;
  (tellServer = function() {
    if (!events.length) {
      return setTimeout(tellServer, 100);
    }

    var http = new XMLHttpRequest();
    var url = "/data";
    
    var params = "d=" + JSON.stringify(events);
    events = [];

    http.open("POST", serverUrl + '/newEvents', true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
      if (4 === http.readyState) {
        postInProgress = false;

        if (200 !== http.status) {
          console.error('Error posting to Gimmick server', http.responseText);
        }

        setTimeout(tellServer, 100);
      }
    }

    http.send(params);
  })();


  /* setup browser window scope methods */

  window.__gmk = function(id, mode) {
    events.push([id, mode, Date.now()]);
  };

})();