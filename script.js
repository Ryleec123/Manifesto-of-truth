// page-flip logic for the liner notes book
(function () {
  var book = document.querySelector('.book');
  var stage = document.querySelector('.stage');
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs button'));

  var FLIP_MS = 1050;
  var current = 0;
  var boostTimer = null;

  // flipped pages sit low, upcoming pages stack high; pages mid-flip get
  // boosted above everything so they sweep over the stack cleanly
  function setZ(boost) {
    pages.forEach(function (pg, i) {
      var z;
      if (boost && boost.indexOf(i) !== -1) z = 500 + i;
      else if (i < current) z = 10 + i;
      else z = 100 - i;
      pg.style.zIndex = z;
    });
  }

  function go(n) {
    n = Math.max(0, Math.min(pages.length - 1, n));
    if (n === current) return;
    var lo = Math.min(n, current), hi = Math.max(n, current), boost = [];
    for (var i = lo; i < hi; i++) boost.push(i);
    current = n;
    pages.forEach(function (pg, i) {
      pg.classList.toggle('flipped', i < current);
    });
    tabs.forEach(function (tab, i) {
      tab.classList.toggle('active', i === current);
    });
    setZ(boost);
    clearTimeout(boostTimer);
    boostTimer = setTimeout(function () { setZ(null); }, FLIP_MS + 250);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { go(i); });
  });

  Array.prototype.forEach.call(document.querySelectorAll('.turn'), function (el) {
    el.addEventListener('click', function () { go(current + 1); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.back-corner'), function (el) {
    el.addEventListener('click', function () { go(current - 1); });
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(current + 1);
    else if (e.key === 'ArrowLeft') go(current - 1);
  });

  // shrink the whole book on narrow windows
  function fit() {
    var s = Math.min(1, (window.innerWidth - 48) / 1240);
    book.style.transform = 'scale(' + s + ')';
    stage.style.height = Math.ceil(900 * s) + 'px';
  }
  window.addEventListener('resize', fit);

  fit();
  setZ(null);
})();
