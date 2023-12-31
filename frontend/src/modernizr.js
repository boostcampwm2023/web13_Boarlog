/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-touchevents-setclasses !*/
!(function (e, n, t) {
  function o(e, n) {
    return typeof e === n;
  }
  function s(e) {
    var n = c.className,
      t = Modernizr._config.classPrefix || "";
    if ((d && (n = n.baseVal), Modernizr._config.enableJSClass)) {
      var o = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
      n = n.replace(o, "$1" + t + "js$2");
    }
    Modernizr._config.enableClasses &&
      ((n += " " + t + e.join(" " + t)), d ? (c.className.baseVal = n) : (c.className = n));
  }
  function a() {
    var e, n, t, s, a, i, r;
    for (var l in u)
      if (u.hasOwnProperty(l)) {
        if (
          ((e = []),
          (n = u[l]),
          n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
        )
          for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
        for (s = o(n.fn, "function") ? n.fn() : n.fn, a = 0; a < e.length; a++)
          (i = e[a]),
            (r = i.split(".")),
            1 === r.length
              ? (Modernizr[r[0]] = s)
              : (!Modernizr[r[0]] ||
                  Modernizr[r[0]] instanceof Boolean ||
                  (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])),
                (Modernizr[r[0]][r[1]] = s)),
            f.push((s ? "" : "no-") + r.join("-"));
      }
  }
  function i() {
    return "function" != typeof n.createElement
      ? n.createElement(arguments[0])
      : d
        ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0])
        : n.createElement.apply(n, arguments);
  }
  function r() {
    var e = n.body;
    return e || ((e = i(d ? "svg" : "body")), (e.fake = !0)), e;
  }
  function l(e, t, o, s) {
    var a,
      l,
      f,
      d,
      u = "modernizr",
      p = i("div"),
      h = r();
    if (parseInt(o, 10)) for (; o--; ) (f = i("div")), (f.id = s ? s[o] : u + (o + 1)), p.appendChild(f);
    return (
      (a = i("style")),
      (a.type = "text/css"),
      (a.id = "s" + u),
      (h.fake ? h : p).appendChild(a),
      h.appendChild(p),
      a.styleSheet ? (a.styleSheet.cssText = e) : a.appendChild(n.createTextNode(e)),
      (p.id = u),
      h.fake &&
        ((h.style.background = ""),
        (h.style.overflow = "hidden"),
        (d = c.style.overflow),
        (c.style.overflow = "hidden"),
        c.appendChild(h)),
      (l = t(p, e)),
      h.fake ? (h.parentNode.removeChild(h), (c.style.overflow = d), c.offsetHeight) : p.parentNode.removeChild(p),
      !!l
    );
  }
  var f = [],
    c = n.documentElement,
    d = "svg" === c.nodeName.toLowerCase(),
    u = [],
    p = {
      _version: "3.6.0",
      _config: { classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
      _q: [],
      on: function (e, n) {
        var t = this;
        setTimeout(function () {
          n(t[e]);
        }, 0);
      },
      addTest: function (e, n, t) {
        u.push({ name: e, fn: n, options: t });
      },
      addAsyncTest: function (e) {
        u.push({ name: null, fn: e });
      }
    },
    Modernizr = function () {};
  (Modernizr.prototype = p), (Modernizr = new Modernizr());
  var h = p._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
  p._prefixes = h;
  var m = (p.testStyles = l);
  Modernizr.addTest("touchevents", function () {
    var t;
    if ("ontouchstart" in e || (e.DocumentTouch && n instanceof DocumentTouch)) t = !0;
    else {
      var o = ["@media (", h.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join(
        ""
      );
      m(o, function (e) {
        t = 9 === e.offsetTop;
      });
    }
    return t;
  }),
    a(),
    s(f),
    delete p.addTest,
    delete p.addAsyncTest;
  for (var v = 0; v < Modernizr._q.length; v++) Modernizr._q[v]();
  e.Modernizr = Modernizr;
})(window, document);
