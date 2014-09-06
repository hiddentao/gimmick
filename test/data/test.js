var a = function() {
  var c = (function(){ return 10; })();

  if (b > (function(){ return 7; })()) {
    return (function() { return b; })();
  } else if (7 > 8 && (function(){ return 7; })() > 0) {
    return 9;
  }
}