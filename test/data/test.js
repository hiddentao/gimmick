var a = function() {
  switch ((function() {return 'a';})()) {
    case 1:
      (function(){})();
      break;
    case 2:
    default:
      return (function(){})();
      break;
  }
}

