var a = function() {
  if (b > (function(){ return 7; })()) {
    return (function() { return b; })();
  } else if (7 > 8 && (function(){ return 7; })() > 0) {
    return 9;
  }
}