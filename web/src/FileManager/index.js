import { jsx as c, jsxs as L, Fragment as me } from "react/jsx-runtime";
import * as ke from "react";
import xe, { useState as R, useRef as ae, useEffect as ee, createContext as ze, useContext as Te, useLayoutEffect as Kn, useCallback as dn, useMemo as Ze } from "react";
var un = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
}, wt = xe.createContext && /* @__PURE__ */ xe.createContext(un), _n = ["attr", "size", "title"];
function qn(n, e) {
  if (n == null) return {};
  var t = Gn(n, e), o, s;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(n);
    for (s = 0; s < i.length; s++)
      o = i[s], !(e.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(n, o) && (t[o] = n[o]);
  }
  return t;
}
function Gn(n, e) {
  if (n == null) return {};
  var t = {};
  for (var o in n)
    if (Object.prototype.hasOwnProperty.call(n, o)) {
      if (e.indexOf(o) >= 0) continue;
      t[o] = n[o];
    }
  return t;
}
function He() {
  return He = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var o in t)
        Object.prototype.hasOwnProperty.call(t, o) && (n[o] = t[o]);
    }
    return n;
  }, He.apply(this, arguments);
}
function bt(n, e) {
  var t = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(n);
    e && (o = o.filter(function(s) {
      return Object.getOwnPropertyDescriptor(n, s).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function Ve(n) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? bt(Object(t), !0).forEach(function(o) {
      Jn(n, o, t[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t)) : bt(Object(t)).forEach(function(o) {
      Object.defineProperty(n, o, Object.getOwnPropertyDescriptor(t, o));
    });
  }
  return n;
}
function Jn(n, e, t) {
  return e = Zn(e), e in n ? Object.defineProperty(n, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : n[e] = t, n;
}
function Zn(n) {
  var e = Xn(n, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Xn(n, e) {
  if (typeof n != "object" || !n) return n;
  var t = n[Symbol.toPrimitive];
  if (t !== void 0) {
    var o = t.call(n, e);
    if (typeof o != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(n);
}
function pn(n) {
  return n && n.map((e, t) => /* @__PURE__ */ xe.createElement(e.tag, Ve({
    key: t
  }, e.attr), pn(e.child)));
}
function U(n) {
  return (e) => /* @__PURE__ */ xe.createElement(Qn, He({
    attr: Ve({}, n.attr)
  }, e), pn(n.child));
}
function Qn(n) {
  var e = (t) => {
    var {
      attr: o,
      size: s,
      title: i
    } = n, a = qn(n, _n), l = s || t.size || "1em", r;
    return t.className && (r = t.className), n.className && (r = (r ? r + " " : "") + n.className), /* @__PURE__ */ xe.createElement("svg", He({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, t.attr, o, a, {
      className: r,
      style: Ve(Ve({
        color: n.color || t.color
      }, t.style), n.style),
      height: l,
      width: l,
      xmlns: "http://www.w3.org/2000/svg"
    }), i && /* @__PURE__ */ xe.createElement("title", null, i), n.children);
  };
  return wt !== void 0 ? /* @__PURE__ */ xe.createElement(wt.Consumer, null, (t) => e(t)) : e(un);
}
function eo(n) {
  return U({ attr: { version: "1.1", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z" }, child: [] }] })(n);
}
const mt = ({ loading: n = !1, className: e }) => n ? /* @__PURE__ */ c("div", { className: `loader-container ${e}`, children: /* @__PURE__ */ c(eo, { className: "spinner" }) }) : null;
function fn(n) {
  return U({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { fillRule: "evenodd", d: "M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" }, child: [] }] })(n);
}
function hn(n) {
  return U({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z" }, child: [] }, { tag: "path", attr: { d: "M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5" }, child: [] }] })(n);
}
function mn(n) {
  return U({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" }, child: [] }] })(n);
}
function xt(n) {
  return U({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" }, child: [] }] })(n);
}
function gn(n) {
  return U({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" }, child: [] }] })(n);
}
function vn(n) {
  return U({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "polyline", attr: { points: "23 4 23 10 17 10" }, child: [] }, { tag: "polyline", attr: { points: "1 20 1 14 7 14" }, child: [] }, { tag: "path", attr: { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }, child: [] }] })(n);
}
function to(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" }, child: [] }] })(n);
}
function no(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, child: [] }] })(n);
}
function $n(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "m20.55 5.22-1.39-1.68A1.51 1.51 0 0 0 18 3H6c-.47 0-.88.21-1.15.55L3.46 5.22C3.17 5.57 3 6.01 3 6.5V19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6.5c0-.49-.17-.93-.45-1.28zM12 9.5l5.5 5.5H14v2h-4v-2H6.5L12 9.5zM5.12 5l.82-1h12l.93 1H5.12z" }, child: [] }] })(n);
}
function oo(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" }, child: [] }] })(n);
}
function so(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, child: [] }] })(n);
}
function io(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }, child: [] }] })(n);
}
function yn(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" }, child: [] }] })(n);
}
function wn(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "m20.54 5.23-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.81.97H5.44l.8-.97zM5 19V8h14v11H5zm8.45-9h-2.9v3H8l4 4 4-4h-2.55z" }, child: [] }] })(n);
}
function gt(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z" }, child: [] }] })(n);
}
function bn(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" }, child: [] }] })(n);
}
function ao(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "M10.02 6 8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" }, child: [] }] })(n);
}
function xn(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { d: "M20.005 5.995h-1v2h1v8h-1v2h1c1.103 0 2-.897 2-2v-8c0-1.102-.898-2-2-2zm-14 4H15v4H6.005z" }, child: [] }, { tag: "path", attr: { d: "M17.005 17.995V4H20V2h-8v2h3.005v1.995h-11c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h11V20H12v2h8v-2h-2.995v-2.005zm-13-2v-8h11v8h-11z" }, child: [] }] })(n);
}
function ro(n) {
  return U({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { d: "M20 2H8c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM8 16V4h12l.002 12H8z" }, child: [] }, { tag: "path", attr: { d: "M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8zm8.933 3.519-1.726-1.726-1.414 1.414 3.274 3.274 5.702-6.84-1.538-1.282z" }, child: [] }] })(n);
}
function Cn(n) {
  return U({ attr: { viewBox: "0 0 448 512" }, child: [{ tag: "path", attr: { d: "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" }, child: [] }] })(n);
}
function lo(n) {
  return U({ attr: { viewBox: "0 0 320 512" }, child: [{ tag: "path", attr: { d: "M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" }, child: [] }] })(n);
}
function co(n) {
  return U({ attr: { viewBox: "0 0 640 512" }, child: [{ tag: "path", attr: { d: "M128 0C92.7 0 64 28.7 64 64l0 224-44.8 0C8.6 288 0 296.6 0 307.2C0 349.6 34.4 384 76.8 384L320 384l0-96-192 0 0-224 320 0 0 32 64 0 0-32c0-35.3-28.7-64-64-64L128 0zM512 128l-112 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l192 0c26.5 0 48-21.5 48-48l0-208-96 0c-17.7 0-32-14.3-32-32l0-96zm32 0l0 96 96 0-96-96z" }, child: [] }] })(n);
}
function Be(n) {
  return U({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" }, child: [] }] })(n);
}
function Ct(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464l256 0c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM192 272l0 128c0 6.5-3.9 12.3-9.9 14.8s-12.9 1.1-17.4-3.5L129.4 376 112 376c-8.8 0-16-7.2-16-16l0-48c0-8.8 7.2-16 16-16l17.4 0 35.3-35.3c4.6-4.6 11.5-5.9 17.4-3.5s9.9 8.3 9.9 14.8zm85.8-4c11.6 20 18.2 43.3 18.2 68s-6.6 48-18.2 68c-6.6 11.5-21.3 15.4-32.8 8.8s-15.4-21.3-8.8-32.8c7.5-12.9 11.8-27.9 11.8-44s-4.3-31.1-11.8-44c-6.6-11.5-2.7-26.2 8.8-32.8s26.2-2.7 32.8 8.8z" }, child: [] }] })(n);
}
function de(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm97 289c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L79 303c-9.4 9.4-9.4 24.6 0 33.9l48 48c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-31-31 31-31zM257 255c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l31 31-31 31c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l48-48c9.4-9.4 9.4-24.6 0-33.9l-48-48z" }, child: [] }] })(n);
}
function St(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" }, child: [] }] })(n);
}
function nt(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm96 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm69.2 46.9c-3-4.3-7.9-6.9-13.2-6.9s-10.2 2.6-13.2 6.9l-41.3 59.7-11.9-19.1c-2.9-4.7-8.1-7.5-13.6-7.5s-10.6 2.8-13.6 7.5l-40 64c-3.1 4.9-3.2 11.1-.4 16.2s8.2 8.2 14 8.2l48 0 32 0 40 0 72 0c6 0 11.4-3.3 14.2-8.6s2.4-11.6-1-16.5l-72-104z" }, child: [] }] })(n);
}
function uo(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z" }, child: [] }] })(n);
}
function po(n) {
  return U({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" }, child: [] }] })(n);
}
function Nt(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm72 208c-13.3 0-24 10.7-24 24l0 104 0 56c0 13.3 10.7 24 24 24s24-10.7 24-24l0-32 44 0c42 0 76-34 76-76s-34-76-76-76l-68 0zm68 104l-44 0 0-56 44 0c15.5 0 28 12.5 28 28s-12.5 28-28 28z" }, child: [] }] })(n);
}
function Ft(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM80 288c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32l0 16 44.9-29.9c2-1.3 4.4-2.1 6.8-2.1c6.8 0 12.3 5.5 12.3 12.3l0 103.4c0 6.8-5.5 12.3-12.3 12.3c-2.4 0-4.8-.7-6.8-2.1L240 368l0 16c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-96z" }, child: [] }] })(n);
}
function Et(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm55 241.1c-3.8-12.7-17.2-19.9-29.9-16.1s-19.9 17.2-16.1 29.9l48 160c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l25-83.4 25 83.4c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l48-160c3.8-12.7-3.4-26.1-16.1-29.9s-26.1 3.4-29.9 16.1l-25 83.4-25-83.4c-3-10.2-12.4-17.1-23-17.1s-19.9 7-23 17.1l-25 83.4-25-83.4z" }, child: [] }] })(n);
}
function fo(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l48 0c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l48 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm48 112c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm0 64c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm-6.3 71.8L82.1 335.9c-1.4 5.4-2.1 10.9-2.1 16.4c0 35.2 28.8 63.7 64 63.7s64-28.5 64-63.7c0-5.5-.7-11.1-2.1-16.4l-23.5-88.2c-3.7-14-16.4-23.8-30.9-23.8l-14.8 0c-14.5 0-27.2 9.7-30.9 23.8zM128 336l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" }, child: [] }] })(n);
}
function We(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z" }, child: [] }] })(n);
}
function Pt(n) {
  return U({ attr: { viewBox: "0 0 576 512" }, child: [{ tag: "path", attr: { d: "M384 480l48 0c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224l-400 0c-11.4 0-21.9 6-27.6 15.9L48 357.1 48 96c0-8.8 7.2-16 16-16l117.5 0c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8L416 144c8.8 0 16 7.2 16 16l0 32 48 0 0-32c0-35.3-28.7-64-64-64L298.5 96c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l23.7 0L384 480z" }, child: [] }] })(n);
}
function ft(n) {
  return U({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M104.6 48L64 48C28.7 48 0 76.7 0 112L0 384c0 35.3 28.7 64 64 64l96 0 0-48-96 0c-8.8 0-16-7.2-16-16l0-272c0-8.8 7.2-16 16-16l16 0c0 17.7 14.3 32 32 32l72.4 0C202 108.4 227.6 96 256 96l62 0c-7.1-27.6-32.2-48-62-48l-40.6 0C211.6 20.9 188.2 0 160 0s-51.6 20.9-55.4 48zM144 56a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM448 464l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L464 243.9 464 448c0 8.8-7.2 16-16 16zM256 512l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9l-67.9-67.9c-9-9-21.2-14.1-33.9-14.1L256 128c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64z" }, child: [] }] })(n);
}
const Oe = (n = () => {
}) => {
  const [e, t] = R(!1), o = ae(null), s = (i) => {
    var a;
    (a = o.current) != null && a.contains(i.target) ? t(!1) : (t(!0), n(i, o));
  };
  return ee(() => (document.addEventListener("click", s, !0), document.addEventListener("mousedown", s, !0), () => {
    document.removeEventListener("click", s, !0), document.removeEventListener("mousedown", s, !0);
  }), []), { ref: o, isClicked: e, setIsClicked: t };
}, Sn = ze(), ho = ({ children: n, layout: e }) => {
  const [t, o] = R(() => s(e));
  function s(i) {
    return ["list", "grid"].includes(i) ? i : "grid";
  }
  return /* @__PURE__ */ c(Sn.Provider, { value: { activeLayout: t, setActiveLayout: o }, children: n });
}, Ce = () => Te(Sn), V = (n) => typeof n == "string", Ae = () => {
  let n, e;
  const t = new Promise((o, s) => {
    n = o, e = s;
  });
  return t.resolve = n, t.reject = e, t;
}, zt = (n) => n == null ? "" : "" + n, mo = (n, e, t) => {
  n.forEach((o) => {
    e[o] && (t[o] = e[o]);
  });
}, go = /###/g, Tt = (n) => n && n.indexOf("###") > -1 ? n.replace(go, ".") : n, Lt = (n) => !n || V(n), Re = (n, e, t) => {
  const o = V(e) ? e.split(".") : e;
  let s = 0;
  for (; s < o.length - 1; ) {
    if (Lt(n)) return {};
    const i = Tt(o[s]);
    !n[i] && t && (n[i] = new t()), Object.prototype.hasOwnProperty.call(n, i) ? n = n[i] : n = {}, ++s;
  }
  return Lt(n) ? {} : {
    obj: n,
    k: Tt(o[s])
  };
}, At = (n, e, t) => {
  const {
    obj: o,
    k: s
  } = Re(n, e, Object);
  if (o !== void 0 || e.length === 1) {
    o[s] = t;
    return;
  }
  let i = e[e.length - 1], a = e.slice(0, e.length - 1), l = Re(n, a, Object);
  for (; l.obj === void 0 && a.length; )
    i = `${a[a.length - 1]}.${i}`, a = a.slice(0, a.length - 1), l = Re(n, a, Object), l != null && l.obj && typeof l.obj[`${l.k}.${i}`] < "u" && (l.obj = void 0);
  l.obj[`${l.k}.${i}`] = t;
}, vo = (n, e, t, o) => {
  const {
    obj: s,
    k: i
  } = Re(n, e, Object);
  s[i] = s[i] || [], s[i].push(t);
}, Ye = (n, e) => {
  const {
    obj: t,
    k: o
  } = Re(n, e);
  if (t && Object.prototype.hasOwnProperty.call(t, o))
    return t[o];
}, $o = (n, e, t) => {
  const o = Ye(n, t);
  return o !== void 0 ? o : Ye(e, t);
}, Nn = (n, e, t) => {
  for (const o in e)
    o !== "__proto__" && o !== "constructor" && (o in n ? V(n[o]) || n[o] instanceof String || V(e[o]) || e[o] instanceof String ? t && (n[o] = e[o]) : Nn(n[o], e[o], t) : n[o] = e[o]);
  return n;
}, Fe = (n) => n.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var yo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const wo = (n) => V(n) ? n.replace(/[&<>"'\/]/g, (e) => yo[e]) : n;
class bo {
  constructor(e) {
    this.capacity = e, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(e) {
    const t = this.regExpMap.get(e);
    if (t !== void 0)
      return t;
    const o = new RegExp(e);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, o), this.regExpQueue.push(e), o;
  }
}
const xo = [" ", ",", "?", "!", ";"], Co = new bo(20), So = (n, e, t) => {
  e = e || "", t = t || "";
  const o = xo.filter((a) => e.indexOf(a) < 0 && t.indexOf(a) < 0);
  if (o.length === 0) return !0;
  const s = Co.getRegExp(`(${o.map((a) => a === "?" ? "\\?" : a).join("|")})`);
  let i = !s.test(n);
  if (!i) {
    const a = n.indexOf(t);
    a > 0 && !s.test(n.substring(0, a)) && (i = !0);
  }
  return i;
}, ht = function(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!n) return;
  if (n[e])
    return Object.prototype.hasOwnProperty.call(n, e) ? n[e] : void 0;
  const o = e.split(t);
  let s = n;
  for (let i = 0; i < o.length; ) {
    if (!s || typeof s != "object")
      return;
    let a, l = "";
    for (let r = i; r < o.length; ++r)
      if (r !== i && (l += t), l += o[r], a = s[l], a !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof a) > -1 && r < o.length - 1)
          continue;
        i += r - i + 1;
        break;
      }
    s = a;
  }
  return s;
}, Ke = (n) => n == null ? void 0 : n.replace("_", "-"), No = {
  type: "logger",
  log(n) {
    this.output("log", n);
  },
  warn(n) {
    this.output("warn", n);
  },
  error(n) {
    this.output("error", n);
  },
  output(n, e) {
    var t, o;
    (o = (t = console == null ? void 0 : console[n]) == null ? void 0 : t.apply) == null || o.call(t, console, e);
  }
};
class _e {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(e, t);
  }
  init(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = t.prefix || "i18next:", this.logger = e || No, this.options = t, this.debug = t.debug;
  }
  log() {
    for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
      t[o] = arguments[o];
    return this.forward(t, "log", "", !0);
  }
  warn() {
    for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
      t[o] = arguments[o];
    return this.forward(t, "warn", "", !0);
  }
  error() {
    for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
      t[o] = arguments[o];
    return this.forward(t, "error", "");
  }
  deprecate() {
    for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
      t[o] = arguments[o];
    return this.forward(t, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(e, t, o, s) {
    return s && !this.debug ? null : (V(e[0]) && (e[0] = `${o}${this.prefix} ${e[0]}`), this.logger[t](e));
  }
  create(e) {
    return new _e(this.logger, {
      prefix: `${this.prefix}:${e}:`,
      ...this.options
    });
  }
  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new _e(this.logger, e);
  }
}
var $e = new _e();
class Xe {
  constructor() {
    this.observers = {};
  }
  on(e, t) {
    return e.split(" ").forEach((o) => {
      this.observers[o] || (this.observers[o] = /* @__PURE__ */ new Map());
      const s = this.observers[o].get(t) || 0;
      this.observers[o].set(t, s + 1);
    }), this;
  }
  off(e, t) {
    if (this.observers[e]) {
      if (!t) {
        delete this.observers[e];
        return;
      }
      this.observers[e].delete(t);
    }
  }
  emit(e) {
    for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++)
      o[s - 1] = arguments[s];
    this.observers[e] && Array.from(this.observers[e].entries()).forEach((a) => {
      let [l, r] = a;
      for (let u = 0; u < r; u++)
        l(...o);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach((a) => {
      let [l, r] = a;
      for (let u = 0; u < r; u++)
        l.apply(l, [e, ...o]);
    });
  }
}
class Rt extends Xe {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super(), this.data = e || {}, this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
  }
  removeNamespaces(e) {
    const t = this.options.ns.indexOf(e);
    t > -1 && this.options.ns.splice(t, 1);
  }
  getResource(e, t, o) {
    var u, d;
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const i = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator, a = s.ignoreJSONStructure !== void 0 ? s.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let l;
    e.indexOf(".") > -1 ? l = e.split(".") : (l = [e, t], o && (Array.isArray(o) ? l.push(...o) : V(o) && i ? l.push(...o.split(i)) : l.push(o)));
    const r = Ye(this.data, l);
    return !r && !t && !o && e.indexOf(".") > -1 && (e = l[0], t = l[1], o = l.slice(2).join(".")), r || !a || !V(o) ? r : ht((d = (u = this.data) == null ? void 0 : u[e]) == null ? void 0 : d[t], o, i);
  }
  addResource(e, t, o, s) {
    let i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: !1
    };
    const a = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator;
    let l = [e, t];
    o && (l = l.concat(a ? o.split(a) : o)), e.indexOf(".") > -1 && (l = e.split("."), s = t, t = l[1]), this.addNamespaces(t), At(this.data, l, s), i.silent || this.emit("added", e, t, o, s);
  }
  addResources(e, t, o) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: !1
    };
    for (const i in o)
      (V(o[i]) || Array.isArray(o[i])) && this.addResource(e, t, i, o[i], {
        silent: !0
      });
    s.silent || this.emit("added", e, t, o);
  }
  addResourceBundle(e, t, o, s, i) {
    let a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: !1,
      skipCopy: !1
    }, l = [e, t];
    e.indexOf(".") > -1 && (l = e.split("."), s = o, o = t, t = l[1]), this.addNamespaces(t);
    let r = Ye(this.data, l) || {};
    a.skipCopy || (o = JSON.parse(JSON.stringify(o))), s ? Nn(r, o, i) : r = {
      ...r,
      ...o
    }, At(this.data, l, r), a.silent || this.emit("added", e, t, o);
  }
  removeResourceBundle(e, t) {
    this.hasResourceBundle(e, t) && delete this.data[e][t], this.removeNamespaces(t), this.emit("removed", e, t);
  }
  hasResourceBundle(e, t) {
    return this.getResource(e, t) !== void 0;
  }
  getResourceBundle(e, t) {
    return t || (t = this.options.defaultNS), this.getResource(e, t);
  }
  getDataByLanguage(e) {
    return this.data[e];
  }
  hasLanguageSomeTranslations(e) {
    const t = this.getDataByLanguage(e);
    return !!(t && Object.keys(t) || []).find((s) => t[s] && Object.keys(t[s]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var Fn = {
  processors: {},
  addPostProcessor(n) {
    this.processors[n.name] = n;
  },
  handle(n, e, t, o, s) {
    return n.forEach((i) => {
      var a;
      e = ((a = this.processors[i]) == null ? void 0 : a.process(e, t, o, s)) ?? e;
    }), e;
  }
};
const kt = {}, Mt = (n) => !V(n) && typeof n != "boolean" && typeof n != "number";
class qe extends Xe {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(), mo(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = $e.create("translator");
  }
  changeLanguage(e) {
    e && (this.language = e);
  }
  exists(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (e == null)
      return !1;
    const o = this.resolve(e, t);
    return (o == null ? void 0 : o.res) !== void 0;
  }
  extractFromKey(e, t) {
    let o = t.nsSeparator !== void 0 ? t.nsSeparator : this.options.nsSeparator;
    o === void 0 && (o = ":");
    const s = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator;
    let i = t.ns || this.options.defaultNS || [];
    const a = o && e.indexOf(o) > -1, l = !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !So(e, o, s);
    if (a && !l) {
      const r = e.match(this.interpolator.nestingRegexp);
      if (r && r.length > 0)
        return {
          key: e,
          namespaces: V(i) ? [i] : i
        };
      const u = e.split(o);
      (o !== s || o === s && this.options.ns.indexOf(u[0]) > -1) && (i = u.shift()), e = u.join(s);
    }
    return {
      key: e,
      namespaces: V(i) ? [i] : i
    };
  }
  translate(e, t, o) {
    if (typeof t != "object" && this.options.overloadTranslationOptionHandler && (t = this.options.overloadTranslationOptionHandler(arguments)), typeof options == "object" && (t = {
      ...t
    }), t || (t = {}), e == null) return "";
    Array.isArray(e) || (e = [String(e)]);
    const s = t.returnDetails !== void 0 ? t.returnDetails : this.options.returnDetails, i = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator, {
      key: a,
      namespaces: l
    } = this.extractFromKey(e[e.length - 1], t), r = l[l.length - 1], u = t.lng || this.language, d = t.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if ((u == null ? void 0 : u.toLowerCase()) === "cimode") {
      if (d) {
        const S = t.nsSeparator || this.options.nsSeparator;
        return s ? {
          res: `${r}${S}${a}`,
          usedKey: a,
          exactUsedKey: a,
          usedLng: u,
          usedNS: r,
          usedParams: this.getUsedParamsDetails(t)
        } : `${r}${S}${a}`;
      }
      return s ? {
        res: a,
        usedKey: a,
        exactUsedKey: a,
        usedLng: u,
        usedNS: r,
        usedParams: this.getUsedParamsDetails(t)
      } : a;
    }
    const f = this.resolve(e, t);
    let p = f == null ? void 0 : f.res;
    const g = (f == null ? void 0 : f.usedKey) || a, m = (f == null ? void 0 : f.exactUsedKey) || a, h = ["[object Number]", "[object Function]", "[object RegExp]"], x = t.joinArrays !== void 0 ? t.joinArrays : this.options.joinArrays, F = !this.i18nFormat || this.i18nFormat.handleAsObject, k = t.count !== void 0 && !V(t.count), N = qe.hasDefaultValue(t), A = k ? this.pluralResolver.getSuffix(u, t.count, t) : "", v = t.ordinal && k ? this.pluralResolver.getSuffix(u, t.count, {
      ordinal: !1
    }) : "", T = k && !t.ordinal && t.count === 0, $ = T && t[`defaultValue${this.options.pluralSeparator}zero`] || t[`defaultValue${A}`] || t[`defaultValue${v}`] || t.defaultValue;
    let w = p;
    F && !p && N && (w = $);
    const y = Mt(w), C = Object.prototype.toString.apply(w);
    if (F && w && y && h.indexOf(C) < 0 && !(V(x) && Array.isArray(w))) {
      if (!t.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const S = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(g, w, {
          ...t,
          ns: l
        }) : `key '${a} (${this.language})' returned an object instead of string.`;
        return s ? (f.res = S, f.usedParams = this.getUsedParamsDetails(t), f) : S;
      }
      if (i) {
        const S = Array.isArray(w), E = S ? [] : {}, I = S ? m : g;
        for (const M in w)
          if (Object.prototype.hasOwnProperty.call(w, M)) {
            const D = `${I}${i}${M}`;
            N && !p ? E[M] = this.translate(D, {
              ...t,
              defaultValue: Mt($) ? $[M] : void 0,
              joinArrays: !1,
              ns: l
            }) : E[M] = this.translate(D, {
              ...t,
              joinArrays: !1,
              ns: l
            }), E[M] === D && (E[M] = w[M]);
          }
        p = E;
      }
    } else if (F && V(x) && Array.isArray(p))
      p = p.join(x), p && (p = this.extendTranslation(p, e, t, o));
    else {
      let S = !1, E = !1;
      !this.isValidLookup(p) && N && (S = !0, p = $), this.isValidLookup(p) || (E = !0, p = a);
      const M = (t.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && E ? void 0 : p, D = N && $ !== p && this.options.updateMissing;
      if (E || S || D) {
        if (this.logger.log(D ? "updateKey" : "missingKey", u, r, a, D ? $ : p), i) {
          const K = this.resolve(a, {
            ...t,
            keySeparator: !1
          });
          K && K.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let J = [];
        const oe = this.languageUtils.getFallbackCodes(this.options.fallbackLng, t.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && oe && oe[0])
          for (let K = 0; K < oe.length; K++)
            J.push(oe[K]);
        else this.options.saveMissingTo === "all" ? J = this.languageUtils.toResolveHierarchy(t.lng || this.language) : J.push(t.lng || this.language);
        const re = (K, b, P) => {
          var j;
          const B = N && P !== p ? P : M;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(K, r, b, B, D, t) : (j = this.backendConnector) != null && j.saveMissing && this.backendConnector.saveMissing(K, r, b, B, D, t), this.emit("missingKey", K, r, b, p);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && k ? J.forEach((K) => {
          const b = this.pluralResolver.getSuffixes(K, t);
          T && t[`defaultValue${this.options.pluralSeparator}zero`] && b.indexOf(`${this.options.pluralSeparator}zero`) < 0 && b.push(`${this.options.pluralSeparator}zero`), b.forEach((P) => {
            re([K], a + P, t[`defaultValue${P}`] || $);
          });
        }) : re(J, a, $));
      }
      p = this.extendTranslation(p, e, t, f, o), E && p === a && this.options.appendNamespaceToMissingKey && (p = `${r}:${a}`), (E || S) && this.options.parseMissingKeyHandler && (p = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${r}:${a}` : a, S ? p : void 0));
    }
    return s ? (f.res = p, f.usedParams = this.getUsedParamsDetails(t), f) : p;
  }
  extendTranslation(e, t, o, s, i) {
    var u, d;
    var a = this;
    if ((u = this.i18nFormat) != null && u.parse)
      e = this.i18nFormat.parse(e, {
        ...this.options.interpolation.defaultVariables,
        ...o
      }, o.lng || this.language || s.usedLng, s.usedNS, s.usedKey, {
        resolved: s
      });
    else if (!o.skipInterpolation) {
      o.interpolation && this.interpolator.init({
        ...o,
        interpolation: {
          ...this.options.interpolation,
          ...o.interpolation
        }
      });
      const f = V(e) && (((d = o == null ? void 0 : o.interpolation) == null ? void 0 : d.skipOnVariables) !== void 0 ? o.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let p;
      if (f) {
        const m = e.match(this.interpolator.nestingRegexp);
        p = m && m.length;
      }
      let g = o.replace && !V(o.replace) ? o.replace : o;
      if (this.options.interpolation.defaultVariables && (g = {
        ...this.options.interpolation.defaultVariables,
        ...g
      }), e = this.interpolator.interpolate(e, g, o.lng || this.language || s.usedLng, o), f) {
        const m = e.match(this.interpolator.nestingRegexp), h = m && m.length;
        p < h && (o.nest = !1);
      }
      !o.lng && s && s.res && (o.lng = this.language || s.usedLng), o.nest !== !1 && (e = this.interpolator.nest(e, function() {
        for (var m = arguments.length, h = new Array(m), x = 0; x < m; x++)
          h[x] = arguments[x];
        return (i == null ? void 0 : i[0]) === h[0] && !o.context ? (a.logger.warn(`It seems you are nesting recursively key: ${h[0]} in key: ${t[0]}`), null) : a.translate(...h, t);
      }, o)), o.interpolation && this.interpolator.reset();
    }
    const l = o.postProcess || this.options.postProcess, r = V(l) ? [l] : l;
    return e != null && (r != null && r.length) && o.applyPostProcessor !== !1 && (e = Fn.handle(r, e, t, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...s,
        usedParams: this.getUsedParamsDetails(o)
      },
      ...o
    } : o, this)), e;
  }
  resolve(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o, s, i, a, l;
    return V(e) && (e = [e]), e.forEach((r) => {
      if (this.isValidLookup(o)) return;
      const u = this.extractFromKey(r, t), d = u.key;
      s = d;
      let f = u.namespaces;
      this.options.fallbackNS && (f = f.concat(this.options.fallbackNS));
      const p = t.count !== void 0 && !V(t.count), g = p && !t.ordinal && t.count === 0, m = t.context !== void 0 && (V(t.context) || typeof t.context == "number") && t.context !== "", h = t.lngs ? t.lngs : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng);
      f.forEach((x) => {
        var F, k;
        this.isValidLookup(o) || (l = x, !kt[`${h[0]}-${x}`] && ((F = this.utils) != null && F.hasLoadedNamespace) && !((k = this.utils) != null && k.hasLoadedNamespace(l)) && (kt[`${h[0]}-${x}`] = !0, this.logger.warn(`key "${s}" for languages "${h.join(", ")}" won't get resolved as namespace "${l}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), h.forEach((N) => {
          var T;
          if (this.isValidLookup(o)) return;
          a = N;
          const A = [d];
          if ((T = this.i18nFormat) != null && T.addLookupKeys)
            this.i18nFormat.addLookupKeys(A, d, N, x, t);
          else {
            let $;
            p && ($ = this.pluralResolver.getSuffix(N, t.count, t));
            const w = `${this.options.pluralSeparator}zero`, y = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (p && (A.push(d + $), t.ordinal && $.indexOf(y) === 0 && A.push(d + $.replace(y, this.options.pluralSeparator)), g && A.push(d + w)), m) {
              const C = `${d}${this.options.contextSeparator}${t.context}`;
              A.push(C), p && (A.push(C + $), t.ordinal && $.indexOf(y) === 0 && A.push(C + $.replace(y, this.options.pluralSeparator)), g && A.push(C + w));
            }
          }
          let v;
          for (; v = A.pop(); )
            this.isValidLookup(o) || (i = v, o = this.getResource(N, x, v, t));
        }));
      });
    }), {
      res: o,
      usedKey: s,
      exactUsedKey: i,
      usedLng: a,
      usedNS: l
    };
  }
  isValidLookup(e) {
    return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === "");
  }
  getResource(e, t, o) {
    var i;
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    return (i = this.i18nFormat) != null && i.getResource ? this.i18nFormat.getResource(e, t, o, s) : this.resourceStore.getResource(e, t, o, s);
  }
  getUsedParamsDetails() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const t = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], o = e.replace && !V(e.replace);
    let s = o ? e.replace : e;
    if (o && typeof e.count < "u" && (s.count = e.count), this.options.interpolation.defaultVariables && (s = {
      ...this.options.interpolation.defaultVariables,
      ...s
    }), !o) {
      s = {
        ...s
      };
      for (const i of t)
        delete s[i];
    }
    return s;
  }
  static hasDefaultValue(e) {
    const t = "defaultValue";
    for (const o in e)
      if (Object.prototype.hasOwnProperty.call(e, o) && t === o.substring(0, t.length) && e[o] !== void 0)
        return !0;
    return !1;
  }
}
class Ot {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = $e.create("languageUtils");
  }
  getScriptPartFromCode(e) {
    if (e = Ke(e), !e || e.indexOf("-") < 0) return null;
    const t = e.split("-");
    return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(t.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (e = Ke(e), !e || e.indexOf("-") < 0) return e;
    const t = e.split("-");
    return this.formatLanguageCode(t[0]);
  }
  formatLanguageCode(e) {
    if (V(e) && e.indexOf("-") > -1) {
      let t;
      try {
        t = Intl.getCanonicalLocales(e)[0];
      } catch {
      }
      return t && this.options.lowerCaseLng && (t = t.toLowerCase()), t || (this.options.lowerCaseLng ? e.toLowerCase() : e);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
  }
  isSupportedCode(e) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1;
  }
  getBestMatchFromCodes(e) {
    if (!e) return null;
    let t;
    return e.forEach((o) => {
      if (t) return;
      const s = this.formatLanguageCode(o);
      (!this.options.supportedLngs || this.isSupportedCode(s)) && (t = s);
    }), !t && this.options.supportedLngs && e.forEach((o) => {
      if (t) return;
      const s = this.getScriptPartFromCode(o);
      if (this.isSupportedCode(s)) return t = s;
      const i = this.getLanguagePartFromCode(o);
      if (this.isSupportedCode(i)) return t = i;
      t = this.options.supportedLngs.find((a) => {
        if (a === i) return a;
        if (!(a.indexOf("-") < 0 && i.indexOf("-") < 0) && (a.indexOf("-") > 0 && i.indexOf("-") < 0 && a.substring(0, a.indexOf("-")) === i || a.indexOf(i) === 0 && i.length > 1))
          return a;
      });
    }), t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]), t;
  }
  getFallbackCodes(e, t) {
    if (!e) return [];
    if (typeof e == "function" && (e = e(t)), V(e) && (e = [e]), Array.isArray(e)) return e;
    if (!t) return e.default || [];
    let o = e[t];
    return o || (o = e[this.getScriptPartFromCode(t)]), o || (o = e[this.formatLanguageCode(t)]), o || (o = e[this.getLanguagePartFromCode(t)]), o || (o = e.default), o || [];
  }
  toResolveHierarchy(e, t) {
    const o = this.getFallbackCodes(t || this.options.fallbackLng || [], e), s = [], i = (a) => {
      a && (this.isSupportedCode(a) ? s.push(a) : this.logger.warn(`rejecting language code not found in supportedLngs: ${a}`));
    };
    return V(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && i(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && i(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && i(this.getLanguagePartFromCode(e))) : V(e) && i(this.formatLanguageCode(e)), o.forEach((a) => {
      s.indexOf(a) < 0 && i(this.formatLanguageCode(a));
    }), s;
  }
}
const It = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, Dt = {
  select: (n) => n === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class Fo {
  constructor(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = e, this.options = t, this.logger = $e.create("pluralResolver"), this.pluralRulesCache = {};
  }
  addRule(e, t) {
    this.rules[e] = t;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const o = Ke(e === "dev" ? "en" : e), s = t.ordinal ? "ordinal" : "cardinal", i = JSON.stringify({
      cleanedCode: o,
      type: s
    });
    if (i in this.pluralRulesCache)
      return this.pluralRulesCache[i];
    let a;
    try {
      a = new Intl.PluralRules(o, {
        type: s
      });
    } catch {
      if (!Intl)
        return this.logger.error("No Intl support, please use an Intl polyfill!"), Dt;
      if (!e.match(/-|_/)) return Dt;
      const r = this.languageUtils.getLanguagePartFromCode(e);
      a = this.getRule(r, t);
    }
    return this.pluralRulesCache[i] = a, a;
  }
  needsPlural(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = this.getRule(e, t);
    return o || (o = this.getRule("dev", t)), (o == null ? void 0 : o.resolvedOptions().pluralCategories.length) > 1;
  }
  getPluralFormsOfKey(e, t) {
    let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(e, o).map((s) => `${t}${s}`);
  }
  getSuffixes(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = this.getRule(e, t);
    return o || (o = this.getRule("dev", t)), o ? o.resolvedOptions().pluralCategories.sort((s, i) => It[s] - It[i]).map((s) => `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ""}${s}`) : [];
  }
  getSuffix(e, t) {
    let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const s = this.getRule(e, o);
    return s ? `${this.options.prepend}${o.ordinal ? `ordinal${this.options.prepend}` : ""}${s.select(t)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", t, o));
  }
}
const Ut = function(n, e, t) {
  let o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".", s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = $o(n, e, t);
  return !i && s && V(t) && (i = ht(n, t, o), i === void 0 && (i = ht(e, t, o))), i;
}, ot = (n) => n.replace(/\$/g, "$$$$");
class Eo {
  constructor() {
    var t;
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = $e.create("interpolator"), this.options = e, this.format = ((t = e == null ? void 0 : e.interpolation) == null ? void 0 : t.format) || ((o) => o), this.init(e);
  }
  init() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    e.interpolation || (e.interpolation = {
      escapeValue: !0
    });
    const {
      escape: t,
      escapeValue: o,
      useRawValueToEscape: s,
      prefix: i,
      prefixEscaped: a,
      suffix: l,
      suffixEscaped: r,
      formatSeparator: u,
      unescapeSuffix: d,
      unescapePrefix: f,
      nestingPrefix: p,
      nestingPrefixEscaped: g,
      nestingSuffix: m,
      nestingSuffixEscaped: h,
      nestingOptionsSeparator: x,
      maxReplaces: F,
      alwaysFormat: k
    } = e.interpolation;
    this.escape = t !== void 0 ? t : wo, this.escapeValue = o !== void 0 ? o : !0, this.useRawValueToEscape = s !== void 0 ? s : !1, this.prefix = i ? Fe(i) : a || "{{", this.suffix = l ? Fe(l) : r || "}}", this.formatSeparator = u || ",", this.unescapePrefix = d ? "" : f || "-", this.unescapeSuffix = this.unescapePrefix ? "" : d || "", this.nestingPrefix = p ? Fe(p) : g || Fe("$t("), this.nestingSuffix = m ? Fe(m) : h || Fe(")"), this.nestingOptionsSeparator = x || ",", this.maxReplaces = F || 1e3, this.alwaysFormat = k !== void 0 ? k : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (t, o) => (t == null ? void 0 : t.source) === o ? (t.lastIndex = 0, t) : new RegExp(o, "g");
    this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(e, t, o, s) {
    var g;
    let i, a, l;
    const r = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, u = (m) => {
      if (m.indexOf(this.formatSeparator) < 0) {
        const k = Ut(t, r, m, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(k, void 0, o, {
          ...s,
          ...t,
          interpolationkey: m
        }) : k;
      }
      const h = m.split(this.formatSeparator), x = h.shift().trim(), F = h.join(this.formatSeparator).trim();
      return this.format(Ut(t, r, x, this.options.keySeparator, this.options.ignoreJSONStructure), F, o, {
        ...s,
        ...t,
        interpolationkey: x
      });
    };
    this.resetRegExp();
    const d = (s == null ? void 0 : s.missingInterpolationHandler) || this.options.missingInterpolationHandler, f = ((g = s == null ? void 0 : s.interpolation) == null ? void 0 : g.skipOnVariables) !== void 0 ? s.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (m) => ot(m)
    }, {
      regex: this.regexp,
      safeValue: (m) => this.escapeValue ? ot(this.escape(m)) : ot(m)
    }].forEach((m) => {
      for (l = 0; i = m.regex.exec(e); ) {
        const h = i[1].trim();
        if (a = u(h), a === void 0)
          if (typeof d == "function") {
            const F = d(e, i, s);
            a = V(F) ? F : "";
          } else if (s && Object.prototype.hasOwnProperty.call(s, h))
            a = "";
          else if (f) {
            a = i[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${h} for interpolating ${e}`), a = "";
        else !V(a) && !this.useRawValueToEscape && (a = zt(a));
        const x = m.safeValue(a);
        if (e = e.replace(i[0], x), f ? (m.regex.lastIndex += a.length, m.regex.lastIndex -= i[0].length) : m.regex.lastIndex = 0, l++, l >= this.maxReplaces)
          break;
      }
    }), e;
  }
  nest(e, t) {
    let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s, i, a;
    const l = (r, u) => {
      const d = this.nestingOptionsSeparator;
      if (r.indexOf(d) < 0) return r;
      const f = r.split(new RegExp(`${d}[ ]*{`));
      let p = `{${f[1]}`;
      r = f[0], p = this.interpolate(p, a);
      const g = p.match(/'/g), m = p.match(/"/g);
      (((g == null ? void 0 : g.length) ?? 0) % 2 === 0 && !m || m.length % 2 !== 0) && (p = p.replace(/'/g, '"'));
      try {
        a = JSON.parse(p), u && (a = {
          ...u,
          ...a
        });
      } catch (h) {
        return this.logger.warn(`failed parsing options string in nesting for key ${r}`, h), `${r}${d}${p}`;
      }
      return a.defaultValue && a.defaultValue.indexOf(this.prefix) > -1 && delete a.defaultValue, r;
    };
    for (; s = this.nestingRegexp.exec(e); ) {
      let r = [];
      a = {
        ...o
      }, a = a.replace && !V(a.replace) ? a.replace : a, a.applyPostProcessor = !1, delete a.defaultValue;
      let u = !1;
      if (s[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(s[1])) {
        const d = s[1].split(this.formatSeparator).map((f) => f.trim());
        s[1] = d.shift(), r = d, u = !0;
      }
      if (i = t(l.call(this, s[1].trim(), a), a), i && s[0] === e && !V(i)) return i;
      V(i) || (i = zt(i)), i || (this.logger.warn(`missed to resolve ${s[1]} for nesting ${e}`), i = ""), u && (i = r.reduce((d, f) => this.format(d, f, o.lng, {
        ...o,
        interpolationkey: s[1].trim()
      }), i.trim())), e = e.replace(s[0], i), this.regexp.lastIndex = 0;
    }
    return e;
  }
}
const Po = (n) => {
  let e = n.toLowerCase().trim();
  const t = {};
  if (n.indexOf("(") > -1) {
    const o = n.split("(");
    e = o[0].toLowerCase().trim();
    const s = o[1].substring(0, o[1].length - 1);
    e === "currency" && s.indexOf(":") < 0 ? t.currency || (t.currency = s.trim()) : e === "relativetime" && s.indexOf(":") < 0 ? t.range || (t.range = s.trim()) : s.split(";").forEach((a) => {
      if (a) {
        const [l, ...r] = a.split(":"), u = r.join(":").trim().replace(/^'+|'+$/g, ""), d = l.trim();
        t[d] || (t[d] = u), u === "false" && (t[d] = !1), u === "true" && (t[d] = !0), isNaN(u) || (t[d] = parseInt(u, 10));
      }
    });
  }
  return {
    formatName: e,
    formatOptions: t
  };
}, Ee = (n) => {
  const e = {};
  return (t, o, s) => {
    let i = s;
    s && s.interpolationkey && s.formatParams && s.formatParams[s.interpolationkey] && s[s.interpolationkey] && (i = {
      ...i,
      [s.interpolationkey]: void 0
    });
    const a = o + JSON.stringify(i);
    let l = e[a];
    return l || (l = n(Ke(o), s), e[a] = l), l(t);
  };
};
class zo {
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = $e.create("formatter"), this.options = e, this.formats = {
      number: Ee((t, o) => {
        const s = new Intl.NumberFormat(t, {
          ...o
        });
        return (i) => s.format(i);
      }),
      currency: Ee((t, o) => {
        const s = new Intl.NumberFormat(t, {
          ...o,
          style: "currency"
        });
        return (i) => s.format(i);
      }),
      datetime: Ee((t, o) => {
        const s = new Intl.DateTimeFormat(t, {
          ...o
        });
        return (i) => s.format(i);
      }),
      relativetime: Ee((t, o) => {
        const s = new Intl.RelativeTimeFormat(t, {
          ...o
        });
        return (i) => s.format(i, o.range || "day");
      }),
      list: Ee((t, o) => {
        const s = new Intl.ListFormat(t, {
          ...o
        });
        return (i) => s.format(i);
      })
    }, this.init(e);
  }
  init(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = t.interpolation.formatSeparator || ",";
  }
  add(e, t) {
    this.formats[e.toLowerCase().trim()] = t;
  }
  addCached(e, t) {
    this.formats[e.toLowerCase().trim()] = Ee(t);
  }
  format(e, t, o) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const i = t.split(this.formatSeparator);
    if (i.length > 1 && i[0].indexOf("(") > 1 && i[0].indexOf(")") < 0 && i.find((l) => l.indexOf(")") > -1)) {
      const l = i.findIndex((r) => r.indexOf(")") > -1);
      i[0] = [i[0], ...i.splice(1, l)].join(this.formatSeparator);
    }
    return i.reduce((l, r) => {
      var f;
      const {
        formatName: u,
        formatOptions: d
      } = Po(r);
      if (this.formats[u]) {
        let p = l;
        try {
          const g = ((f = s == null ? void 0 : s.formatParams) == null ? void 0 : f[s.interpolationkey]) || {}, m = g.locale || g.lng || s.locale || s.lng || o;
          p = this.formats[u](l, m, {
            ...d,
            ...s,
            ...g
          });
        } catch (g) {
          this.logger.warn(g);
        }
        return p;
      } else
        this.logger.warn(`there was no format function for ${u}`);
      return l;
    }, e);
  }
}
const To = (n, e) => {
  n.pending[e] !== void 0 && (delete n.pending[e], n.pendingCount--);
};
class Lo extends Xe {
  constructor(e, t, o) {
    var i, a;
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(), this.backend = e, this.store = t, this.services = o, this.languageUtils = o.languageUtils, this.options = s, this.logger = $e.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = s.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = s.maxRetries >= 0 ? s.maxRetries : 5, this.retryTimeout = s.retryTimeout >= 1 ? s.retryTimeout : 350, this.state = {}, this.queue = [], (a = (i = this.backend) == null ? void 0 : i.init) == null || a.call(i, o, s.backend, s);
  }
  queueLoad(e, t, o, s) {
    const i = {}, a = {}, l = {}, r = {};
    return e.forEach((u) => {
      let d = !0;
      t.forEach((f) => {
        const p = `${u}|${f}`;
        !o.reload && this.store.hasResourceBundle(u, f) ? this.state[p] = 2 : this.state[p] < 0 || (this.state[p] === 1 ? a[p] === void 0 && (a[p] = !0) : (this.state[p] = 1, d = !1, a[p] === void 0 && (a[p] = !0), i[p] === void 0 && (i[p] = !0), r[f] === void 0 && (r[f] = !0)));
      }), d || (l[u] = !0);
    }), (Object.keys(i).length || Object.keys(a).length) && this.queue.push({
      pending: a,
      pendingCount: Object.keys(a).length,
      loaded: {},
      errors: [],
      callback: s
    }), {
      toLoad: Object.keys(i),
      pending: Object.keys(a),
      toLoadLanguages: Object.keys(l),
      toLoadNamespaces: Object.keys(r)
    };
  }
  loaded(e, t, o) {
    const s = e.split("|"), i = s[0], a = s[1];
    t && this.emit("failedLoading", i, a, t), !t && o && this.store.addResourceBundle(i, a, o, void 0, void 0, {
      skipCopy: !0
    }), this.state[e] = t ? -1 : 2, t && o && (this.state[e] = 0);
    const l = {};
    this.queue.forEach((r) => {
      vo(r.loaded, [i], a), To(r, e), t && r.errors.push(t), r.pendingCount === 0 && !r.done && (Object.keys(r.loaded).forEach((u) => {
        l[u] || (l[u] = {});
        const d = r.loaded[u];
        d.length && d.forEach((f) => {
          l[u][f] === void 0 && (l[u][f] = !0);
        });
      }), r.done = !0, r.errors.length ? r.callback(r.errors) : r.callback());
    }), this.emit("loaded", l), this.queue = this.queue.filter((r) => !r.done);
  }
  read(e, t, o) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout, a = arguments.length > 5 ? arguments[5] : void 0;
    if (!e.length) return a(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e,
        ns: t,
        fcName: o,
        tried: s,
        wait: i,
        callback: a
      });
      return;
    }
    this.readingCalls++;
    const l = (u, d) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const f = this.waitingReads.shift();
        this.read(f.lng, f.ns, f.fcName, f.tried, f.wait, f.callback);
      }
      if (u && d && s < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, t, o, s + 1, i * 2, a);
        }, i);
        return;
      }
      a(u, d);
    }, r = this.backend[o].bind(this.backend);
    if (r.length === 2) {
      try {
        const u = r(e, t);
        u && typeof u.then == "function" ? u.then((d) => l(null, d)).catch(l) : l(null, u);
      } catch (u) {
        l(u);
      }
      return;
    }
    return r(e, t, l);
  }
  prepareLoading(e, t) {
    let o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), s && s();
    V(e) && (e = this.languageUtils.toResolveHierarchy(e)), V(t) && (t = [t]);
    const i = this.queueLoad(e, t, o, s);
    if (!i.toLoad.length)
      return i.pending.length || s(), null;
    i.toLoad.forEach((a) => {
      this.loadOne(a);
    });
  }
  load(e, t, o) {
    this.prepareLoading(e, t, {}, o);
  }
  reload(e, t, o) {
    this.prepareLoading(e, t, {
      reload: !0
    }, o);
  }
  loadOne(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const o = e.split("|"), s = o[0], i = o[1];
    this.read(s, i, "read", void 0, void 0, (a, l) => {
      a && this.logger.warn(`${t}loading namespace ${i} for language ${s} failed`, a), !a && l && this.logger.log(`${t}loaded namespace ${i} for language ${s}`, l), this.loaded(e, a, l);
    });
  }
  saveMissing(e, t, o, s, i) {
    var r, u, d, f, p;
    let a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {}, l = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if ((u = (r = this.services) == null ? void 0 : r.utils) != null && u.hasLoadedNamespace && !((f = (d = this.services) == null ? void 0 : d.utils) != null && f.hasLoadedNamespace(t))) {
      this.logger.warn(`did not save key "${o}" as the namespace "${t}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(o == null || o === "")) {
      if ((p = this.backend) != null && p.create) {
        const g = {
          ...a,
          isUpdate: i
        }, m = this.backend.create.bind(this.backend);
        if (m.length < 6)
          try {
            let h;
            m.length === 5 ? h = m(e, t, o, s, g) : h = m(e, t, o, s), h && typeof h.then == "function" ? h.then((x) => l(null, x)).catch(l) : l(null, h);
          } catch (h) {
            l(h);
          }
        else
          m(e, t, o, s, l, g);
      }
      !e || !e[0] || this.store.addResource(e[0], t, o, s);
    }
  }
}
const jt = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (n) => {
    let e = {};
    if (typeof n[1] == "object" && (e = n[1]), V(n[1]) && (e.defaultValue = n[1]), V(n[2]) && (e.tDescription = n[2]), typeof n[2] == "object" || typeof n[3] == "object") {
      const t = n[3] || n[2];
      Object.keys(t).forEach((o) => {
        e[o] = t[o];
      });
    }
    return e;
  },
  interpolation: {
    escapeValue: !0,
    format: (n) => n,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  }
}), Ht = (n) => {
  var e, t;
  return V(n.ns) && (n.ns = [n.ns]), V(n.fallbackLng) && (n.fallbackLng = [n.fallbackLng]), V(n.fallbackNS) && (n.fallbackNS = [n.fallbackNS]), ((t = (e = n.supportedLngs) == null ? void 0 : e.indexOf) == null ? void 0 : t.call(e, "cimode")) < 0 && (n.supportedLngs = n.supportedLngs.concat(["cimode"])), typeof n.initImmediate == "boolean" && (n.initAsync = n.initImmediate), n;
}, De = () => {
}, Ao = (n) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(n)).forEach((t) => {
    typeof n[t] == "function" && (n[t] = n[t].bind(n));
  });
};
class Me extends Xe {
  constructor() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0;
    if (super(), this.options = Ht(e), this.services = {}, this.logger = $e, this.modules = {
      external: []
    }, Ao(this), t && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync)
        return this.init(e, t), this;
      setTimeout(() => {
        this.init(e, t);
      }, 0);
    }
  }
  init() {
    var e = this;
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    this.isInitializing = !0, typeof t == "function" && (o = t, t = {}), t.defaultNS == null && t.ns && (V(t.ns) ? t.defaultNS = t.ns : t.ns.indexOf("translation") < 0 && (t.defaultNS = t.ns[0]));
    const s = jt();
    this.options = {
      ...s,
      ...this.options,
      ...Ht(t)
    }, this.options.interpolation = {
      ...s.interpolation,
      ...this.options.interpolation
    }, t.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = t.keySeparator), t.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = t.nsSeparator);
    const i = (d) => d ? typeof d == "function" ? new d() : d : null;
    if (!this.options.isClone) {
      this.modules.logger ? $e.init(i(this.modules.logger), this.options) : $e.init(null, this.options);
      let d;
      this.modules.formatter ? d = this.modules.formatter : d = zo;
      const f = new Ot(this.options);
      this.store = new Rt(this.options.resources, this.options);
      const p = this.services;
      p.logger = $e, p.resourceStore = this.store, p.languageUtils = f, p.pluralResolver = new Fo(f, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), d && (!this.options.interpolation.format || this.options.interpolation.format === s.interpolation.format) && (p.formatter = i(d), p.formatter.init(p, this.options), this.options.interpolation.format = p.formatter.format.bind(p.formatter)), p.interpolator = new Eo(this.options), p.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, p.backendConnector = new Lo(i(this.modules.backend), p.resourceStore, p, this.options), p.backendConnector.on("*", function(g) {
        for (var m = arguments.length, h = new Array(m > 1 ? m - 1 : 0), x = 1; x < m; x++)
          h[x - 1] = arguments[x];
        e.emit(g, ...h);
      }), this.modules.languageDetector && (p.languageDetector = i(this.modules.languageDetector), p.languageDetector.init && p.languageDetector.init(p, this.options.detection, this.options)), this.modules.i18nFormat && (p.i18nFormat = i(this.modules.i18nFormat), p.i18nFormat.init && p.i18nFormat.init(this)), this.translator = new qe(this.services, this.options), this.translator.on("*", function(g) {
        for (var m = arguments.length, h = new Array(m > 1 ? m - 1 : 0), x = 1; x < m; x++)
          h[x - 1] = arguments[x];
        e.emit(g, ...h);
      }), this.modules.external.forEach((g) => {
        g.init && g.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, o || (o = De), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const d = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      d.length > 0 && d[0] !== "dev" && (this.options.lng = d[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((d) => {
      this[d] = function() {
        return e.store[d](...arguments);
      };
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((d) => {
      this[d] = function() {
        return e.store[d](...arguments), e;
      };
    });
    const r = Ae(), u = () => {
      const d = (f, p) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), r.resolve(p), o(f, p);
      };
      if (this.languages && !this.isInitialized) return d(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, d);
    };
    return this.options.resources || !this.options.initAsync ? u() : setTimeout(u, 0), r;
  }
  loadResources(e) {
    var i, a;
    let o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : De;
    const s = V(e) ? e : this.language;
    if (typeof e == "function" && (o = e), !this.options.resources || this.options.partialBundledLanguages) {
      if ((s == null ? void 0 : s.toLowerCase()) === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return o();
      const l = [], r = (u) => {
        if (!u || u === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(u).forEach((f) => {
          f !== "cimode" && l.indexOf(f) < 0 && l.push(f);
        });
      };
      s ? r(s) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((d) => r(d)), (a = (i = this.options.preload) == null ? void 0 : i.forEach) == null || a.call(i, (u) => r(u)), this.services.backendConnector.load(l, this.options.ns, (u) => {
        !u && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), o(u);
      });
    } else
      o(null);
  }
  reloadResources(e, t, o) {
    const s = Ae();
    return typeof e == "function" && (o = e, e = void 0), typeof t == "function" && (o = t, t = void 0), e || (e = this.languages), t || (t = this.options.ns), o || (o = De), this.services.backendConnector.reload(e, t, (i) => {
      s.resolve(), o(i);
    }), s;
  }
  use(e) {
    if (!e) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!e.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return e.type === "backend" && (this.modules.backend = e), (e.type === "logger" || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === "languageDetector" && (this.modules.languageDetector = e), e.type === "i18nFormat" && (this.modules.i18nFormat = e), e.type === "postProcessor" && Fn.addPostProcessor(e), e.type === "formatter" && (this.modules.formatter = e), e.type === "3rdParty" && this.modules.external.push(e), this;
  }
  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(["cimode", "dev"].indexOf(e) > -1))
      for (let t = 0; t < this.languages.length; t++) {
        const o = this.languages[t];
        if (!(["cimode", "dev"].indexOf(o) > -1) && this.store.hasLanguageSomeTranslations(o)) {
          this.resolvedLanguage = o;
          break;
        }
      }
  }
  changeLanguage(e, t) {
    var o = this;
    this.isLanguageChangingTo = e;
    const s = Ae();
    this.emit("languageChanging", e);
    const i = (r) => {
      this.language = r, this.languages = this.services.languageUtils.toResolveHierarchy(r), this.resolvedLanguage = void 0, this.setResolvedLanguage(r);
    }, a = (r, u) => {
      u ? this.isLanguageChangingTo === e && (i(u), this.translator.changeLanguage(u), this.isLanguageChangingTo = void 0, this.emit("languageChanged", u), this.logger.log("languageChanged", u)) : this.isLanguageChangingTo = void 0, s.resolve(function() {
        return o.t(...arguments);
      }), t && t(r, function() {
        return o.t(...arguments);
      });
    }, l = (r) => {
      var d, f;
      !e && !r && this.services.languageDetector && (r = []);
      const u = this.services.languageUtils.getBestMatchFromCodes(V(r) ? [r] : r);
      u && (this.language || i(u), this.translator.language || this.translator.changeLanguage(u), (f = (d = this.services.languageDetector) == null ? void 0 : d.cacheUserLanguage) == null || f.call(d, u)), this.loadResources(u, (p) => {
        a(p, u);
      });
    };
    return !e && this.services.languageDetector && !this.services.languageDetector.async ? l(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(l) : this.services.languageDetector.detect(l) : l(e), s;
  }
  getFixedT(e, t, o) {
    var s = this;
    const i = function(a, l) {
      let r;
      if (typeof l != "object") {
        for (var u = arguments.length, d = new Array(u > 2 ? u - 2 : 0), f = 2; f < u; f++)
          d[f - 2] = arguments[f];
        r = s.options.overloadTranslationOptionHandler([a, l].concat(d));
      } else
        r = {
          ...l
        };
      r.lng = r.lng || i.lng, r.lngs = r.lngs || i.lngs, r.ns = r.ns || i.ns, r.keyPrefix !== "" && (r.keyPrefix = r.keyPrefix || o || i.keyPrefix);
      const p = s.options.keySeparator || ".";
      let g;
      return r.keyPrefix && Array.isArray(a) ? g = a.map((m) => `${r.keyPrefix}${p}${m}`) : g = r.keyPrefix ? `${r.keyPrefix}${p}${a}` : a, s.t(g, r);
    };
    return V(e) ? i.lng = e : i.lngs = e, i.ns = t, i.keyPrefix = o, i;
  }
  t() {
    var s;
    for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
      t[o] = arguments[o];
    return (s = this.translator) == null ? void 0 : s.translate(...t);
  }
  exists() {
    var s;
    for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++)
      t[o] = arguments[o];
    return (s = this.translator) == null ? void 0 : s.exists(...t);
  }
  setDefaultNamespace(e) {
    this.options.defaultNS = e;
  }
  hasLoadedNamespace(e) {
    let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const o = t.lng || this.resolvedLanguage || this.languages[0], s = this.options ? this.options.fallbackLng : !1, i = this.languages[this.languages.length - 1];
    if (o.toLowerCase() === "cimode") return !0;
    const a = (l, r) => {
      const u = this.services.backendConnector.state[`${l}|${r}`];
      return u === -1 || u === 0 || u === 2;
    };
    if (t.precheck) {
      const l = t.precheck(this, a);
      if (l !== void 0) return l;
    }
    return !!(this.hasResourceBundle(o, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || a(o, e) && (!s || a(i, e)));
  }
  loadNamespaces(e, t) {
    const o = Ae();
    return this.options.ns ? (V(e) && (e = [e]), e.forEach((s) => {
      this.options.ns.indexOf(s) < 0 && this.options.ns.push(s);
    }), this.loadResources((s) => {
      o.resolve(), t && t(s);
    }), o) : (t && t(), Promise.resolve());
  }
  loadLanguages(e, t) {
    const o = Ae();
    V(e) && (e = [e]);
    const s = this.options.preload || [], i = e.filter((a) => s.indexOf(a) < 0 && this.services.languageUtils.isSupportedCode(a));
    return i.length ? (this.options.preload = s.concat(i), this.loadResources((a) => {
      o.resolve(), t && t(a);
    }), o) : (t && t(), Promise.resolve());
  }
  dir(e) {
    var s, i;
    if (e || (e = this.resolvedLanguage || (((s = this.languages) == null ? void 0 : s.length) > 0 ? this.languages[0] : this.language)), !e) return "rtl";
    const t = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], o = ((i = this.services) == null ? void 0 : i.languageUtils) || new Ot(jt());
    return t.indexOf(o.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0;
    return new Me(e, t);
  }
  cloneInstance() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : De;
    const o = e.forkResourceStore;
    o && delete e.forkResourceStore;
    const s = {
      ...this.options,
      ...e,
      isClone: !0
    }, i = new Me(s);
    if ((e.debug !== void 0 || e.prefix !== void 0) && (i.logger = i.logger.clone(e)), ["store", "services", "language"].forEach((l) => {
      i[l] = this[l];
    }), i.services = {
      ...this.services
    }, i.services.utils = {
      hasLoadedNamespace: i.hasLoadedNamespace.bind(i)
    }, o) {
      const l = Object.keys(this.store.data).reduce((r, u) => (r[u] = {
        ...this.store.data[u]
      }, Object.keys(r[u]).reduce((d, f) => (d[f] = {
        ...r[u][f]
      }, d), {})), {});
      i.store = new Rt(l, s), i.services.resourceStore = i.store;
    }
    return i.translator = new qe(i.services, s), i.translator.on("*", function(l) {
      for (var r = arguments.length, u = new Array(r > 1 ? r - 1 : 0), d = 1; d < r; d++)
        u[d - 1] = arguments[d];
      i.emit(l, ...u);
    }), i.init(s, t), i.translator.options = s, i.translator.backendConnector.services.utils = {
      hasLoadedNamespace: i.hasLoadedNamespace.bind(i)
    }, i;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const se = Me.createInstance();
se.createInstance = Me.createInstance;
se.createInstance;
se.dir;
se.init;
se.loadResources;
se.reloadResources;
se.use;
se.changeLanguage;
se.getFixedT;
se.t;
se.exists;
se.setDefaultNamespace;
se.hasLoadedNamespace;
se.loadNamespaces;
se.loadLanguages;
const Ro = "مجلد جديد", ko = "رفع", Mo = "لصق", Oo = "تغيير العرض", Io = "تحديث", Do = "قص", Uo = "نسخ", jo = "إعادة تسمية", Ho = "تنزيل", Vo = "تم تحديد العنصر", Bo = "تم تحديد {{count}} عناصر", Wo = "إلغاء", Yo = "مسح التحديد", Ko = "تم", _o = "إذا قمت بتغيير امتداد الملف، قد يصبح الملف غير قابل للاستخدام. هل أنت متأكد من أنك تريد تغييره؟", qo = "لا", Go = "نعم", Jo = "إغلاق", Zo = "نوع الملف غير مسموح به.", Xo = "الملف موجود بالفعل.", Qo = "أقصى حجم رفع هو", es = "اسحب الملفات للرفع", ts = "اختيار ملف", ns = "فشل الرفع.", os = "جاري الرفع", ss = "تم الرفع", is = "إزالة", as = "إلغاء الرفع", rs = "معاينة", ls = "آسف! المعاينة غير متاحة لهذا الملف.", cs = "الصفحة الرئيسية", ds = "عرض المزيد من المجلدات", us = "نقل إلى", ps = "هذا المجلد فارغ.", fs = "تحديد الكل", hs = "عرض", ms = "شبكة", gs = "قائمة", vs = "فتح", $s = "لا شيء هنا بعد", ys = "الاسم", ws = "تاريخ التعديل", bs = "الحجم", xs = 'هل أنت متأكد أنك تريد حذف "{{fileName}}"؟', Cs = "هل أنت متأكد أنك تريد حذف هذه العناصر {{count}}؟", Ss = "{{percent}}% تم", Ns = "تم الإلغاء", Fs = 'لا يمكن أن يحتوي اسم الملف على أي من الحروف التالية: \\ / : * ? " < > |', Es = 'هذا الموقع يحتوي بالفعل على مجلد باسم "{{renameFile}}".', Ps = "طي لوحة التنقل", zs = "توسيع لوحة التنقل", Ts = {
  newFolder: Ro,
  upload: ko,
  paste: Mo,
  changeView: Oo,
  refresh: Io,
  cut: Do,
  copy: Uo,
  rename: jo,
  download: Ho,
  delete: "حذف",
  itemSelected: Vo,
  itemsSelected: Bo,
  cancel: Wo,
  clearSelection: Yo,
  completed: Ko,
  fileNameChangeWarning: _o,
  no: qo,
  yes: Go,
  close: Jo,
  fileTypeNotAllowed: Zo,
  fileAlreadyExist: Xo,
  maxUploadSize: Qo,
  dragFileToUpload: es,
  chooseFile: ts,
  uploadFail: ns,
  uploading: os,
  uploaded: ss,
  remove: is,
  abortUpload: as,
  preview: rs,
  previewUnavailable: ls,
  home: cs,
  showMoreFolder: ds,
  moveTo: us,
  folderEmpty: ps,
  selectAll: fs,
  view: hs,
  grid: ms,
  list: gs,
  open: vs,
  nothingHereYet: $s,
  name: ys,
  modified: ws,
  size: bs,
  deleteItemConfirm: xs,
  deleteItemsConfirm: Cs,
  percentDone: Ss,
  canceled: Ns,
  invalidFileName: Fs,
  folderExists: Es,
  collapseNavigationPane: Ps,
  expandNavigationPane: zs
}, Ls = "Neuer Ordner", As = "Hochladen", Rs = "Einfügen", ks = "Ansicht ändern", Ms = "Aktualisieren", Os = "Ausschneiden", Is = "Kopieren", Ds = "Umbenennen", Us = "Herunterladen", js = "Element ausgewählt", Hs = "Elemente ausgewählt", Vs = "Abbrechen", Bs = "Auswahl aufheben", Ws = "Abgeschlossen", Ys = "Wenn Sie die Dateierweiterung ändern, kann die Datei unbrauchbar werden. Möchten Sie das wirklich tun?", Ks = "Nein", _s = "Ja", qs = "Schließen", Gs = "Dateityp nicht erlaubt.", Js = "Datei existiert bereits.", Zs = "Maximale Uploadgröße ist", Xs = "Dateien zum Hochladen ziehen", Qs = "Datei auswählen", ei = "Hochladen fehlgeschlagen.", ti = "Wird hochgeladen", ni = "Hochgeladen", oi = "Entfernen", si = "Upload abbrechen", ii = "Vorschau", ai = "Leider ist keine Vorschau für diese Datei verfügbar.", ri = "Startseite", li = "Mehr Ordner anzeigen", ci = "Verschieben nach", di = "Dieser Ordner ist leer.", ui = "Alle auswählen", pi = "Ansicht", fi = "Raster", hi = "Liste", mi = "Öffnen", gi = "Hier ist noch nichts", vi = "Name", $i = "Geändert", yi = "Größe", wi = 'Möchten Sie "{{fileName}}" wirklich löschen?', bi = "Möchten Sie diese {{count}} Elemente wirklich löschen?", xi = "{{percent}}% erledigt", Ci = "Abgebrochen", Si = 'Ein Dateiname darf keines der folgenden Zeichen enthalten: \\ / : * ? " < > |', Ni = 'In diesem Zielordner gibt es bereits einen Ordner namens "{{renameFile}}".', Fi = "Navigationsbereich einklappen", Ei = "Navigationsbereich erweitern", Pi = {
  newFolder: Ls,
  upload: As,
  paste: Rs,
  changeView: ks,
  refresh: Ms,
  cut: Os,
  copy: Is,
  rename: Ds,
  download: Us,
  delete: "Löschen",
  itemSelected: js,
  itemsSelected: Hs,
  cancel: Vs,
  clearSelection: Bs,
  completed: Ws,
  fileNameChangeWarning: Ys,
  no: Ks,
  yes: _s,
  close: qs,
  fileTypeNotAllowed: Gs,
  fileAlreadyExist: Js,
  maxUploadSize: Zs,
  dragFileToUpload: Xs,
  chooseFile: Qs,
  uploadFail: ei,
  uploading: ti,
  uploaded: ni,
  remove: oi,
  abortUpload: si,
  preview: ii,
  previewUnavailable: ai,
  home: ri,
  showMoreFolder: li,
  moveTo: ci,
  folderEmpty: di,
  selectAll: ui,
  view: pi,
  grid: fi,
  list: hi,
  open: mi,
  nothingHereYet: gi,
  name: vi,
  modified: $i,
  size: yi,
  deleteItemConfirm: wi,
  deleteItemsConfirm: bi,
  percentDone: xi,
  canceled: Ci,
  invalidFileName: Si,
  folderExists: Ni,
  collapseNavigationPane: Fi,
  expandNavigationPane: Ei
}, zi = "New Folder", Ti = "Upload", Li = "Paste", Ai = "Change View", Ri = "Refresh", ki = "Cut", Mi = "Copy", Oi = "Rename", Ii = "Download", Di = "item selected", Ui = "items selected", ji = "Cancel", Hi = "Clear Selection", Vi = "Completed", Bi = "If you change a file name extension, the file might become unusable. Are you sure you want to change it?", Wi = "No", Yi = "Yes", Ki = "Close", _i = "File type is not allowed.", qi = "File already exists.", Gi = "Maximum upload size is", Ji = "Drag files to upload", Zi = "Choose File", Xi = "Upload failed.", Qi = "Uploading", ea = "Uploaded", ta = "Remove", na = "Abort Upload", oa = "Preview", sa = "Sorry! Preview is not available for this file.", ia = "Home", aa = "Show more folders", ra = "Move to", la = "This folder is empty.", ca = "Select all", da = "View", ua = "Grid", pa = "List", fa = "Open", ha = "Nothing here yet", ma = "Name", ga = "Modified", va = "Size", $a = 'Are you sure you want to delete "{{fileName}}"?', ya = "Are you sure you want to delete these {{count}} items?", wa = "{{percent}}% done", ba = "Canceled", xa = `A file name can't contain any of the following characters: \\ / : * ? " < > |`, Ca = 'This destination already contains a folder named "{{renameFile}}".', Sa = "Collapse Navigation Pane", Na = "Expand Navigation Pane", Fa = "Compress", Ea = "Extract", Pa = "Archive name", za = "Compress the selected items into a zip archive.", Ta = "Please provide a name for the archive.", La = 'An item named "{{name}}" already exists in this folder.', Aa = 'Extract "{{fileName}}" into the current folder?', Ra = {
  newFolder: zi,
  upload: Ti,
  paste: Li,
  changeView: Ai,
  refresh: Ri,
  cut: ki,
  copy: Mi,
  rename: Oi,
  download: Ii,
  delete: "Delete",
  itemSelected: Di,
  itemsSelected: Ui,
  cancel: ji,
  clearSelection: Hi,
  completed: Vi,
  fileNameChangeWarning: Bi,
  no: Wi,
  yes: Yi,
  close: Ki,
  fileTypeNotAllowed: _i,
  fileAlreadyExist: qi,
  maxUploadSize: Gi,
  dragFileToUpload: Ji,
  chooseFile: Zi,
  uploadFail: Xi,
  uploading: Qi,
  uploaded: ea,
  remove: ta,
  abortUpload: na,
  preview: oa,
  previewUnavailable: sa,
  home: ia,
  showMoreFolder: aa,
  moveTo: ra,
  folderEmpty: la,
  selectAll: ca,
  view: da,
  grid: ua,
  list: pa,
  open: fa,
  nothingHereYet: ha,
  name: ma,
  modified: ga,
  size: va,
  deleteItemConfirm: $a,
  deleteItemsConfirm: ya,
  percentDone: wa,
  canceled: ba,
  invalidFileName: xa,
  folderExists: Ca,
  collapseNavigationPane: Sa,
  expandNavigationPane: Na,
  compress: Fa,
  extract: Ea,
  zipName: Pa,
  compressSelectionDescription: za,
  zipNameRequired: Ta,
  zipAlreadyExists: La,
  extractDescription: Aa
}, ka = "Nueva carpeta", Ma = "Subir", Oa = "Pegar", Ia = "Cambiar vista", Da = "Actualizar", Ua = "Cortar", ja = "Copiar", Ha = "Renombrar", Va = "Descargar", Ba = "elemento seleccionado", Wa = "elementos seleccionados", Ya = "Cancelar", Ka = "Borrar selección", _a = "Completado", qa = "Si cambia la extensión del archivo, es posible que no funcione. ¿Está seguro de que desea cambiarla?", Ga = "No", Ja = "Sí", Za = "Cerrar", Xa = "Tipo de archivo no permitido.", Qa = "El archivo ya existe.", er = "El tamaño máximo de subida es", tr = "Arrastre archivos para subir", nr = "Elegir archivo", or = "Error al subir.", sr = "Subiendo", ir = "Subido", ar = "Eliminar", rr = "Cancelar subida", lr = "Vista previa", cr = "¡Lo sentimos! No hay vista previa disponible para este archivo.", dr = "Inicio", ur = "Mostrar más carpetas", pr = "Mover a", fr = "Esta carpeta está vacía.", hr = "Seleccionar todo", mr = "Vista", gr = "Cuadrícula", vr = "Lista", $r = "Abrir", yr = "Nada por aquí aún", wr = "Nombre", br = "Modificado", xr = "Tamaño", Cr = '¿Está seguro de que desea eliminar "{{fileName}}"?', Sr = "¿Está seguro de que desea eliminar estos {{count}} elementos?", Nr = "{{percent}}% completado", Fr = "Cancelado", Er = 'Un nombre de archivo no puede contener ninguno de los siguientes caracteres: \\ / : * ? " < > |', Pr = 'Ya existe una carpeta llamada "{{renameFile}}" en este destino.', zr = "Contraer panel de navegación", Tr = "Expandir panel de navegación", Lr = {
  newFolder: ka,
  upload: Ma,
  paste: Oa,
  changeView: Ia,
  refresh: Da,
  cut: Ua,
  copy: ja,
  rename: Ha,
  download: Va,
  delete: "Eliminar",
  itemSelected: Ba,
  itemsSelected: Wa,
  cancel: Ya,
  clearSelection: Ka,
  completed: _a,
  fileNameChangeWarning: qa,
  no: Ga,
  yes: Ja,
  close: Za,
  fileTypeNotAllowed: Xa,
  fileAlreadyExist: Qa,
  maxUploadSize: er,
  dragFileToUpload: tr,
  chooseFile: nr,
  uploadFail: or,
  uploading: sr,
  uploaded: ir,
  remove: ar,
  abortUpload: rr,
  preview: lr,
  previewUnavailable: cr,
  home: dr,
  showMoreFolder: ur,
  moveTo: pr,
  folderEmpty: fr,
  selectAll: hr,
  view: mr,
  grid: gr,
  list: vr,
  open: $r,
  nothingHereYet: yr,
  name: wr,
  modified: br,
  size: xr,
  deleteItemConfirm: Cr,
  deleteItemsConfirm: Sr,
  percentDone: Nr,
  canceled: Fr,
  invalidFileName: Er,
  folderExists: Pr,
  collapseNavigationPane: zr,
  expandNavigationPane: Tr
}, Ar = "پوشه جدید", Rr = "بارگذاری", kr = "الحاق", Mr = "تغییر نمایش", Or = "بازخوانی", Ir = "برش", Dr = "کپی", Ur = "تغییر نام", jr = "دانلود", Hr = "مورد انتخاب شده", Vr = "مورد انتخاب شده", Br = "لغو", Wr = "پاک کردن انتخاب", Yr = "تکمیل شد", Kr = "اگر پسوند نام فایل را تغییر دهید، ممکن است فایل غیرقابل استفاده شود. آیا مطمئن هستید که می‌خواهید آن را تغییر دهید؟", _r = "خیر", qr = "بله", Gr = "بستن", Jr = "نوع فایل مجاز نیست.", Zr = "فایل از قبل موجود است.", Xr = "حداکثر اندازه بارگذاری", Qr = "فایل‌ها را برای بارگذاری بکشید", el = "انتخاب فایل", tl = "بارگذاری ناموفق بود.", nl = "در حال بارگذاری", ol = "بارگذاری شد", sl = "حذف", il = "لغو بارگذاری", al = "پیش‌نمایش", rl = "متأسفیم! پیش‌نمایش برای این فایل در دسترس نیست.", ll = "خانه", cl = "نمایش پوشه‌های بیشتر", dl = "انتقال به", ul = "این پوشه خالی است.", pl = "انتخاب همه", fl = "نمایش", hl = "شبکه‌ای", ml = "لیستی", gl = "باز کردن", vl = "هنوز چیزی اینجا نیست", $l = "نام", yl = "تغییر یافته", wl = "اندازه", bl = 'آیا مطمئن هستید که می‌خواهید "{{fileName}}" را حذف کنید؟', xl = "آیا مطمئن هستید که می‌خواهید این {{count}} مورد را حذف کنید؟", Cl = "{{percent}}% انجام شد", Sl = "لغو شد", Nl = 'نام فایل نمی‌تواند شامل هیچ یک از کاراکترهای زیر باشد: \\ / : * ? " < > |', Fl = 'این مقصد از قبل شامل پوشه‌ای به نام "{{renameFile}}" است.', El = "بستن پنل ناوبری", Pl = "باز کردن پنل ناوبری", zl = {
  newFolder: Ar,
  upload: Rr,
  paste: kr,
  changeView: Mr,
  refresh: Or,
  cut: Ir,
  copy: Dr,
  rename: Ur,
  download: jr,
  delete: "حذف",
  itemSelected: Hr,
  itemsSelected: Vr,
  cancel: Br,
  clearSelection: Wr,
  completed: Yr,
  fileNameChangeWarning: Kr,
  no: _r,
  yes: qr,
  close: Gr,
  fileTypeNotAllowed: Jr,
  fileAlreadyExist: Zr,
  maxUploadSize: Xr,
  dragFileToUpload: Qr,
  chooseFile: el,
  uploadFail: tl,
  uploading: nl,
  uploaded: ol,
  remove: sl,
  abortUpload: il,
  preview: al,
  previewUnavailable: rl,
  home: ll,
  showMoreFolder: cl,
  moveTo: dl,
  folderEmpty: ul,
  selectAll: pl,
  view: fl,
  grid: hl,
  list: ml,
  open: gl,
  nothingHereYet: vl,
  name: $l,
  modified: yl,
  size: wl,
  deleteItemConfirm: bl,
  deleteItemsConfirm: xl,
  percentDone: Cl,
  canceled: Sl,
  invalidFileName: Nl,
  folderExists: Fl,
  collapseNavigationPane: El,
  expandNavigationPane: Pl
}, Tl = "Nouveau dossier", Ll = "Téléverser", Al = "Coller", Rl = "Changer la vue", kl = "Rafraîchir", Ml = "Couper", Ol = "Copier", Il = "Renommer", Dl = "Télécharger", Ul = "élément sélectionné", jl = "éléments sélectionnés", Hl = "Annuler", Vl = "Effacer la sélection", Bl = "Terminé", Wl = "Si vous modifiez l'extension d'un fichier, celui-ci pourrait devenir inutilisable. Êtes-vous sûr de vouloir le modifier ?", Yl = "Non", Kl = "Oui", _l = "Fermer", ql = "Type de fichier non autorisé.", Gl = "Le fichier existe déjà.", Jl = "La taille maximale de téléversement est", Zl = "Glissez les fichiers à téléverser", Xl = "Choisir un fichier", Ql = "Échec du téléversement.", ec = "Téléversement en cours", tc = "Téléversé", nc = "Supprimer", oc = "Annuler le téléversement", sc = "Aperçu", ic = "Désolé ! L'aperçu n'est pas disponible pour ce fichier.", ac = "Accueil", rc = "Afficher plus de dossiers", lc = "Déplacer vers", cc = "Ce dossier est vide.", dc = "Tout sélectionner", uc = "Vue", pc = "Grille", fc = "Liste", hc = "Ouvrir", mc = "Rien ici pour le moment", gc = "Nom", vc = "Modifié", $c = "Taille", yc = 'Êtes-vous sûr de vouloir supprimer "{{fileName}}" ?', wc = "Êtes-vous sûr de vouloir supprimer ces {{count}} éléments ?", bc = "{{percent}}% terminé", xc = "Annulé", Cc = 'Un nom de fichier ne peut pas contenir les caractères suivants : \\ / : * ? " < > |', Sc = 'Cette destination contient déjà un dossier nommé "{{renameFile}}".', Nc = "Réduire le panneau de navigation", Fc = "Développer le panneau de navigation", Ec = {
  newFolder: Tl,
  upload: Ll,
  paste: Al,
  changeView: Rl,
  refresh: kl,
  cut: Ml,
  copy: Ol,
  rename: Il,
  download: Dl,
  delete: "Supprimer",
  itemSelected: Ul,
  itemsSelected: jl,
  cancel: Hl,
  clearSelection: Vl,
  completed: Bl,
  fileNameChangeWarning: Wl,
  no: Yl,
  yes: Kl,
  close: _l,
  fileTypeNotAllowed: ql,
  fileAlreadyExist: Gl,
  maxUploadSize: Jl,
  dragFileToUpload: Zl,
  chooseFile: Xl,
  uploadFail: Ql,
  uploading: ec,
  uploaded: tc,
  remove: nc,
  abortUpload: oc,
  preview: sc,
  previewUnavailable: ic,
  home: ac,
  showMoreFolder: rc,
  moveTo: lc,
  folderEmpty: cc,
  selectAll: dc,
  view: uc,
  grid: pc,
  list: fc,
  open: hc,
  nothingHereYet: mc,
  name: gc,
  modified: vc,
  size: $c,
  deleteItemConfirm: yc,
  deleteItemsConfirm: wc,
  percentDone: bc,
  canceled: xc,
  invalidFileName: Cc,
  folderExists: Sc,
  collapseNavigationPane: Nc,
  expandNavigationPane: Fc
}, Pc = "תיקייה חדשה", zc = "העלה", Tc = "הדבק", Lc = "שנה תצוגה", Ac = "רענן", Rc = "גזור", kc = "העתק", Mc = "שנה שם", Oc = "הורד", Ic = "פריט נבחר", Dc = "פריטים נבחרו", Uc = "בטל", jc = "נקה בחירה", Hc = "הושלם", Vc = "אם תשנה את סיומת הקובץ, הקובץ עלול להפוך לבלתי שמיש. האם אתה בטוח שברצונך לשנות זאת?", Bc = "לא", Wc = "כן", Yc = "סגור", Kc = "סוג הקובץ אינו מורשה.", _c = "הקובץ כבר קיים.", qc = "גודל העלאה מקסימלי הוא", Gc = "גרור קבצים להעלאה", Jc = "בחר קובץ", Zc = "ההעלאה נכשלה.", Xc = "מעלה...", Qc = "הועלה", ed = "הסר", td = "בטל העלאה", nd = "תצוגה מקדימה", od = "מצטערים! אין תצוגה מקדימה זמינה לקובץ זה.", sd = "דף הבית", id = "הצג תיקיות נוספות", ad = "העבר ל", rd = "התיקייה ריקה.", ld = "בחר הכל", cd = "תצוגה", dd = "רשת", ud = "רשימה", pd = "פתח", fd = "אין כאן כלום עדיין", hd = "שם", md = "שונה", gd = "גודל", vd = 'האם אתה בטוח שברצונך למחוק את "{{fileName}}"?', $d = "האם אתה בטוח שברצונך למחוק את {{count}} הפריטים האלו?", yd = "{{percent}}% הושלמו", wd = "בוטל", bd = 'שם קובץ לא יכול להכיל את התווים הבאים: \\ / : * ? " < > |', xd = 'כבר קיימת תיקייה בשם "{{renameFile}}" במיקום זה.', Cd = "כווץ את לוח הניווט", Sd = "הרחב את לוח הניווט", Nd = {
  newFolder: Pc,
  upload: zc,
  paste: Tc,
  changeView: Lc,
  refresh: Ac,
  cut: Rc,
  copy: kc,
  rename: Mc,
  download: Oc,
  delete: "מחק",
  itemSelected: Ic,
  itemsSelected: Dc,
  cancel: Uc,
  clearSelection: jc,
  completed: Hc,
  fileNameChangeWarning: Vc,
  no: Bc,
  yes: Wc,
  close: Yc,
  fileTypeNotAllowed: Kc,
  fileAlreadyExist: _c,
  maxUploadSize: qc,
  dragFileToUpload: Gc,
  chooseFile: Jc,
  uploadFail: Zc,
  uploading: Xc,
  uploaded: Qc,
  remove: ed,
  abortUpload: td,
  preview: nd,
  previewUnavailable: od,
  home: sd,
  showMoreFolder: id,
  moveTo: ad,
  folderEmpty: rd,
  selectAll: ld,
  view: cd,
  grid: dd,
  list: ud,
  open: pd,
  nothingHereYet: fd,
  name: hd,
  modified: md,
  size: gd,
  deleteItemConfirm: vd,
  deleteItemsConfirm: $d,
  percentDone: yd,
  canceled: wd,
  invalidFileName: bd,
  folderExists: xd,
  collapseNavigationPane: Cd,
  expandNavigationPane: Sd
}, Fd = "नया फ़ोल्डर", Ed = "अपलोड करें", Pd = "पेस्ट करें", zd = "दृश्य बदलें", Td = "रिफ्रेश करें", Ld = "काटें", Ad = "कॉपी करें", Rd = "नाम बदलें", kd = "डाउनलोड करें", Md = "आइटम चुना गया", Od = "आइटम्स चुने गए", Id = "रद्द करें", Dd = "चयन साफ़ करें", Ud = "पूर्ण हुआ", jd = "यदि आप फ़ाइल नाम एक्सटेंशन बदलते हैं, तो फ़ाइल अनुपयोगी हो सकती है। क्या आप वाकई इसे बदलना चाहते हैं?", Hd = "नहीं", Vd = "हाँ", Bd = "बंद करें", Wd = "फ़ाइल प्रकार की अनुमति नहीं है।", Yd = "फ़ाइल पहले से मौजूद है।", Kd = "अधिकतम अपलोड आकार है", _d = "अपलोड करने के लिए फ़ाइलें खींचें", qd = "फ़ाइल चुनें", Gd = "अपलोड विफल रहा।", Jd = "अपलोड हो रहा है", Zd = "अपलोड हो गया", Xd = "हटाएं", Qd = "अपलोड रोकें", eu = "पूर्वावलोकन", tu = "माफ़ कीजिए! इस फ़ाइल के लिए पूर्वावलोकन उपलब्ध नहीं है।", nu = "होम", ou = "और फ़ोल्डर दिखाएँ", su = "इसमें ले जाएँ", iu = "यह फ़ोल्डर खाली है।", au = "सभी का चयन करें", ru = "दृश्य", lu = "ग्रिड", cu = "सूची", du = "खोलें", uu = "यहाँ अभी कुछ नहीं है", pu = "नाम", fu = "परिवर्तित", hu = "आकार", mu = 'क्या आप वाकई "{{fileName}}" को हटाना चाहते हैं?', gu = "क्या आप वाकई इन {{count}} आइटम्स को हटाना चाहते हैं?", vu = "{{percent}}% पूर्ण", $u = "रद्द किया गया", yu = 'फ़ाइल नाम में निम्नलिखित वर्ण नहीं हो सकते: \\ / : * ? " < > |', wu = 'इस स्थान पर "{{renameFile}}" नाम का एक फ़ोल्डर पहले से मौजूद है।', bu = "नेविगेशन पैन को संकुचित करें", xu = "नेविगेशन पैन को विस्तारित करें", Cu = {
  newFolder: Fd,
  upload: Ed,
  paste: Pd,
  changeView: zd,
  refresh: Td,
  cut: Ld,
  copy: Ad,
  rename: Rd,
  download: kd,
  delete: "हटाएं",
  itemSelected: Md,
  itemsSelected: Od,
  cancel: Id,
  clearSelection: Dd,
  completed: Ud,
  fileNameChangeWarning: jd,
  no: Hd,
  yes: Vd,
  close: Bd,
  fileTypeNotAllowed: Wd,
  fileAlreadyExist: Yd,
  maxUploadSize: Kd,
  dragFileToUpload: _d,
  chooseFile: qd,
  uploadFail: Gd,
  uploading: Jd,
  uploaded: Zd,
  remove: Xd,
  abortUpload: Qd,
  preview: eu,
  previewUnavailable: tu,
  home: nu,
  showMoreFolder: ou,
  moveTo: su,
  folderEmpty: iu,
  selectAll: au,
  view: ru,
  grid: lu,
  list: cu,
  open: du,
  nothingHereYet: uu,
  name: pu,
  modified: fu,
  size: hu,
  deleteItemConfirm: mu,
  deleteItemsConfirm: gu,
  percentDone: vu,
  canceled: $u,
  invalidFileName: yu,
  folderExists: wu,
  collapseNavigationPane: bu,
  expandNavigationPane: xu
}, Su = "Nuova cartella", Nu = "Carica", Fu = "Incolla", Eu = "Cambia vista", Pu = "Ricarica", zu = "Taglia", Tu = "Copia", Lu = "Rinomina", Au = "Scarica", Ru = "elemento selezionato", ku = "elementi selezionati", Mu = "Annulla", Ou = "Pulisci selezione", Iu = "Completato", Du = "Se cambi l'estensione del file, potrebbe diventare inutilizzabile. Sei sicuro di volerlo fare?", Uu = "No", ju = "Sì", Hu = "Chiudi", Vu = "Tipo di file non consentito.", Bu = "Il file esiste già.", Wu = "La dimensione massima di caricamento è", Yu = "Trascina i file per caricarli", Ku = "Scegli file", _u = "Caricamento fallito.", qu = "Caricamento in corso", Gu = "Caricato", Ju = "Rimuovi", Zu = "Annulla caricamento", Xu = "Anteprima", Qu = "Spiacenti! L'anteprima non è disponibile per questo file.", ep = "Home", tp = "Mostra altre cartelle", np = "Sposta in", op = "Questa cartella è vuota.", sp = "Seleziona tutto", ip = "Vista", ap = "Griglia", rp = "Lista", lp = "Apri", cp = "Niente qui per ora", dp = "Nome", up = "Modificato", pp = "Dimensione", fp = 'Sei sicuro di voler eliminare "{{fileName}}"?', hp = "Sei sicuro di voler eliminare questi {{count}} elementi?", mp = "{{percent}}% completato", gp = "Annullato", vp = 'Un nome di file non può contenere nessuno dei seguenti caratteri: \\ / : * ? " < > |', $p = 'Questa destinazione contiene già una cartella chiamata "{{renameFile}}".', yp = "Comprimi pannello di navigazione", wp = "Espandi pannello di navigazione", bp = {
  newFolder: Su,
  upload: Nu,
  paste: Fu,
  changeView: Eu,
  refresh: Pu,
  cut: zu,
  copy: Tu,
  rename: Lu,
  download: Au,
  delete: "Elimina",
  itemSelected: Ru,
  itemsSelected: ku,
  cancel: Mu,
  clearSelection: Ou,
  completed: Iu,
  fileNameChangeWarning: Du,
  no: Uu,
  yes: ju,
  close: Hu,
  fileTypeNotAllowed: Vu,
  fileAlreadyExist: Bu,
  maxUploadSize: Wu,
  dragFileToUpload: Yu,
  chooseFile: Ku,
  uploadFail: _u,
  uploading: qu,
  uploaded: Gu,
  remove: Ju,
  abortUpload: Zu,
  preview: Xu,
  previewUnavailable: Qu,
  home: ep,
  showMoreFolder: tp,
  moveTo: np,
  folderEmpty: op,
  selectAll: sp,
  view: ip,
  grid: ap,
  list: rp,
  open: lp,
  nothingHereYet: cp,
  name: dp,
  modified: up,
  size: pp,
  deleteItemConfirm: fp,
  deleteItemsConfirm: hp,
  percentDone: mp,
  canceled: gp,
  invalidFileName: vp,
  folderExists: $p,
  collapseNavigationPane: yp,
  expandNavigationPane: wp
}, xp = "新しいフォルダー", Cp = "アップロード", Sp = "貼り付け", Np = "ビューを変更", Fp = "更新", Ep = "切り取り", Pp = "コピー", zp = "名前変更", Tp = "ダウンロード", Lp = "アイテムが選択されました", Ap = "{{count}} アイテムが選択されました", Rp = "キャンセル", kp = "選択をクリア", Mp = "完了", Op = "ファイル拡張子を変更すると、ファイルが使えなくなる場合があります。本当に変更しますか？", Ip = "いいえ", Dp = "はい", Up = "閉じる", jp = "ファイルタイプは許可されていません。", Hp = "ファイルはすでに存在します。", Vp = "最大アップロードサイズは", Bp = "ファイルをドラッグしてアップロード", Wp = "ファイルを選択", Yp = "アップロード失敗。", Kp = "アップロード中", _p = "アップロード済み", qp = "削除", Gp = "アップロード中止", Jp = "プレビュー", Zp = "申し訳ありません！このファイルのプレビューは利用できません。", Xp = "ホーム", Qp = "さらにフォルダーを表示", ef = "移動先", tf = "このフォルダーは空です。", nf = "すべて選択", of = "ビュー", sf = "グリッド", af = "リスト", rf = "開く", lf = "まだ何もありません", cf = "名前", df = "修正日", uf = "サイズ", pf = '"{{fileName}}" を削除してもよろしいですか？', ff = "{{count}} 件のアイテムを削除してもよろしいですか？", hf = "{{percent}}% 完了", mf = "キャンセルしました", gf = 'ファイル名には以下の文字を含めることはできません：\\ / : * ? " < > |', vf = 'この宛先には "{{renameFile}}" という名前のフォルダーがすでに存在します。', $f = "ナビゲーションペインを折りたたむ", yf = "ナビゲーションペインを展開", wf = {
  newFolder: xp,
  upload: Cp,
  paste: Sp,
  changeView: Np,
  refresh: Fp,
  cut: Ep,
  copy: Pp,
  rename: zp,
  download: Tp,
  delete: "削除",
  itemSelected: Lp,
  itemsSelected: Ap,
  cancel: Rp,
  clearSelection: kp,
  completed: Mp,
  fileNameChangeWarning: Op,
  no: Ip,
  yes: Dp,
  close: Up,
  fileTypeNotAllowed: jp,
  fileAlreadyExist: Hp,
  maxUploadSize: Vp,
  dragFileToUpload: Bp,
  chooseFile: Wp,
  uploadFail: Yp,
  uploading: Kp,
  uploaded: _p,
  remove: qp,
  abortUpload: Gp,
  preview: Jp,
  previewUnavailable: Zp,
  home: Xp,
  showMoreFolder: Qp,
  moveTo: ef,
  folderEmpty: tf,
  selectAll: nf,
  view: of,
  grid: sf,
  list: af,
  open: rf,
  nothingHereYet: lf,
  name: cf,
  modified: df,
  size: uf,
  deleteItemConfirm: pf,
  deleteItemsConfirm: ff,
  percentDone: hf,
  canceled: mf,
  invalidFileName: gf,
  folderExists: vf,
  collapseNavigationPane: $f,
  expandNavigationPane: yf
}, bf = "새 폴더", xf = "업로드", Cf = "붙여넣기", Sf = "보기 변경", Nf = "새로 고침", Ff = "잘라내기", Ef = "복사", Pf = "이름 바꾸기", zf = "다운로드", Tf = "항목 선택됨", Lf = "개 항목 선택됨", Af = "취소", Rf = "선택 지우기", kf = "완료됨", Mf = "파일 확장자를 변경하면 사용할 수 없게 될 수 있습니다. 정말로 변경하시겠습니까?", Of = "아니오", If = "예", Df = "닫기", Uf = "허용되지 않는 파일 형식입니다.", jf = "파일이 이미 존재합니다.", Hf = "최대 업로드 크기", Vf = "업로드하려면 파일을 끌어오세요", Bf = "파일 선택", Wf = "업로드 실패", Yf = "업로드 중", Kf = "업로드 완료", _f = "제거", qf = "업로드 중단", Gf = "미리보기", Jf = "죄송합니다! 이 파일은 미리보기를 제공하지 않습니다.", Zf = "홈", Xf = "더 많은 폴더 보기", Qf = "이동", eh = "이 폴더는 비어 있습니다.", th = "전체 선택", nh = "보기", oh = "그리드", sh = "목록", ih = "열기", ah = "아직 아무것도 없습니다", rh = "이름", lh = "수정됨", ch = "크기", dh = '"{{fileName}}" 파일을 삭제하시겠습니까?', uh = "{{count}}개의 항목을 삭제하시겠습니까?", ph = "{{percent}}% 완료", fh = "취소됨", hh = '파일 이름에는 다음 문자를 사용할 수 없습니다: \\ / : * ? " < > |', mh = '해당 위치에 "{{renameFile}}" 폴더가 이미 있습니다.', gh = "탐색 창 축소", vh = "탐색 창 확장", $h = {
  newFolder: bf,
  upload: xf,
  paste: Cf,
  changeView: Sf,
  refresh: Nf,
  cut: Ff,
  copy: Ef,
  rename: Pf,
  download: zf,
  delete: "삭제",
  itemSelected: Tf,
  itemsSelected: Lf,
  cancel: Af,
  clearSelection: Rf,
  completed: kf,
  fileNameChangeWarning: Mf,
  no: Of,
  yes: If,
  close: Df,
  fileTypeNotAllowed: Uf,
  fileAlreadyExist: jf,
  maxUploadSize: Hf,
  dragFileToUpload: Vf,
  chooseFile: Bf,
  uploadFail: Wf,
  uploading: Yf,
  uploaded: Kf,
  remove: _f,
  abortUpload: qf,
  preview: Gf,
  previewUnavailable: Jf,
  home: Zf,
  showMoreFolder: Xf,
  moveTo: Qf,
  folderEmpty: eh,
  selectAll: th,
  view: nh,
  grid: oh,
  list: sh,
  open: ih,
  nothingHereYet: ah,
  name: rh,
  modified: lh,
  size: ch,
  deleteItemConfirm: dh,
  deleteItemsConfirm: uh,
  percentDone: ph,
  canceled: fh,
  invalidFileName: hh,
  folderExists: mh,
  collapseNavigationPane: gh,
  expandNavigationPane: vh
}, yh = "Nova pasta", wh = "Carregar", bh = "Colar", xh = "Alterar visualização", Ch = "Atualizar", Sh = "Cortar", Nh = "Copiar", Fh = "Renomear", Eh = "Baixar", Ph = "item selecionado", zh = "itens selecionados", Th = "Cancelar", Lh = "Limpar seleção", Ah = "Concluído", Rh = "Se você alterar a extensão do arquivo, ele pode se tornar inutilizável. Tem certeza de que deseja fazer isso?", kh = "Não", Mh = "Sim", Oh = "Fechar", Ih = "Tipo de arquivo não permitido.", Dh = "Arquivo já existe.", Uh = "Tamanho máximo de upload é", jh = "Arraste os arquivos para carregar", Hh = "Escolher arquivo", Vh = "Falha no upload.", Bh = "Carregando", Wh = "Carregado", Yh = "Remover", Kh = "Abortar upload", _h = "Visualizar", qh = "Desculpe! Não há visualização disponível para este arquivo.", Gh = "Início", Jh = "Mostrar mais pastas", Zh = "Mover para", Xh = "Esta pasta está vazia.", Qh = "Selecionar tudo", em = "Visualização", tm = "Grade", nm = "Lista", om = "Abrir", sm = "Nada aqui ainda", im = "Nome", am = "Modificado", rm = "Tamanho", lm = 'Tem certeza de que deseja excluir "{{fileName}}"?', cm = "Tem certeza de que deseja excluir esses {{count}} itens?", dm = "{{percent}}% concluído", um = "Cancelado", pm = 'Um nome de arquivo não pode conter nenhum dos seguintes caracteres: \\ / : * ? " < > |', fm = 'Já existe uma pasta com o nome "{{renameFile}}" neste local.', hm = "Recolher painel de navegação", mm = "Expandir painel de navegação", gm = {
  newFolder: yh,
  upload: wh,
  paste: bh,
  changeView: xh,
  refresh: Ch,
  cut: Sh,
  copy: Nh,
  rename: Fh,
  download: Eh,
  delete: "Excluir",
  itemSelected: Ph,
  itemsSelected: zh,
  cancel: Th,
  clearSelection: Lh,
  completed: Ah,
  fileNameChangeWarning: Rh,
  no: kh,
  yes: Mh,
  close: Oh,
  fileTypeNotAllowed: Ih,
  fileAlreadyExist: Dh,
  maxUploadSize: Uh,
  dragFileToUpload: jh,
  chooseFile: Hh,
  uploadFail: Vh,
  uploading: Bh,
  uploaded: Wh,
  remove: Yh,
  abortUpload: Kh,
  preview: _h,
  previewUnavailable: qh,
  home: Gh,
  showMoreFolder: Jh,
  moveTo: Zh,
  folderEmpty: Xh,
  selectAll: Qh,
  view: em,
  grid: tm,
  list: nm,
  open: om,
  nothingHereYet: sm,
  name: im,
  modified: am,
  size: rm,
  deleteItemConfirm: lm,
  deleteItemsConfirm: cm,
  percentDone: dm,
  canceled: um,
  invalidFileName: pm,
  folderExists: fm,
  collapseNavigationPane: hm,
  expandNavigationPane: mm
}, vm = "Nova pasta", $m = "Carregar", ym = "Colar", wm = "Mudar vista", bm = "Atualizar", xm = "Cortar", Cm = "Copiar", Sm = "Renomear", Nm = "Transferir", Fm = "item selecionado", Em = "itens selecionados", Pm = "Cancelar", zm = "Limpar seleção", Tm = "Concluído", Lm = "Se alterar a extensão de um ficheiro, este pode deixar de funcionar corretamente. Tem a certeza de que deseja alterá-la?", Am = "Não", Rm = "Sim", km = "Fechar", Mm = "Tipo de ficheiro não permitido.", Om = "O ficheiro já existe.", Im = "O tamanho máximo de carregamento é", Dm = "Arraste os ficheiros para carregar", Um = "Escolher ficheiro", jm = "Falha no carregamento.", Hm = "A carregar", Vm = "Carregado", Bm = "Remover", Wm = "Cancelar carregamento", Ym = "Pré-visualizar", Km = "Lamentamos! A pré-visualização não está disponível para este ficheiro.", _m = "Início", qm = "Mostrar mais pastas", Gm = "Mover para", Jm = "Esta pasta está vazia.", Zm = "Selecionar tudo", Xm = "Vista", Qm = "Grelha", e1 = "Lista", t1 = "Abrir", n1 = "Ainda não há nada aqui", o1 = "Nome", s1 = "Modificado", i1 = "Tamanho", a1 = 'Tem a certeza de que deseja eliminar "{{fileName}}"?', r1 = "Tem a certeza de que deseja eliminar estes {{count}} itens?", l1 = "{{percent}}% concluído", c1 = "Cancelado", d1 = 'O nome do ficheiro não pode conter nenhum dos seguintes caracteres: \\ / : * ? " < > |', u1 = 'O destino já contém uma pasta chamada "{{renameFile}}".', p1 = "Recolher painel de navegação", f1 = "Expandir painel de navegação", h1 = {
  newFolder: vm,
  upload: $m,
  paste: ym,
  changeView: wm,
  refresh: bm,
  cut: xm,
  copy: Cm,
  rename: Sm,
  download: Nm,
  delete: "Eliminar",
  itemSelected: Fm,
  itemsSelected: Em,
  cancel: Pm,
  clearSelection: zm,
  completed: Tm,
  fileNameChangeWarning: Lm,
  no: Am,
  yes: Rm,
  close: km,
  fileTypeNotAllowed: Mm,
  fileAlreadyExist: Om,
  maxUploadSize: Im,
  dragFileToUpload: Dm,
  chooseFile: Um,
  uploadFail: jm,
  uploading: Hm,
  uploaded: Vm,
  remove: Bm,
  abortUpload: Wm,
  preview: Ym,
  previewUnavailable: Km,
  home: _m,
  showMoreFolder: qm,
  moveTo: Gm,
  folderEmpty: Jm,
  selectAll: Zm,
  view: Xm,
  grid: Qm,
  list: e1,
  open: t1,
  nothingHereYet: n1,
  name: o1,
  modified: s1,
  size: i1,
  deleteItemConfirm: a1,
  deleteItemsConfirm: r1,
  percentDone: l1,
  canceled: c1,
  invalidFileName: d1,
  folderExists: u1,
  collapseNavigationPane: p1,
  expandNavigationPane: f1
}, m1 = "Новая папка", g1 = "Загрузить", v1 = "Вставить", $1 = "Изменить вид", y1 = "Обновить", w1 = "Вырезать", b1 = "Копировать", x1 = "Переименовать", C1 = "Скачать", S1 = "выбран элемент", N1 = "выбрано {{count}} элементов", F1 = "Отменить", E1 = "Очистить выбор", P1 = "Завершено", z1 = "Если вы измените расширение файла, файл может стать неисправным. Вы уверены, что хотите изменить его?", T1 = "Нет", L1 = "Да", A1 = "Закрыть", R1 = "Тип файла не разрешен.", k1 = "Файл уже существует.", M1 = "Максимальный размер загрузки:", O1 = "Перетащите файлы для загрузки", I1 = "Выбрать файл", D1 = "Загрузка не удалась.", U1 = "Загрузка", j1 = "Загружено", H1 = "Удалить", V1 = "Прервать загрузку", B1 = "Предпросмотр", W1 = "Извините! Предпросмотр для этого файла недоступен.", Y1 = "Главная", K1 = "Показать больше папок", _1 = "Переместить в", q1 = "Эта папка пуста.", G1 = "Выбрать все", J1 = "Вид", Z1 = "Сетка", X1 = "Список", Q1 = "Открыть", e0 = "Здесь еще ничего нет", t0 = "Имя", n0 = "Изменено", o0 = "Размер", s0 = 'Вы уверены, что хотите удалить "{{fileName}}"?', i0 = "Вы уверены, что хотите удалить эти {{count}} элементы?", a0 = "{{percent}}% завершено", r0 = "Отменено", l0 = 'Имя файла не может содержать следующие символы: \\ / : * ? " < > |', c0 = 'В этом местоположении уже существует папка с именем "{{renameFile}}".', d0 = "Свернуть панель навигации", u0 = "Развернуть панель навигации", p0 = {
  newFolder: m1,
  upload: g1,
  paste: v1,
  changeView: $1,
  refresh: y1,
  cut: w1,
  copy: b1,
  rename: x1,
  download: C1,
  delete: "Удалить",
  itemSelected: S1,
  itemsSelected: N1,
  cancel: F1,
  clearSelection: E1,
  completed: P1,
  fileNameChangeWarning: z1,
  no: T1,
  yes: L1,
  close: A1,
  fileTypeNotAllowed: R1,
  fileAlreadyExist: k1,
  maxUploadSize: M1,
  dragFileToUpload: O1,
  chooseFile: I1,
  uploadFail: D1,
  uploading: U1,
  uploaded: j1,
  remove: H1,
  abortUpload: V1,
  preview: B1,
  previewUnavailable: W1,
  home: Y1,
  showMoreFolder: K1,
  moveTo: _1,
  folderEmpty: q1,
  selectAll: G1,
  view: J1,
  grid: Z1,
  list: X1,
  open: Q1,
  nothingHereYet: e0,
  name: t0,
  modified: n0,
  size: o0,
  deleteItemConfirm: s0,
  deleteItemsConfirm: i0,
  percentDone: a0,
  canceled: r0,
  invalidFileName: l0,
  folderExists: c0,
  collapseNavigationPane: d0,
  expandNavigationPane: u0
}, f0 = "Yeni Klasör", h0 = "Dosya Yükle", m0 = "Yapıştır", g0 = "Görünümü Değiştir", v0 = "Yenile", $0 = "Kes", y0 = "Kopyala", w0 = "Yeniden İsimlendir", b0 = "İndir", x0 = "öğe seçildi", C0 = "seçilen öğeler", S0 = "İptal", N0 = "Seçimi Temizle", F0 = "Tamamlandı", E0 = "Dosya adı aşağıdaki karakterlerden hiçbirini içeremez:", P0 = "Bir dosya adı uzantısını değiştirirseniz, dosya kullanılamaz hale gelebilir. Bunu değiştirmek istediğinizden emin misiniz?", z0 = "Hayır", T0 = "Evet", L0 = "Kapalı", A0 = "Dosya türüne izin verilmiyor.", R0 = "Dosya zaten mevcut.", k0 = "Maksimum yükleme boyutu", M0 = "Yüklemek için dosyaları sürükleyin", O0 = "Dosya Seç", I0 = "Yükleme hatası.", D0 = "Yükleniyor", U0 = "Yüklendi", j0 = "Kaldır", H0 = "Yüklemeyi İptal Et", V0 = "Görünüm", B0 = "Üzgünüz! Bu dosya için önizleme mevcut değil.", W0 = "Ana Sayfa", Y0 = "Daha fazla klasör göster", K0 = "Burya Taşı", _0 = "Bu klasör boş.", q0 = "Hepsini Seç", G0 = "Görünüm", J0 = "Izgara", Z0 = "Liste", X0 = "Aç", Q0 = "Henüz hiçbir şey yok", eg = "Ad", tg = "Değiştirilme Tarihi", ng = "Boyut", og = '"{{fileName}}" dosyasını silmek istediğinizden emin misiniz?', sg = "{{count}} öğeyi silmek istediğinizden emin misiniz?", ig = "%{{percent}} tamamlandı", ag = "İptal edildi", rg = 'Bir dosya adı aşağıdaki karakterlerden hiçbirini içeremez: \\ / : * ? " < > |', lg = 'Bu konumda "{{renameFile}}" adında bir klasör zaten var.', cg = "Gezinti Panelini Daralt", dg = "Gezinti Panelini Genişlet", ug = {
  newFolder: f0,
  upload: h0,
  paste: m0,
  changeView: g0,
  refresh: v0,
  cut: $0,
  copy: y0,
  rename: w0,
  download: b0,
  delete: "Sil",
  itemSelected: x0,
  itemsSelected: C0,
  cancel: S0,
  clearSelection: N0,
  completed: F0,
  folderErrorMessage: E0,
  fileNameChangeWarning: P0,
  no: z0,
  yes: T0,
  close: L0,
  fileTypeNotAllowed: A0,
  fileAlreadyExist: R0,
  maxUploadSize: k0,
  dragFileToUpload: M0,
  chooseFile: O0,
  uploadFail: I0,
  uploading: D0,
  uploaded: U0,
  remove: j0,
  abortUpload: H0,
  preview: V0,
  previewUnavailable: B0,
  home: W0,
  showMoreFolder: Y0,
  moveTo: K0,
  folderEmpty: _0,
  selectAll: q0,
  view: G0,
  grid: J0,
  list: Z0,
  open: X0,
  nothingHereYet: Q0,
  name: eg,
  modified: tg,
  size: ng,
  deleteItemConfirm: og,
  deleteItemsConfirm: sg,
  percentDone: ig,
  canceled: ag,
  invalidFileName: rg,
  folderExists: lg,
  collapseNavigationPane: cg,
  expandNavigationPane: dg
}, pg = "Нова папка", fg = "Завантажити", hg = "Вставити", mg = "Змінити вигляд", gg = "Оновити", vg = "Вирізати", $g = "Копіювати", yg = "Перейменувати", wg = "Завантажити", bg = "вибраний елемент", xg = "вибрані елементи", Cg = "Скасувати", Sg = "Очистити вибір", Ng = "Завершено", Fg = "Якщо ви зміните розширення файлу, він може стати непридатним для використання. Ви впевнені, що хочете змінити його?", Eg = "Ні", Pg = "Так", zg = "Закрити", Tg = "Тип файлу не дозволено.", Lg = "Файл уже існує.", Ag = "Максимальний розмір завантаження —", Rg = "Перетягніть файли для завантаження", kg = "Вибрати файл", Mg = "Помилка завантаження.", Og = "Завантаження", Ig = "Завантажено", Dg = "Видалити", Ug = "Скасувати завантаження", jg = "Попередній перегляд", Hg = "На жаль! Попередній перегляд для цього файлу недоступний.", Vg = "Головна", Bg = "Показати більше папок", Wg = "Перемістити до", Yg = "Ця папка порожня.", Kg = "Вибрати все", _g = "Вигляд", qg = "Сітка", Gg = "Список", Jg = "Відкрити", Zg = "Тут ще нічого немає", Xg = "Назва", Qg = "Змінено", e2 = "Розмір", t2 = 'Ви впевнені, що хочете видалити "{{fileName}}"?', n2 = "Ви впевнені, що хочете видалити ці {{count}} елементи?", o2 = "{{percent}}% завершено", s2 = "Скасовано", i2 = `Ім'я файлу не може містити такі символи: \\ / : * ? " < > |`, a2 = 'У цьому місці вже існує папка з назвою "{{renameFile}}".', r2 = "Згорнути панель навігації", l2 = "Розгорнути панель навігації", c2 = {
  newFolder: pg,
  upload: fg,
  paste: hg,
  changeView: mg,
  refresh: gg,
  cut: vg,
  copy: $g,
  rename: yg,
  download: wg,
  delete: "Видалити",
  itemSelected: bg,
  itemsSelected: xg,
  cancel: Cg,
  clearSelection: Sg,
  completed: Ng,
  fileNameChangeWarning: Fg,
  no: Eg,
  yes: Pg,
  close: zg,
  fileTypeNotAllowed: Tg,
  fileAlreadyExist: Lg,
  maxUploadSize: Ag,
  dragFileToUpload: Rg,
  chooseFile: kg,
  uploadFail: Mg,
  uploading: Og,
  uploaded: Ig,
  remove: Dg,
  abortUpload: Ug,
  preview: jg,
  previewUnavailable: Hg,
  home: Vg,
  showMoreFolder: Bg,
  moveTo: Wg,
  folderEmpty: Yg,
  selectAll: Kg,
  view: _g,
  grid: qg,
  list: Gg,
  open: Jg,
  nothingHereYet: Zg,
  name: Xg,
  modified: Qg,
  size: e2,
  deleteItemConfirm: t2,
  deleteItemsConfirm: n2,
  percentDone: o2,
  canceled: s2,
  invalidFileName: i2,
  folderExists: a2,
  collapseNavigationPane: r2,
  expandNavigationPane: l2
}, d2 = "نیا فولڈر", u2 = "اپ لوڈ کریں", p2 = "چسپاں کریں", f2 = "دیکھنے کا طریقہ تبدیل کریں", h2 = "تازہ کریں", m2 = "کٹ کریں", g2 = "کاپی کریں", v2 = "نام تبدیل کریں", $2 = "ڈاؤن لوڈ کریں", y2 = "آئٹم منتخب کیا گیا", w2 = "{{count}} آئٹمز منتخب کی گئیں", b2 = "منسوخ کریں", x2 = "انتخاب صاف کریں", C2 = "مکمل ہوا", S2 = "اگر آپ فائل کا ایکسٹینشن تبدیل کرتے ہیں، تو فائل ناقابل استعمال ہو سکتی ہے۔ کیا آپ واقعی اسے تبدیل کرنا چاہتے ہیں؟", N2 = "نہیں", F2 = "ہاں", E2 = "بند کریں", P2 = "فائل کی قسم کی اجازت نہیں ہے۔", z2 = "فائل پہلے سے موجود ہے۔", T2 = "زیادہ سے زیادہ اپ لوڈ سائز ہے", L2 = "اپ لوڈ کرنے کے لیے فائلز گھسیٹیں", A2 = "فائل منتخب کریں", R2 = "اپ لوڈ میں ناکامی۔", k2 = "اپ لوڈ ہو رہا ہے", M2 = "اپ لوڈ ہو گیا", O2 = "ہٹائیں", I2 = "اپ لوڈ منسوخ کریں", D2 = "پریویو", U2 = "معذرت! اس فائل کا پریویو دستیاب نہیں ہے۔", j2 = "ہوم", H2 = "مزید فولڈرز دکھائیں", V2 = "منتقل کریں", B2 = "یہ فولڈر خالی ہے۔", W2 = "سبھی منتخب کریں", Y2 = "دیکھیں", K2 = "گِریڈ", _2 = "فہرست", q2 = "کھولیں", G2 = "ابھی کچھ بھی نہیں ہے", J2 = "نام", Z2 = "ترمیم شدہ", X2 = "سائز", Q2 = 'کیا آپ واقعی "{{fileName}}" کو حذف کرنا چاہتے ہیں؟', ev = "کیا آپ واقعی ان {{count}} آئٹمز کو حذف کرنا چاہتے ہیں؟", tv = "{{percent}}% مکمل ہوا", nv = "منسوخ کیا گیا", ov = 'فائل کا نام درج ذیل میں سے کوئی بھی حرف نہیں رکھ سکتا: \\ / : * ? " < > |', sv = 'اس منزل پر پہلے ہی "{{renameFile}}" کے نام کا فولڈر موجود ہے۔', iv = "نیویگیشن پین کو بند کریں", av = "نیویگیشن پین کو کھولیں", rv = {
  newFolder: d2,
  upload: u2,
  paste: p2,
  changeView: f2,
  refresh: h2,
  cut: m2,
  copy: g2,
  rename: v2,
  download: $2,
  delete: "حذف کریں",
  itemSelected: y2,
  itemsSelected: w2,
  cancel: b2,
  clearSelection: x2,
  completed: C2,
  fileNameChangeWarning: S2,
  no: N2,
  yes: F2,
  close: E2,
  fileTypeNotAllowed: P2,
  fileAlreadyExist: z2,
  maxUploadSize: T2,
  dragFileToUpload: L2,
  chooseFile: A2,
  uploadFail: R2,
  uploading: k2,
  uploaded: M2,
  remove: O2,
  abortUpload: I2,
  preview: D2,
  previewUnavailable: U2,
  home: j2,
  showMoreFolder: H2,
  moveTo: V2,
  folderEmpty: B2,
  selectAll: W2,
  view: Y2,
  grid: K2,
  list: _2,
  open: q2,
  nothingHereYet: G2,
  name: J2,
  modified: Z2,
  size: X2,
  deleteItemConfirm: Q2,
  deleteItemsConfirm: ev,
  percentDone: tv,
  canceled: nv,
  invalidFileName: ov,
  folderExists: sv,
  collapseNavigationPane: iv,
  expandNavigationPane: av
}, lv = "Thư mục mới", cv = "Tải lên", dv = "Dán", uv = "Thay đổi chế độ xem", pv = "Làm mới", fv = "Cắt", hv = "Sao chép", mv = "Đổi tên", gv = "Tải xuống", vv = "mục đã chọn", $v = "mục được chọn", yv = "Hủy", wv = "Xóa lựa chọn", bv = "Hoàn thành", xv = "Nếu bạn thay đổi phần mở rộng tên tệp, tệp có thể không sử dụng được. Bạn có chắc chắn muốn thay đổi không?", Cv = "Không", Sv = "Có", Nv = "Đóng", Fv = "Loại tệp không được phép.", Ev = "Tệp đã tồn tại.", Pv = "Kích thước tải lên tối đa là", zv = "Kéo tệp vào để tải lên", Tv = "Chọn tệp", Lv = "Tải lên thất bại.", Av = "Đang tải lên", Rv = "Đã tải lên", kv = "Gỡ bỏ", Mv = "Hủy tải lên", Ov = "Xem trước", Iv = "Rất tiếc! Không thể xem trước tệp này.", Dv = "Trang chủ", Uv = "Hiển thị thêm thư mục", jv = "Chuyển đến", Hv = "Thư mục này trống.", Vv = "Chọn tất cả", Bv = "Chế độ xem", Wv = "Lưới", Yv = "Danh sách", Kv = "Mở", _v = "Chưa có gì ở đây", qv = "Tên", Gv = "Đã chỉnh sửa", Jv = "Kích thước", Zv = 'Bạn có chắc muốn xóa "{{fileName}}"?', Xv = "Bạn có chắc muốn xóa {{count}} mục này không?", Qv = "Hoàn thành {{percent}}%", e4 = "Đã hủy", t4 = 'Tên tệp không được chứa các ký tự sau: \\ / : * ? " < > |', n4 = 'Đã có thư mục tên "{{renameFile}}" tại vị trí này.', o4 = "Thu gọn ngăn điều hướng", s4 = "Mở rộng ngăn điều hướng", i4 = {
  newFolder: lv,
  upload: cv,
  paste: dv,
  changeView: uv,
  refresh: pv,
  cut: fv,
  copy: hv,
  rename: mv,
  download: gv,
  delete: "Xóa",
  itemSelected: vv,
  itemsSelected: $v,
  cancel: yv,
  clearSelection: wv,
  completed: bv,
  fileNameChangeWarning: xv,
  no: Cv,
  yes: Sv,
  close: Nv,
  fileTypeNotAllowed: Fv,
  fileAlreadyExist: Ev,
  maxUploadSize: Pv,
  dragFileToUpload: zv,
  chooseFile: Tv,
  uploadFail: Lv,
  uploading: Av,
  uploaded: Rv,
  remove: kv,
  abortUpload: Mv,
  preview: Ov,
  previewUnavailable: Iv,
  home: Dv,
  showMoreFolder: Uv,
  moveTo: jv,
  folderEmpty: Hv,
  selectAll: Vv,
  view: Bv,
  grid: Wv,
  list: Yv,
  open: Kv,
  nothingHereYet: _v,
  name: qv,
  modified: Gv,
  size: Jv,
  deleteItemConfirm: Zv,
  deleteItemsConfirm: Xv,
  percentDone: Qv,
  canceled: e4,
  invalidFileName: t4,
  folderExists: n4,
  collapseNavigationPane: o4,
  expandNavigationPane: s4
}, a4 = "新建文件夹", r4 = "上传", l4 = "粘贴", c4 = "更改视图", d4 = "刷新", u4 = "剪切", p4 = "复制", f4 = "重命名", h4 = "下载", m4 = "已选择项", g4 = "已选择{{count}}项", v4 = "取消", $4 = "清除选择", y4 = "完成", w4 = "如果更改文件扩展名，文件可能会变得无法使用。您确定要更改吗？", b4 = "否", x4 = "是", C4 = "关闭", S4 = "不允许的文件类型。", N4 = "文件已存在。", F4 = "最大上传大小为", E4 = "拖动文件上传", P4 = "选择文件", z4 = "上传失败。", T4 = "上传中", L4 = "已上传", A4 = "移除", R4 = "取消上传", k4 = "预览", M4 = "抱歉！该文件无法预览。", O4 = "首页", I4 = "显示更多文件夹", D4 = "移动到", U4 = "该文件夹为空。", j4 = "全选", H4 = "视图", V4 = "网格", B4 = "列表", W4 = "打开", Y4 = "这里暂时没有内容", K4 = "名称", _4 = "修改时间", q4 = "大小", G4 = '您确定要删除 "{{fileName}}" 吗？', J4 = "您确定要删除这些 {{count}} 项吗？", Z4 = "{{percent}}% 完成", X4 = "已取消", Q4 = '文件名不能包含以下字符：\\ / : * ? " < > |', e$ = '目标文件夹中已存在名为 "{{renameFile}}" 的文件夹。', t$ = "折叠导航窗格", n$ = "展开导航窗格", o$ = {
  newFolder: a4,
  upload: r4,
  paste: l4,
  changeView: c4,
  refresh: d4,
  cut: u4,
  copy: p4,
  rename: f4,
  download: h4,
  delete: "删除",
  itemSelected: m4,
  itemsSelected: g4,
  cancel: v4,
  clearSelection: $4,
  completed: y4,
  fileNameChangeWarning: w4,
  no: b4,
  yes: x4,
  close: C4,
  fileTypeNotAllowed: S4,
  fileAlreadyExist: N4,
  maxUploadSize: F4,
  dragFileToUpload: E4,
  chooseFile: P4,
  uploadFail: z4,
  uploading: T4,
  uploaded: L4,
  remove: A4,
  abortUpload: R4,
  preview: k4,
  previewUnavailable: M4,
  home: O4,
  showMoreFolder: I4,
  moveTo: D4,
  folderEmpty: U4,
  selectAll: j4,
  view: H4,
  grid: V4,
  list: B4,
  open: W4,
  nothingHereYet: Y4,
  name: K4,
  modified: _4,
  size: q4,
  deleteItemConfirm: G4,
  deleteItemsConfirm: J4,
  percentDone: Z4,
  canceled: X4,
  invalidFileName: Q4,
  folderExists: e$,
  collapseNavigationPane: t$,
  expandNavigationPane: n$
}, s$ = "Nowy folder", i$ = "Prześlij", a$ = "Wklej", r$ = "Zmień widok", l$ = "Odśwież", c$ = "Wytnij", d$ = "Kopiuj", u$ = "Zmień nazwę", p$ = "Pobierz", f$ = "element zaznaczony", h$ = "elementy zaznaczone", m$ = "Anuluj", g$ = "Wyczyść zaznaczenie", v$ = "Zakończono", $$ = "Jeśli zmienisz rozszerzenie pliku, może on stać się nieużyteczny. Czy na pewno chcesz to zrobić?", y$ = "Nie", w$ = "Tak", b$ = "Zamknij", x$ = "Typ pliku nie jest dozwolony.", C$ = "Plik już istnieje.", S$ = "Maksymalny rozmiar przesyłanego pliku to", N$ = "Przeciągnij pliki, aby je przesłać", F$ = "Wybierz plik", E$ = "Przesyłanie nie powiodło się.", P$ = "Przesyłanie", z$ = "Przesłano", T$ = "Usuń", L$ = "Przerwij przesyłanie", A$ = "Podgląd", R$ = "Przepraszamy! Podgląd tego pliku nie jest dostępny.", k$ = "Strona główna", M$ = "Pokaż więcej folderów", O$ = "Przenieś do", I$ = "Ten folder jest pusty.", D$ = "Zaznacz wszystko", U$ = "Widok", j$ = "Siatka", H$ = "Lista", V$ = "Otwórz", B$ = "Nic tu jeszcze nie ma", W$ = "Nazwa", Y$ = "Zmodyfikowano", K$ = "Rozmiar", _$ = 'Czy na pewno chcesz usunąć "{{fileName}}"?', q$ = "Czy na pewno chcesz usunąć te {{count}} elementy?", G$ = "{{percent}}% ukończono", J$ = "Anulowano", Z$ = 'Nazwa pliku nie może zawierać żadnego z następujących znaków: \\ / : * ? " < > |', X$ = 'To miejsce docelowe zawiera już folder o nazwie "{{renameFile}}".', Q$ = "Zwiń panel nawigacyjny", e6 = "Rozwiń panel nawigacyjny", t6 = {
  newFolder: s$,
  upload: i$,
  paste: a$,
  changeView: r$,
  refresh: l$,
  cut: c$,
  copy: d$,
  rename: u$,
  download: p$,
  delete: "Usuń",
  itemSelected: f$,
  itemsSelected: h$,
  cancel: m$,
  clearSelection: g$,
  completed: v$,
  fileNameChangeWarning: $$,
  no: y$,
  yes: w$,
  close: b$,
  fileTypeNotAllowed: x$,
  fileAlreadyExist: C$,
  maxUploadSize: S$,
  dragFileToUpload: N$,
  chooseFile: F$,
  uploadFail: E$,
  uploading: P$,
  uploaded: z$,
  remove: T$,
  abortUpload: L$,
  preview: A$,
  previewUnavailable: R$,
  home: k$,
  showMoreFolder: M$,
  moveTo: O$,
  folderEmpty: I$,
  selectAll: D$,
  view: U$,
  grid: j$,
  list: H$,
  open: V$,
  nothingHereYet: B$,
  name: W$,
  modified: Y$,
  size: K$,
  deleteItemConfirm: _$,
  deleteItemsConfirm: q$,
  percentDone: G$,
  canceled: J$,
  invalidFileName: Z$,
  folderExists: X$,
  collapseNavigationPane: Q$,
  expandNavigationPane: e6
}, n6 = {
  "ar-SA": { translation: Ts },
  "de-DE": { translation: Pi },
  "en-US": { translation: Ra },
  "es-ES": { translation: Lr },
  "fa-IR": { translation: zl },
  "fr-FR": { translation: Ec },
  "he-IL": { translation: Nd },
  "hi-IN": { translation: Cu },
  "it-IT": { translation: bp },
  "ja-JP": { translation: wf },
  "ko-KR": { translation: $h },
  "pt-BR": { translation: gm },
  "pt-PT": { translation: h1 },
  "ru-RU": { translation: p0 },
  "tr-TR": { translation: ug },
  "uk-UA": { translation: c2 },
  "ur-UR": { translation: rv },
  "vi-VN": { translation: i4 },
  "zh-CN": { translation: o$ },
  "pl-PL": { translation: t6 }
}, o6 = (n = "en-US") => {
  se.isInitialized ? se.changeLanguage(n) : se.init({
    resources: n6,
    lng: n,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: !1
    }
  });
}, En = ze(() => (n) => n), s6 = ({ children: n, language: e }) => {
  const [t, o] = R(() => se.t.bind(se));
  return ee(() => {
    o6(e), o(() => se.t.bind(se));
  }, [e]), /* @__PURE__ */ c(En.Provider, { value: t, children: n });
}, ce = () => Te(En), i6 = ({ setShowToggleViewMenu: n, onLayoutChange: e }) => {
  const t = Oe(() => {
    n(!1);
  }), { activeLayout: o, setActiveLayout: s } = Ce(), i = ce(), a = [
    {
      key: "grid",
      name: i("grid"),
      icon: /* @__PURE__ */ c(mn, { size: 18 })
    },
    {
      key: "list",
      name: i("list"),
      icon: /* @__PURE__ */ c(Be, { size: 18 })
    }
  ], l = (r) => {
    s(r), e(r), n(!1);
  };
  return /* @__PURE__ */ c("div", { ref: t.ref, className: "toggle-view", role: "dropdown", children: /* @__PURE__ */ c("ul", { role: "menu", "aria-orientation": "vertical", children: a.map((r) => /* @__PURE__ */ L(
    "li",
    {
      role: "menuitem",
      onClick: () => l(r.key),
      onKeyDown: () => l(r.key),
      children: [
        /* @__PURE__ */ c("span", { children: r.key === o && /* @__PURE__ */ c(Cn, { size: 13 }) }),
        /* @__PURE__ */ c("span", { children: r.icon }),
        /* @__PURE__ */ c("span", { children: r.name })
      ]
    },
    r.key
  )) }) });
}, Pn = ze(), a6 = ({ children: n, filesData: e, onError: t }) => {
  const [o, s] = R([]);
  ee(() => {
    s(e);
  }, [e]);
  const i = (a) => a.isDirectory ? o.filter((l) => l.path === `${a.path}/${l.name}`) : [];
  return /* @__PURE__ */ c(Pn.Provider, { value: { files: o, setFiles: s, getChildren: i, onError: t }, children: n });
}, Qe = () => Te(Pn), r6 = (n, e = "name", t = "asc") => {
  const o = n.filter((r) => r.isDirectory), s = n.filter((r) => !r.isDirectory), i = (r, u) => {
    let d = 0;
    switch (e) {
      case "name":
        d = r.name.localeCompare(u.name);
        break;
      case "size":
        const f = r.size || 0, p = u.size || 0;
        d = f - p;
        break;
      case "modified":
        const g = r.updatedAt ? new Date(r.updatedAt).getTime() : 0, m = u.updatedAt ? new Date(u.updatedAt).getTime() : 0;
        d = g - m;
        break;
      default:
        d = r.name.localeCompare(u.name);
    }
    return t === "asc" ? d : -d;
  }, a = [...o].sort(i), l = [...s].sort(i);
  return [...a, ...l];
}, zn = ze(), l6 = ({ children: n, initialPath: e, onFolderChange: t }) => {
  const { files: o } = Qe(), s = ae(!1), [i, a] = R(""), [l, r] = R(null), [u, d] = R([]), [f, p] = R({ key: "name", direction: "asc" });
  return ee(() => {
    Array.isArray(o) && o.length > 0 ? (d(() => {
      const g = o.filter((m) => m.path === `${i}/${m.name}`);
      return r6(g, f.key, f.direction);
    }), r(() => o.find((g) => g.path === i) ?? null)) : (d([]), r(null));
  }, [o, i, f]), ee(() => {
    if (!s.current && Array.isArray(o) && o.length > 0) {
      const g = o.some((m) => m.isDirectory && m.path === e) ? e : "";
      a(g), s.current = !0;
    }
  }, [o]), /* @__PURE__ */ c(
    zn.Provider,
    {
      value: {
        currentPath: i,
        setCurrentPath: a,
        currentFolder: l,
        setCurrentFolder: r,
        currentPathFiles: u,
        setCurrentPathFiles: d,
        sortConfig: f,
        setSortConfig: p,
        onFolderChange: t
      },
      children: n
    }
  );
}, ge = () => Te(zn), be = (n, e, ...t) => {
  try {
    if (typeof n == "function")
      n(...t);
    else
      throw new Error(
        `<FileManager /> Missing prop: Callback function "${e}" is required.`
      );
  } catch (o) {
    console.error(o.message);
  }
}, Tn = ze(), c6 = ({ children: n, onDownload: e, onSelect: t, onSelectionChange: o }) => {
  const [s, i] = R([]);
  ee(() => {
    t == null || t(s), o == null || o(s);
  }, [s]);
  const a = () => {
    be(e, "onDownload", s);
  };
  return /* @__PURE__ */ c(Tn.Provider, { value: { selectedFiles: s, setSelectedFiles: i, handleDownload: a }, children: n });
}, ve = () => Te(Tn), Ln = ze(), d6 = ({ children: n, onPaste: e, onCut: t, onCopy: o }) => {
  const [s, i] = R(null), { selectedFiles: a, setSelectedFiles: l } = ve(), r = (d) => {
    i({
      files: a,
      isMoving: d
    }), d ? t && t(a) : o && o(a);
  }, u = (d) => {
    if (d && !d.isDirectory) return;
    const f = s.files, p = s.isMoving ? "move" : "copy";
    be(e, "onPaste", f, d, p), s.isMoving && i(null), l([]);
  };
  return /* @__PURE__ */ c(Ln.Provider, { value: { clipBoard: s, setClipBoard: i, handleCutCopy: r, handlePasting: u }, children: n });
}, et = () => Te(Ln), An = ({ onLayoutChange: n, onRefresh: e, triggerAction: t, permissions: o }) => {
  var T;
  const [s, i] = R(!1), { currentFolder: a } = ge(), { selectedFiles: l, setSelectedFiles: r, handleDownload: u } = ve(), { clipBoard: d, setClipBoard: f, handleCutCopy: p, handlePasting: g } = et(), { activeLayout: m } = Ce(), h = ce(), x = ($) => {
    var w;
    return !($ != null && $.isDirectory) && ((w = $ == null ? void 0 : $.name) == null ? void 0 : w.toLowerCase().endsWith(".zip"));
  }, F = l.length === 1 && x(l[0]), k = [
    {
      icon: /* @__PURE__ */ c(hn, { size: 17, strokeWidth: 0.3 }),
      text: h("newFolder"),
      permission: o.create,
      onClick: () => t.show("createFolder")
    },
    {
      icon: /* @__PURE__ */ c(bn, { size: 18 }),
      text: h("upload"),
      permission: o.upload,
      onClick: () => t.show("uploadFile")
    },
    {
      icon: /* @__PURE__ */ c(ft, { size: 18 }),
      text: h("paste"),
      permission: !!d,
      onClick: A
    }
  ], N = [
    {
      icon: m === "grid" ? /* @__PURE__ */ c(mn, { size: 16 }) : /* @__PURE__ */ c(Be, { size: 16 }),
      title: h("changeView"),
      onClick: () => i(($) => !$)
    },
    {
      icon: /* @__PURE__ */ c(vn, { size: 16 }),
      title: h("refresh"),
      onClick: () => {
        be(e, "onRefresh"), f(null);
      }
    }
  ];
  function A() {
    g(a);
  }
  const v = () => {
    u(), r([]);
  };
  return l.length > 0 ? /* @__PURE__ */ c("div", { className: "toolbar file-selected", children: /* @__PURE__ */ L("div", { className: "file-action-container", children: [
    /* @__PURE__ */ L("div", { children: [
      o.move && /* @__PURE__ */ L("button", { className: "item-action file-action", onClick: () => p(!0), children: [
        /* @__PURE__ */ c(gn, { size: 18 }),
        /* @__PURE__ */ c("span", { children: h("cut") })
      ] }),
      o.copy && /* @__PURE__ */ L("button", { className: "item-action file-action", onClick: () => p(!1), children: [
        /* @__PURE__ */ c(fn, { strokeWidth: 0.1, size: 17 }),
        /* @__PURE__ */ c("span", { children: h("copy") })
      ] }),
      ((T = d == null ? void 0 : d.files) == null ? void 0 : T.length) > 0 && /* @__PURE__ */ L(
        "button",
        {
          className: "item-action file-action",
          onClick: A,
          children: [
            /* @__PURE__ */ c(ft, { size: 18 }),
            /* @__PURE__ */ c("span", { children: h("paste") })
          ]
        }
      ),
      l.length === 1 && o.rename && /* @__PURE__ */ L(
        "button",
        {
          className: "item-action file-action",
          onClick: () => t.show("rename"),
          children: [
            /* @__PURE__ */ c(xn, { size: 19 }),
            /* @__PURE__ */ c("span", { children: h("rename") })
          ]
        }
      ),
      o.download && /* @__PURE__ */ L("button", { className: "item-action file-action", onClick: v, children: [
        /* @__PURE__ */ c(gt, { size: 19 }),
        /* @__PURE__ */ c("span", { children: h("download") })
      ] }),
      o.compress && /* @__PURE__ */ L(
        "button",
        {
          className: "item-action file-action",
          onClick: () => t.show("compress"),
          children: [
            /* @__PURE__ */ c(wn, { size: 19 }),
            /* @__PURE__ */ c("span", { children: h("compress") })
          ]
        }
      ),
      o.extract && F && /* @__PURE__ */ L(
        "button",
        {
          className: "item-action file-action",
          onClick: () => t.show("extract"),
          children: [
            /* @__PURE__ */ c($n, { size: 19 }),
            /* @__PURE__ */ c("span", { children: h("extract") })
          ]
        }
      ),
      o.delete && /* @__PURE__ */ L(
        "button",
        {
          className: "item-action file-action",
          onClick: () => t.show("delete"),
          children: [
            /* @__PURE__ */ c(yn, { size: 19 }),
            /* @__PURE__ */ c("span", { children: h("delete") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ L(
      "button",
      {
        className: "item-action file-action",
        title: h("clearSelection"),
        onClick: () => r([]),
        children: [
          /* @__PURE__ */ L("span", { children: [
            l.length,
            " ",
            h(l.length > 1 ? "itemsSelected" : "itemSelected")
          ] }),
          /* @__PURE__ */ c(no, { size: 18 })
        ]
      }
    )
  ] }) }) : /* @__PURE__ */ c("div", { className: "toolbar", children: /* @__PURE__ */ L("div", { className: "fm-toolbar", children: [
    /* @__PURE__ */ c("div", { children: k.filter(($) => $.permission).map(($, w) => /* @__PURE__ */ L("button", { className: "item-action", onClick: $.onClick, children: [
      $.icon,
      /* @__PURE__ */ c("span", { children: $.text })
    ] }, w)) }),
    /* @__PURE__ */ L("div", { children: [
      N.map(($, w) => /* @__PURE__ */ L("div", { className: "toolbar-left-items", children: [
        /* @__PURE__ */ c("button", { className: "item-action icon-only", title: $.title, onClick: $.onClick, children: $.icon }),
        w !== N.length - 1 && /* @__PURE__ */ c("div", { className: "item-separator" })
      ] }, w)),
      s && /* @__PURE__ */ c(
        i6,
        {
          setShowToggleViewMenu: i,
          onLayoutChange: n
        }
      )
    ] })
  ] }) });
};
An.displayName = "Toolbar";
var u6 = process.env.NODE_ENV === "production";
function p6(n, e) {
  if (!u6) {
    if (n)
      return;
    var t = "Warning: " + e;
    typeof console < "u" && console.warn(t);
    try {
      throw Error(t);
    } catch {
    }
  }
}
/**
  * react-collapsed v4.2.0
  *
  * Copyright (c) 2019-2024, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */
var f6 = class extends Error {
  constructor(n) {
    super(`react-collapsed: ${n}`);
  }
}, Ge = (...n) => p6(n[0], `[react-collapsed] -- ${n[1]}`);
function Rn(n) {
  const e = ae(n);
  return ee(() => {
    e.current = n;
  }), dn((...t) => {
    var o;
    return (o = e.current) == null ? void 0 : o.call(e, ...t);
  }, []);
}
function h6(n, e, t) {
  const [o, s] = R(e), i = ae(typeof n < "u"), a = i.current ? n : o, l = Rn(t), r = dn(
    (u) => {
      const f = typeof u == "function" ? u(a) : u;
      i.current || s(f), l == null || l(f);
    },
    [l, a]
  );
  return ee(() => {
    Ge(
      !(i.current && n == null),
      "`isExpanded` state is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop."
    ), Ge(
      !(!i.current && n != null),
      "`isExpanded` state is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop."
    );
  }, [n]), [a, r];
}
var m6 = "(prefers-reduced-motion: reduce)";
function g6() {
  const [n, e] = R(!1);
  return ee(() => {
    if (typeof window > "u" || typeof window.matchMedia != "function")
      return;
    const t = window.matchMedia(m6);
    e(t.matches);
    const o = (s) => {
      e(s.matches);
    };
    if (t.addEventListener)
      return t.addEventListener("change", o), () => {
        t.removeEventListener("change", o);
      };
    if (t.addListener)
      return t.addListener(o), () => {
        t.removeListener(o);
      };
  }, []), n;
}
var v6 = ke.useId || (() => {
});
function $6() {
  return v6() ?? "";
}
var y6 = typeof window < "u" ? ke.useLayoutEffect : ke.useEffect, st = !1, w6 = 0, Vt = () => ++w6;
function b6(n) {
  const e = n || (st ? Vt() : null), [t, o] = ke.useState(e);
  return y6(() => {
    t === null && o(Vt());
  }, []), ke.useEffect(() => {
    st === !1 && (st = !0);
  }, []), t != null ? String(t) : void 0;
}
function x6(n) {
  const e = $6(), t = b6(n);
  return typeof n == "string" ? n : typeof e == "string" ? e : t;
}
function C6(n, e) {
  const t = performance.now(), o = {};
  function s() {
    o.id = requestAnimationFrame((i) => {
      i - t > e ? n() : s();
    });
  }
  return s(), o;
}
function Bt(n) {
  n.id && cancelAnimationFrame(n.id);
}
function Wt(n) {
  return n != null && n.current ? n.current.scrollHeight : (Ge(
    !0,
    "Was not able to find a ref to the collapse element via `getCollapseProps`. Ensure that the element exposes its `ref` prop. If it exposes the ref prop under a different name (like `innerRef`), use the `refKey` property to change it. Example:\n\nconst collapseProps = getCollapseProps({refKey: 'innerRef'})"
  ), 0);
}
function S6(n) {
  if (!n || typeof n == "string")
    return 0;
  const e = n / 36;
  return Math.round((4 + 15 * e ** 0.25 + e / 5) * 10);
}
function N6(n, e) {
  if (n != null)
    if (typeof n == "function")
      n(e);
    else
      try {
        n.current = e;
      } catch {
        throw new f6(`Cannot assign value "${e}" to ref "${n}"`);
      }
}
function Yt(...n) {
  return n.every((e) => e == null) ? null : (e) => {
    n.forEach((t) => {
      N6(t, e);
    });
  };
}
function F6(n) {
  let e = (t) => {
  };
  e = (t) => {
    if (!(t != null && t.current))
      return;
    const { paddingTop: o, paddingBottom: s } = window.getComputedStyle(t.current);
    Ge(
      !(o && o !== "0px" || s && s !== "0px"),
      `Padding applied to the collapse element will cause the animation to break and not perform as expected. To fix, apply equivalent padding to the direct descendent of the collapse element. Example:

Before:   <div {...getCollapseProps({style: {padding: 10}})}>{children}</div>

After:   <div {...getCollapseProps()}>
             <div style={{padding: 10}}>
                 {children}
             </div>
          </div>`
    );
  }, ee(() => {
    e(n);
  }, [n]);
}
var E6 = typeof window > "u" ? ee : Kn;
function P6({
  duration: n,
  easing: e = "cubic-bezier(0.4, 0, 0.2, 1)",
  onTransitionStateChange: t = () => {
  },
  isExpanded: o,
  defaultExpanded: s = !1,
  hasDisabledAnimation: i,
  id: a,
  ...l
} = {}) {
  const r = Rn(t), u = x6(a ? `${a}` : void 0), [d, f] = h6(
    o,
    s
  ), p = ae(d), [g, m] = R(!1), h = g6(), x = i ?? h, F = ae(), k = ae(), N = ae(null), [A, v] = R(null);
  F6(N);
  const T = `${l.collapsedHeight || 0}px`;
  function $(w) {
    if (!N.current)
      return;
    const y = N.current;
    for (const C in w) {
      const S = w[C];
      S ? y.style[C] = S : y.style.removeProperty(C);
    }
  }
  return E6(() => {
    if (!N.current || d === p.current)
      return;
    p.current = d;
    function y(E) {
      return x ? 0 : n ?? S6(E);
    }
    const C = (E) => `height ${y(E)}ms ${e}`, S = (E) => {
      function I() {
        d ? ($({
          height: "",
          overflow: "",
          transition: "",
          display: ""
        }), r("expandEnd")) : ($({ transition: "" }), r("collapseEnd")), m(!1);
      }
      k.current && Bt(k.current), k.current = C6(I, E);
    };
    return m(!0), d ? F.current = requestAnimationFrame(() => {
      r("expandStart"), $({
        display: "block",
        overflow: "hidden",
        height: T
      }), F.current = requestAnimationFrame(() => {
        r("expanding");
        const E = Wt(N);
        S(y(E)), N.current && (N.current.style.transition = C(E), N.current.style.height = `${E}px`);
      });
    }) : F.current = requestAnimationFrame(() => {
      r("collapseStart");
      const E = Wt(N);
      S(y(E)), $({
        transition: C(E),
        height: `${E}px`
      }), F.current = requestAnimationFrame(() => {
        r("collapsing"), $({
          height: T,
          overflow: "hidden"
        });
      });
    }), () => {
      F.current && cancelAnimationFrame(F.current), k.current && Bt(k.current);
    };
  }, [
    d,
    T,
    x,
    n,
    e,
    r
  ]), {
    isExpanded: d,
    setExpanded: f,
    getToggleProps(w) {
      const { disabled: y, onClick: C, refKey: S, ...E } = {
        refKey: "ref",
        onClick() {
        },
        disabled: !1,
        ...w
      }, I = A ? A.tagName === "BUTTON" : void 0, M = w == null ? void 0 : w[S || "ref"], D = {
        id: `react-collapsed-toggle-${u}`,
        "aria-controls": `react-collapsed-panel-${u}`,
        "aria-expanded": d,
        onClick(re) {
          y || (C == null || C(re), f((K) => !K));
        },
        [S || "ref"]: Yt(M, v)
      }, J = {
        type: "button",
        disabled: y ? !0 : void 0
      }, oe = {
        "aria-disabled": y ? !0 : void 0,
        role: "button",
        tabIndex: y ? -1 : 0
      };
      return I === !1 ? { ...D, ...oe, ...E } : I === !0 ? { ...D, ...J, ...E } : {
        ...D,
        ...J,
        ...oe,
        ...E
      };
    },
    getCollapseProps(w) {
      const { style: y, refKey: C } = { refKey: "ref", style: {}, ...w }, S = w == null ? void 0 : w[C || "ref"];
      return {
        id: `react-collapsed-panel-${u}`,
        "aria-hidden": !d,
        "aria-labelledby": `react-collapsed-toggle-${u}`,
        role: "region",
        ...w,
        [C || "ref"]: Yt(N, S),
        style: {
          boxSizing: "border-box",
          ...!g && !d ? {
            // collapsed and not animating
            display: T === "0px" ? "none" : "block",
            height: T,
            overflow: "hidden"
          } : {},
          // additional styles passed, e.g. getCollapseProps({style: {}})
          ...y
        }
      };
    }
  };
}
const z6 = ({ open: n, children: e }) => {
  const [t, o] = R(n), { getCollapseProps: s } = P6({
    isExpanded: t,
    duration: 500
  });
  return ee(() => {
    o(n);
  }, [n, o]), /* @__PURE__ */ c(me, { children: /* @__PURE__ */ c("div", { ...s(), children: e }) });
};
function T6(n) {
  return U({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z" }, child: [] }] })(n);
}
function L6(n) {
  return U({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M288 248v28c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-28c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm-12 72H108c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-28c0-6.6-5.4-12-12-12zm108-188.1V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48C0 21.5 21.5 0 48 0h204.1C264.8 0 277 5.1 286 14.1L369.9 98c9 8.9 14.1 21.2 14.1 33.9zm-128-80V128h76.1L256 51.9zM336 464V176H232c-13.3 0-24-10.7-24-24V48H48v416h288z" }, child: [] }] })(n);
}
function Kt(n) {
  return U({ attr: { viewBox: "0 0 576 512" }, child: [{ tag: "path", attr: { d: "M527.9 224H480v-48c0-26.5-21.5-48-48-48H272l-64-64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h400c16.5 0 31.9-8.5 40.7-22.6l79.9-128c20-31.9-3-73.4-40.7-73.4zM48 118c0-3.3 2.7-6 6-6h134.1l64 64H426c3.3 0 6 2.7 6 6v42H152c-16.8 0-32.4 8.8-41.1 23.2L48 351.4zm400 282H72l77.2-128H528z" }, child: [] }] })(n);
}
function _t(n) {
  return U({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M464 128H272l-54.63-54.63c-6-6-14.14-9.37-22.63-9.37H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zm0 272H48V112h140.12l54.63 54.63c6 6 14.14 9.37 22.63 9.37H464v224z" }, child: [] }] })(n);
}
const kn = ({ folder: n, onFileOpen: e }) => {
  const [t, o] = R(!1), [s, i] = R(!1), { currentPath: a, setCurrentPath: l, onFolderChange: r } = ge(), u = () => {
    i(!0), e(n), l(n.path), r == null || r(n.path);
  }, d = (f) => {
    f.stopPropagation(), o((p) => !p);
  };
  return ee(() => {
    i(a === n.path);
    const f = a.split("/");
    f.pop(), f.join("/") === n.path && o(!0);
  }, [a]), n.subDirectories.length > 0 ? /* @__PURE__ */ L(me, { children: [
    /* @__PURE__ */ L(
      "div",
      {
        className: `sb-folders-list-item ${s ? "active-list-item" : ""}`,
        onClick: u,
        children: [
          /* @__PURE__ */ c("span", { onClick: d, children: /* @__PURE__ */ c(
            oo,
            {
              size: 20,
              className: `folder-icon-default ${t ? "folder-rotate-down" : ""}`
            }
          ) }),
          /* @__PURE__ */ L("div", { className: "sb-folder-details", children: [
            t || s ? /* @__PURE__ */ c(Kt, { size: 20, className: "folder-open-icon" }) : /* @__PURE__ */ c(_t, { size: 17, className: "folder-close-icon" }),
            /* @__PURE__ */ c("span", { className: "sb-folder-name", title: n.name, children: n.name })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ c(z6, { open: t, children: /* @__PURE__ */ c("div", { className: "folder-collapsible", children: n.subDirectories.map((f, p) => /* @__PURE__ */ c(kn, { folder: f, onFileOpen: e }, p)) }) })
  ] }) : /* @__PURE__ */ L(
    "div",
    {
      className: `sb-folders-list-item ${s ? "active-list-item" : ""}`,
      onClick: u,
      children: [
        /* @__PURE__ */ c("span", { className: "non-expanable" }),
        /* @__PURE__ */ L("div", { className: "sb-folder-details", children: [
          s ? /* @__PURE__ */ c(Kt, { size: 20, className: "folder-open-icon" }) : /* @__PURE__ */ c(_t, { size: 17, className: "folder-close-icon" }),
          /* @__PURE__ */ c("span", { className: "sb-folder-name", title: n.name, children: n.name })
        ] })
      ]
    }
  );
}, A6 = (n) => n == null ? void 0 : n.split("/").slice(0, -1).join("/"), Mn = ({ onFileOpen: n }) => {
  const [e, t] = R([]), { files: o } = Qe(), s = ce(), i = (a, l) => {
    var r;
    return l[a] ? (r = l[a]) == null ? void 0 : r.map((u) => ({
      ...u,
      subDirectories: i(u.path, l)
    })) : [];
  };
  return ee(() => {
    if (Array.isArray(o)) {
      const a = o.filter((r) => r.isDirectory), l = Object.groupBy(a, ({ path: r }) => A6(r));
      t(() => i("", l));
    }
  }, [o]), /* @__PURE__ */ c("div", { className: "sb-folders-list", children: (e == null ? void 0 : e.length) > 0 ? /* @__PURE__ */ c(me, { children: e == null ? void 0 : e.map((a, l) => /* @__PURE__ */ c(kn, { folder: a, onFileOpen: n }, l)) }) : /* @__PURE__ */ c("div", { className: "empty-nav-pane", children: s("nothingHereYet") }) });
};
Mn.displayName = "NavigationPane";
function R6(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ue = { exports: {} }, je = { exports: {} }, te = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qt;
function k6() {
  if (qt) return te;
  qt = 1;
  var n = typeof Symbol == "function" && Symbol.for, e = n ? Symbol.for("react.element") : 60103, t = n ? Symbol.for("react.portal") : 60106, o = n ? Symbol.for("react.fragment") : 60107, s = n ? Symbol.for("react.strict_mode") : 60108, i = n ? Symbol.for("react.profiler") : 60114, a = n ? Symbol.for("react.provider") : 60109, l = n ? Symbol.for("react.context") : 60110, r = n ? Symbol.for("react.async_mode") : 60111, u = n ? Symbol.for("react.concurrent_mode") : 60111, d = n ? Symbol.for("react.forward_ref") : 60112, f = n ? Symbol.for("react.suspense") : 60113, p = n ? Symbol.for("react.suspense_list") : 60120, g = n ? Symbol.for("react.memo") : 60115, m = n ? Symbol.for("react.lazy") : 60116, h = n ? Symbol.for("react.block") : 60121, x = n ? Symbol.for("react.fundamental") : 60117, F = n ? Symbol.for("react.responder") : 60118, k = n ? Symbol.for("react.scope") : 60119;
  function N(v) {
    if (typeof v == "object" && v !== null) {
      var T = v.$$typeof;
      switch (T) {
        case e:
          switch (v = v.type, v) {
            case r:
            case u:
            case o:
            case i:
            case s:
            case f:
              return v;
            default:
              switch (v = v && v.$$typeof, v) {
                case l:
                case d:
                case m:
                case g:
                case a:
                  return v;
                default:
                  return T;
              }
          }
        case t:
          return T;
      }
    }
  }
  function A(v) {
    return N(v) === u;
  }
  return te.AsyncMode = r, te.ConcurrentMode = u, te.ContextConsumer = l, te.ContextProvider = a, te.Element = e, te.ForwardRef = d, te.Fragment = o, te.Lazy = m, te.Memo = g, te.Portal = t, te.Profiler = i, te.StrictMode = s, te.Suspense = f, te.isAsyncMode = function(v) {
    return A(v) || N(v) === r;
  }, te.isConcurrentMode = A, te.isContextConsumer = function(v) {
    return N(v) === l;
  }, te.isContextProvider = function(v) {
    return N(v) === a;
  }, te.isElement = function(v) {
    return typeof v == "object" && v !== null && v.$$typeof === e;
  }, te.isForwardRef = function(v) {
    return N(v) === d;
  }, te.isFragment = function(v) {
    return N(v) === o;
  }, te.isLazy = function(v) {
    return N(v) === m;
  }, te.isMemo = function(v) {
    return N(v) === g;
  }, te.isPortal = function(v) {
    return N(v) === t;
  }, te.isProfiler = function(v) {
    return N(v) === i;
  }, te.isStrictMode = function(v) {
    return N(v) === s;
  }, te.isSuspense = function(v) {
    return N(v) === f;
  }, te.isValidElementType = function(v) {
    return typeof v == "string" || typeof v == "function" || v === o || v === u || v === i || v === s || v === f || v === p || typeof v == "object" && v !== null && (v.$$typeof === m || v.$$typeof === g || v.$$typeof === a || v.$$typeof === l || v.$$typeof === d || v.$$typeof === x || v.$$typeof === F || v.$$typeof === k || v.$$typeof === h);
  }, te.typeOf = N, te;
}
var ne = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gt;
function M6() {
  return Gt || (Gt = 1, process.env.NODE_ENV !== "production" && function() {
    var n = typeof Symbol == "function" && Symbol.for, e = n ? Symbol.for("react.element") : 60103, t = n ? Symbol.for("react.portal") : 60106, o = n ? Symbol.for("react.fragment") : 60107, s = n ? Symbol.for("react.strict_mode") : 60108, i = n ? Symbol.for("react.profiler") : 60114, a = n ? Symbol.for("react.provider") : 60109, l = n ? Symbol.for("react.context") : 60110, r = n ? Symbol.for("react.async_mode") : 60111, u = n ? Symbol.for("react.concurrent_mode") : 60111, d = n ? Symbol.for("react.forward_ref") : 60112, f = n ? Symbol.for("react.suspense") : 60113, p = n ? Symbol.for("react.suspense_list") : 60120, g = n ? Symbol.for("react.memo") : 60115, m = n ? Symbol.for("react.lazy") : 60116, h = n ? Symbol.for("react.block") : 60121, x = n ? Symbol.for("react.fundamental") : 60117, F = n ? Symbol.for("react.responder") : 60118, k = n ? Symbol.for("react.scope") : 60119;
    function N(z) {
      return typeof z == "string" || typeof z == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      z === o || z === u || z === i || z === s || z === f || z === p || typeof z == "object" && z !== null && (z.$$typeof === m || z.$$typeof === g || z.$$typeof === a || z.$$typeof === l || z.$$typeof === d || z.$$typeof === x || z.$$typeof === F || z.$$typeof === k || z.$$typeof === h);
    }
    function A(z) {
      if (typeof z == "object" && z !== null) {
        var le = z.$$typeof;
        switch (le) {
          case e:
            var X = z.type;
            switch (X) {
              case r:
              case u:
              case o:
              case i:
              case s:
              case f:
                return X;
              default:
                var ue = X && X.$$typeof;
                switch (ue) {
                  case l:
                  case d:
                  case m:
                  case g:
                  case a:
                    return ue;
                  default:
                    return le;
                }
            }
          case t:
            return le;
        }
      }
    }
    var v = r, T = u, $ = l, w = a, y = e, C = d, S = o, E = m, I = g, M = t, D = i, J = s, oe = f, re = !1;
    function K(z) {
      return re || (re = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), b(z) || A(z) === r;
    }
    function b(z) {
      return A(z) === u;
    }
    function P(z) {
      return A(z) === l;
    }
    function B(z) {
      return A(z) === a;
    }
    function j(z) {
      return typeof z == "object" && z !== null && z.$$typeof === e;
    }
    function H(z) {
      return A(z) === d;
    }
    function _(z) {
      return A(z) === o;
    }
    function W(z) {
      return A(z) === m;
    }
    function Y(z) {
      return A(z) === g;
    }
    function q(z) {
      return A(z) === t;
    }
    function Z(z) {
      return A(z) === i;
    }
    function G(z) {
      return A(z) === s;
    }
    function ie(z) {
      return A(z) === f;
    }
    ne.AsyncMode = v, ne.ConcurrentMode = T, ne.ContextConsumer = $, ne.ContextProvider = w, ne.Element = y, ne.ForwardRef = C, ne.Fragment = S, ne.Lazy = E, ne.Memo = I, ne.Portal = M, ne.Profiler = D, ne.StrictMode = J, ne.Suspense = oe, ne.isAsyncMode = K, ne.isConcurrentMode = b, ne.isContextConsumer = P, ne.isContextProvider = B, ne.isElement = j, ne.isForwardRef = H, ne.isFragment = _, ne.isLazy = W, ne.isMemo = Y, ne.isPortal = q, ne.isProfiler = Z, ne.isStrictMode = G, ne.isSuspense = ie, ne.isValidElementType = N, ne.typeOf = A;
  }()), ne;
}
var Jt;
function On() {
  return Jt || (Jt = 1, process.env.NODE_ENV === "production" ? je.exports = k6() : je.exports = M6()), je.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var it, Zt;
function O6() {
  if (Zt) return it;
  Zt = 1;
  var n = Object.getOwnPropertySymbols, e = Object.prototype.hasOwnProperty, t = Object.prototype.propertyIsEnumerable;
  function o(i) {
    if (i == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(i);
  }
  function s() {
    try {
      if (!Object.assign)
        return !1;
      var i = new String("abc");
      if (i[5] = "de", Object.getOwnPropertyNames(i)[0] === "5")
        return !1;
      for (var a = {}, l = 0; l < 10; l++)
        a["_" + String.fromCharCode(l)] = l;
      var r = Object.getOwnPropertyNames(a).map(function(d) {
        return a[d];
      });
      if (r.join("") !== "0123456789")
        return !1;
      var u = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(d) {
        u[d] = d;
      }), Object.keys(Object.assign({}, u)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return it = s() ? Object.assign : function(i, a) {
    for (var l, r = o(i), u, d = 1; d < arguments.length; d++) {
      l = Object(arguments[d]);
      for (var f in l)
        e.call(l, f) && (r[f] = l[f]);
      if (n) {
        u = n(l);
        for (var p = 0; p < u.length; p++)
          t.call(l, u[p]) && (r[u[p]] = l[u[p]]);
      }
    }
    return r;
  }, it;
}
var at, Xt;
function vt() {
  if (Xt) return at;
  Xt = 1;
  var n = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return at = n, at;
}
var rt, Qt;
function In() {
  return Qt || (Qt = 1, rt = Function.call.bind(Object.prototype.hasOwnProperty)), rt;
}
var lt, en;
function I6() {
  if (en) return lt;
  en = 1;
  var n = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var e = /* @__PURE__ */ vt(), t = {}, o = /* @__PURE__ */ In();
    n = function(i) {
      var a = "Warning: " + i;
      typeof console < "u" && console.error(a);
      try {
        throw new Error(a);
      } catch {
      }
    };
  }
  function s(i, a, l, r, u) {
    if (process.env.NODE_ENV !== "production") {
      for (var d in i)
        if (o(i, d)) {
          var f;
          try {
            if (typeof i[d] != "function") {
              var p = Error(
                (r || "React class") + ": " + l + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof i[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw p.name = "Invariant Violation", p;
            }
            f = i[d](a, d, r, l, null, e);
          } catch (m) {
            f = m;
          }
          if (f && !(f instanceof Error) && n(
            (r || "React class") + ": type specification of " + l + " `" + d + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof f + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), f instanceof Error && !(f.message in t)) {
            t[f.message] = !0;
            var g = u ? u() : "";
            n(
              "Failed " + l + " type: " + f.message + (g ?? "")
            );
          }
        }
    }
  }
  return s.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (t = {});
  }, lt = s, lt;
}
var ct, tn;
function D6() {
  if (tn) return ct;
  tn = 1;
  var n = On(), e = O6(), t = /* @__PURE__ */ vt(), o = /* @__PURE__ */ In(), s = /* @__PURE__ */ I6(), i = function() {
  };
  process.env.NODE_ENV !== "production" && (i = function(l) {
    var r = "Warning: " + l;
    typeof console < "u" && console.error(r);
    try {
      throw new Error(r);
    } catch {
    }
  });
  function a() {
    return null;
  }
  return ct = function(l, r) {
    var u = typeof Symbol == "function" && Symbol.iterator, d = "@@iterator";
    function f(b) {
      var P = b && (u && b[u] || b[d]);
      if (typeof P == "function")
        return P;
    }
    var p = "<<anonymous>>", g = {
      array: F("array"),
      bigint: F("bigint"),
      bool: F("boolean"),
      func: F("function"),
      number: F("number"),
      object: F("object"),
      string: F("string"),
      symbol: F("symbol"),
      any: k(),
      arrayOf: N,
      element: A(),
      elementType: v(),
      instanceOf: T,
      node: C(),
      objectOf: w,
      oneOf: $,
      oneOfType: y,
      shape: E,
      exact: I
    };
    function m(b, P) {
      return b === P ? b !== 0 || 1 / b === 1 / P : b !== b && P !== P;
    }
    function h(b, P) {
      this.message = b, this.data = P && typeof P == "object" ? P : {}, this.stack = "";
    }
    h.prototype = Error.prototype;
    function x(b) {
      if (process.env.NODE_ENV !== "production")
        var P = {}, B = 0;
      function j(_, W, Y, q, Z, G, ie) {
        if (q = q || p, G = G || Y, ie !== t) {
          if (r) {
            var z = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw z.name = "Invariant Violation", z;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var le = q + ":" + Y;
            !P[le] && // Avoid spamming the console because they are often not actionable except for lib authors
            B < 3 && (i(
              "You are manually calling a React.PropTypes validation function for the `" + G + "` prop on `" + q + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), P[le] = !0, B++);
          }
        }
        return W[Y] == null ? _ ? W[Y] === null ? new h("The " + Z + " `" + G + "` is marked as required " + ("in `" + q + "`, but its value is `null`.")) : new h("The " + Z + " `" + G + "` is marked as required in " + ("`" + q + "`, but its value is `undefined`.")) : null : b(W, Y, q, Z, G);
      }
      var H = j.bind(null, !1);
      return H.isRequired = j.bind(null, !0), H;
    }
    function F(b) {
      function P(B, j, H, _, W, Y) {
        var q = B[j], Z = J(q);
        if (Z !== b) {
          var G = oe(q);
          return new h(
            "Invalid " + _ + " `" + W + "` of type " + ("`" + G + "` supplied to `" + H + "`, expected ") + ("`" + b + "`."),
            { expectedType: b }
          );
        }
        return null;
      }
      return x(P);
    }
    function k() {
      return x(a);
    }
    function N(b) {
      function P(B, j, H, _, W) {
        if (typeof b != "function")
          return new h("Property `" + W + "` of component `" + H + "` has invalid PropType notation inside arrayOf.");
        var Y = B[j];
        if (!Array.isArray(Y)) {
          var q = J(Y);
          return new h("Invalid " + _ + " `" + W + "` of type " + ("`" + q + "` supplied to `" + H + "`, expected an array."));
        }
        for (var Z = 0; Z < Y.length; Z++) {
          var G = b(Y, Z, H, _, W + "[" + Z + "]", t);
          if (G instanceof Error)
            return G;
        }
        return null;
      }
      return x(P);
    }
    function A() {
      function b(P, B, j, H, _) {
        var W = P[B];
        if (!l(W)) {
          var Y = J(W);
          return new h("Invalid " + H + " `" + _ + "` of type " + ("`" + Y + "` supplied to `" + j + "`, expected a single ReactElement."));
        }
        return null;
      }
      return x(b);
    }
    function v() {
      function b(P, B, j, H, _) {
        var W = P[B];
        if (!n.isValidElementType(W)) {
          var Y = J(W);
          return new h("Invalid " + H + " `" + _ + "` of type " + ("`" + Y + "` supplied to `" + j + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return x(b);
    }
    function T(b) {
      function P(B, j, H, _, W) {
        if (!(B[j] instanceof b)) {
          var Y = b.name || p, q = K(B[j]);
          return new h("Invalid " + _ + " `" + W + "` of type " + ("`" + q + "` supplied to `" + H + "`, expected ") + ("instance of `" + Y + "`."));
        }
        return null;
      }
      return x(P);
    }
    function $(b) {
      if (!Array.isArray(b))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? i(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : i("Invalid argument supplied to oneOf, expected an array.")), a;
      function P(B, j, H, _, W) {
        for (var Y = B[j], q = 0; q < b.length; q++)
          if (m(Y, b[q]))
            return null;
        var Z = JSON.stringify(b, function(ie, z) {
          var le = oe(z);
          return le === "symbol" ? String(z) : z;
        });
        return new h("Invalid " + _ + " `" + W + "` of value `" + String(Y) + "` " + ("supplied to `" + H + "`, expected one of " + Z + "."));
      }
      return x(P);
    }
    function w(b) {
      function P(B, j, H, _, W) {
        if (typeof b != "function")
          return new h("Property `" + W + "` of component `" + H + "` has invalid PropType notation inside objectOf.");
        var Y = B[j], q = J(Y);
        if (q !== "object")
          return new h("Invalid " + _ + " `" + W + "` of type " + ("`" + q + "` supplied to `" + H + "`, expected an object."));
        for (var Z in Y)
          if (o(Y, Z)) {
            var G = b(Y, Z, H, _, W + "." + Z, t);
            if (G instanceof Error)
              return G;
          }
        return null;
      }
      return x(P);
    }
    function y(b) {
      if (!Array.isArray(b))
        return process.env.NODE_ENV !== "production" && i("Invalid argument supplied to oneOfType, expected an instance of array."), a;
      for (var P = 0; P < b.length; P++) {
        var B = b[P];
        if (typeof B != "function")
          return i(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + re(B) + " at index " + P + "."
          ), a;
      }
      function j(H, _, W, Y, q) {
        for (var Z = [], G = 0; G < b.length; G++) {
          var ie = b[G], z = ie(H, _, W, Y, q, t);
          if (z == null)
            return null;
          z.data && o(z.data, "expectedType") && Z.push(z.data.expectedType);
        }
        var le = Z.length > 0 ? ", expected one of type [" + Z.join(", ") + "]" : "";
        return new h("Invalid " + Y + " `" + q + "` supplied to " + ("`" + W + "`" + le + "."));
      }
      return x(j);
    }
    function C() {
      function b(P, B, j, H, _) {
        return M(P[B]) ? null : new h("Invalid " + H + " `" + _ + "` supplied to " + ("`" + j + "`, expected a ReactNode."));
      }
      return x(b);
    }
    function S(b, P, B, j, H) {
      return new h(
        (b || "React class") + ": " + P + " type `" + B + "." + j + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + H + "`."
      );
    }
    function E(b) {
      function P(B, j, H, _, W) {
        var Y = B[j], q = J(Y);
        if (q !== "object")
          return new h("Invalid " + _ + " `" + W + "` of type `" + q + "` " + ("supplied to `" + H + "`, expected `object`."));
        for (var Z in b) {
          var G = b[Z];
          if (typeof G != "function")
            return S(H, _, W, Z, oe(G));
          var ie = G(Y, Z, H, _, W + "." + Z, t);
          if (ie)
            return ie;
        }
        return null;
      }
      return x(P);
    }
    function I(b) {
      function P(B, j, H, _, W) {
        var Y = B[j], q = J(Y);
        if (q !== "object")
          return new h("Invalid " + _ + " `" + W + "` of type `" + q + "` " + ("supplied to `" + H + "`, expected `object`."));
        var Z = e({}, B[j], b);
        for (var G in Z) {
          var ie = b[G];
          if (o(b, G) && typeof ie != "function")
            return S(H, _, W, G, oe(ie));
          if (!ie)
            return new h(
              "Invalid " + _ + " `" + W + "` key `" + G + "` supplied to `" + H + "`.\nBad object: " + JSON.stringify(B[j], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(b), null, "  ")
            );
          var z = ie(Y, G, H, _, W + "." + G, t);
          if (z)
            return z;
        }
        return null;
      }
      return x(P);
    }
    function M(b) {
      switch (typeof b) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !b;
        case "object":
          if (Array.isArray(b))
            return b.every(M);
          if (b === null || l(b))
            return !0;
          var P = f(b);
          if (P) {
            var B = P.call(b), j;
            if (P !== b.entries) {
              for (; !(j = B.next()).done; )
                if (!M(j.value))
                  return !1;
            } else
              for (; !(j = B.next()).done; ) {
                var H = j.value;
                if (H && !M(H[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function D(b, P) {
      return b === "symbol" ? !0 : P ? P["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && P instanceof Symbol : !1;
    }
    function J(b) {
      var P = typeof b;
      return Array.isArray(b) ? "array" : b instanceof RegExp ? "object" : D(P, b) ? "symbol" : P;
    }
    function oe(b) {
      if (typeof b > "u" || b === null)
        return "" + b;
      var P = J(b);
      if (P === "object") {
        if (b instanceof Date)
          return "date";
        if (b instanceof RegExp)
          return "regexp";
      }
      return P;
    }
    function re(b) {
      var P = oe(b);
      switch (P) {
        case "array":
        case "object":
          return "an " + P;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + P;
        default:
          return P;
      }
    }
    function K(b) {
      return !b.constructor || !b.constructor.name ? p : b.constructor.name;
    }
    return g.checkPropTypes = s, g.resetWarningCache = s.resetWarningCache, g.PropTypes = g, g;
  }, ct;
}
var dt, nn;
function U6() {
  if (nn) return dt;
  nn = 1;
  var n = /* @__PURE__ */ vt();
  function e() {
  }
  function t() {
  }
  return t.resetWarningCache = e, dt = function() {
    function o(a, l, r, u, d, f) {
      if (f !== n) {
        var p = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw p.name = "Invariant Violation", p;
      }
    }
    o.isRequired = o;
    function s() {
      return o;
    }
    var i = {
      array: o,
      bigint: o,
      bool: o,
      func: o,
      number: o,
      object: o,
      string: o,
      symbol: o,
      any: o,
      arrayOf: s,
      element: o,
      elementType: o,
      instanceOf: s,
      node: o,
      objectOf: s,
      oneOf: s,
      oneOfType: s,
      shape: s,
      exact: s,
      checkPropTypes: t,
      resetWarningCache: e
    };
    return i.PropTypes = i, i;
  }, dt;
}
var on;
function j6() {
  if (on) return Ue.exports;
  if (on = 1, process.env.NODE_ENV !== "production") {
    var n = On(), e = !0;
    Ue.exports = /* @__PURE__ */ D6()(n.isElement, e);
  } else
    Ue.exports = /* @__PURE__ */ U6()();
  return Ue.exports;
}
var H6 = /* @__PURE__ */ j6();
const O = /* @__PURE__ */ R6(H6);
function V6(n) {
  return U({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-9v14h9a1 1 0 0 0 .993 -.883l.007 -.117v-12a1 1 0 0 0 -.883 -.993l-.117 -.007zm-2.293 4.293a1 1 0 0 1 .083 1.32l-.083 .094l-1.292 1.293l1.292 1.293a1 1 0 0 1 .083 1.32l-.083 .094a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 -.083 -1.32l.083 -.094l2 -2a1 1 0 0 1 1.414 0z" }, child: [] }] })(n);
}
function B6(n) {
  return U({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" }, child: [] }, { tag: "path", attr: { d: "M9 4v16" }, child: [] }, { tag: "path", attr: { d: "M14 10l2 2l-2 2" }, child: [] }] })(n);
}
const $t = ({ collapsibleNav: n, isNavigationPaneOpen: e, setNavigationPaneOpen: t }) => {
  const [o, s] = R([]), [i, a] = R([]), [l, r] = R([]), [u, d] = R(!1), { currentPath: f, setCurrentPath: p, onFolderChange: g } = ge(), m = ae(null), h = ae([]), x = ae(null), F = Oe(() => {
    d(!1);
  }), k = ce(), N = ae(null);
  ee(() => {
    s(() => {
      let w = "";
      return f == null ? void 0 : f.split("/").map((y) => ({
        name: y || k("home"),
        path: y === "" ? y : w += `/${y}`
      }));
    }), a([]), r([]);
  }, [f, k]);
  const A = (w) => {
    p(w), g == null || g(w);
  }, v = () => {
    var J;
    const w = m.current.clientWidth, y = getComputedStyle(m.current), C = parseFloat(y.paddingLeft), S = n ? 2 : 0, I = n ? ((J = N.current) == null ? void 0 : J.clientWidth) + 1 : 0, M = i.length > 0 ? 1 : 0, D = parseFloat(y.gap) * (o.length + M + S);
    return w - (C + D + I);
  }, T = () => {
    var S;
    const w = v(), y = h.current.reduce((E, I) => I ? E + I.clientWidth : E, 0), C = ((S = x.current) == null ? void 0 : S.clientWidth) || 0;
    return w - (y + C);
  }, $ = () => m.current.scrollWidth > m.current.clientWidth;
  return ee(() => {
    var w;
    if ($()) {
      const y = o[1], C = (w = h.current[1]) == null ? void 0 : w.clientWidth;
      r((S) => [...S, C]), a((S) => [...S, y]), s((S) => S.filter((E, I) => I !== 1));
    } else if (i.length > 0 && T() > l.at(-1)) {
      const y = [o[0], i.at(-1), ...o.slice(1)];
      s(y), a((C) => C.slice(0, -1)), r((C) => C.slice(0, -1));
    }
  }, [$]), /* @__PURE__ */ L("div", { className: "bread-crumb-container", children: [
    /* @__PURE__ */ L("div", { className: "breadcrumb", ref: m, children: [
      n && /* @__PURE__ */ L(me, { children: [
        /* @__PURE__ */ c(
          "div",
          {
            ref: N,
            className: "nav-toggler",
            title: `${k(e ? "collapseNavigationPane" : "expandNavigationPane")}`,
            children: /* @__PURE__ */ c(
              "span",
              {
                className: "folder-name folder-name-btn",
                onClick: () => t((w) => !w),
                children: e ? /* @__PURE__ */ c(V6, {}) : /* @__PURE__ */ c(B6, {})
              }
            )
          }
        ),
        /* @__PURE__ */ c("div", { className: "divider" })
      ] }),
      o.map((w, y) => /* @__PURE__ */ L("div", { style: { display: "contents" }, children: [
        /* @__PURE__ */ L(
          "span",
          {
            className: "folder-name",
            onClick: () => A(w.path),
            ref: (C) => h.current[y] = C,
            children: [
              y === 0 ? /* @__PURE__ */ c(to, {}) : /* @__PURE__ */ c(ao, {}),
              w.name
            ]
          }
        ),
        (i == null ? void 0 : i.length) > 0 && y === 0 && /* @__PURE__ */ c(
          "button",
          {
            className: "folder-name folder-name-btn",
            onClick: () => d(!0),
            ref: x,
            title: k("showMoreFolder"),
            children: /* @__PURE__ */ c(io, { size: 22, className: "hidden-folders" })
          }
        )
      ] }, y))
    ] }),
    u && /* @__PURE__ */ c("ul", { ref: F.ref, className: "hidden-folders-container", children: i.map((w, y) => /* @__PURE__ */ c(
      "li",
      {
        onClick: () => {
          A(w.path), d(!1);
        },
        children: w.name
      },
      y
    )) })
  ] });
};
$t.displayName = "BreadCrumb";
$t.propTypes = {
  isNavigationPaneOpen: O.bool.isRequired,
  setNavigationPaneOpen: O.func.isRequired
};
const Je = (n) => ({
  pdf: /* @__PURE__ */ c(po, { size: n }),
  jpg: /* @__PURE__ */ c(nt, { size: n }),
  jpeg: /* @__PURE__ */ c(nt, { size: n }),
  png: /* @__PURE__ */ c(nt, { size: n }),
  txt: /* @__PURE__ */ c(uo, { size: n }),
  doc: /* @__PURE__ */ c(Et, { size: n }),
  docx: /* @__PURE__ */ c(Et, { size: n }),
  mp4: /* @__PURE__ */ c(Ft, { size: n }),
  webm: /* @__PURE__ */ c(Ft, { size: n }),
  mp3: /* @__PURE__ */ c(Ct, { size: n }),
  m4a: /* @__PURE__ */ c(Ct, { size: n }),
  zip: /* @__PURE__ */ c(fo, { size: n }),
  ppt: /* @__PURE__ */ c(Nt, { size: n }),
  pptx: /* @__PURE__ */ c(Nt, { size: n }),
  xls: /* @__PURE__ */ c(St, { size: n }),
  xlsx: /* @__PURE__ */ c(St, { size: n }),
  exe: /* @__PURE__ */ c(co, { size: n }),
  html: /* @__PURE__ */ c(de, { size: n }),
  css: /* @__PURE__ */ c(de, { size: n }),
  js: /* @__PURE__ */ c(de, { size: n }),
  php: /* @__PURE__ */ c(de, { size: n }),
  py: /* @__PURE__ */ c(de, { size: n }),
  java: /* @__PURE__ */ c(de, { size: n }),
  cpp: /* @__PURE__ */ c(de, { size: n }),
  c: /* @__PURE__ */ c(de, { size: n }),
  ts: /* @__PURE__ */ c(de, { size: n }),
  jsx: /* @__PURE__ */ c(de, { size: n }),
  tsx: /* @__PURE__ */ c(de, { size: n }),
  json: /* @__PURE__ */ c(de, { size: n }),
  xml: /* @__PURE__ */ c(de, { size: n }),
  sql: /* @__PURE__ */ c(de, { size: n }),
  csv: /* @__PURE__ */ c(de, { size: n }),
  md: /* @__PURE__ */ c(de, { size: n }),
  svg: /* @__PURE__ */ c(de, { size: n })
}), Dn = (n, e, t) => {
  if (t.find((o) => o.name === n)) {
    const o = "", s = n;
    let i = 0;
    const a = new RegExp(`${s} \\(\\d+\\)`);
    t.forEach((u) => {
      const d = u.isDirectory ? u.name : u.name.split(".").slice(0, -1).join(".");
      if (a.test(d)) {
        const f = d.split(`${s} (`).pop().slice(0, -1), p = parseInt(f);
        !isNaN(p) && p > i && (i = p);
      }
    });
    const l = ` (${++i})`;
    return s + l + o;
  } else
    return n;
}, Un = ({ nameInputRef: n, id: e, maxLength: t, value: o, onChange: s, onKeyDown: i, onClick: a, rows: l }) => /* @__PURE__ */ c(
  "textarea",
  {
    ref: n,
    id: e,
    className: "rename-file",
    maxLength: t,
    value: o,
    onChange: s,
    onKeyDown: i,
    onClick: a,
    rows: l
  }
), jn = ({ message: n, xPlacement: e, yPlacement: t }) => /* @__PURE__ */ c("p", { className: `error-tooltip ${e} ${t}`, children: n }), W6 = 220, Y6 = ({ filesViewRef: n, file: e, onCreateFolder: t, triggerAction: o }) => {
  const [s, i] = R(e.name), [a, l] = R(!1), [r, u] = R(""), [d, f] = R("right"), [p, g] = R("bottom"), m = Oe(($) => {
    $.preventDefault(), $.stopPropagation();
  }), { currentFolder: h, currentPathFiles: x, setCurrentPathFiles: F } = ge(), { activeLayout: k } = Ce(), N = ce(), A = ($) => {
    i($.target.value), l(!1);
  }, v = ($) => {
    if ($.stopPropagation(), $.key === "Enter") {
      $.preventDefault(), T();
      return;
    }
    if ($.key === "Escape") {
      $.preventDefault(), o.close(), F((y) => y.filter((C) => C.key !== e.key));
      return;
    }
    /[\\/:*?"<>|]/.test($.key) ? ($.preventDefault(), u(N("invalidFileName")), l(!0)) : (l(!1), u(""));
  };
  ee(() => {
    if (a) {
      const $ = setTimeout(() => {
        l(!1), u("");
      }, 7e3);
      return () => clearTimeout($);
    }
  }, [a]);
  function T() {
    var C, S;
    let $ = s.trim();
    const w = x.filter((E) => !(E.key && E.key === e.key));
    if (w.find((E) => E.name.toLowerCase() === $.toLowerCase())) {
      u(N("folderExists", { renameFile: $ })), l(!0), (C = m.ref.current) == null || C.focus(), (S = m.ref.current) == null || S.select(), m.setIsClicked(!1);
      return;
    }
    $ === "" && ($ = Dn("New Folder", !0, w)), be(t, "onCreateFolder", $, h), F((E) => E.filter((I) => I.key !== e.key)), o.close();
  }
  return ee(() => {
    var $, w, y;
    if (($ = m.ref.current) == null || $.focus(), (w = m.ref.current) == null || w.select(), (y = m.ref) != null && y.current) {
      const I = n.current.getBoundingClientRect(), M = m.ref.current, D = M.getBoundingClientRect();
      I.right - D.left > 313 ? f("right") : f("left"), I.bottom - (D.top + M.clientHeight) > 88 ? g("bottom") : g("top");
    }
  }, []), ee(() => {
    m.isClicked && T();
  }, [m.isClicked]), /* @__PURE__ */ L(me, { children: [
    /* @__PURE__ */ c(
      Un,
      {
        id: "newFolder",
        nameInputRef: m.ref,
        maxLength: W6,
        value: s,
        onChange: A,
        onKeyDown: v,
        onClick: ($) => $.stopPropagation(),
        ...k === "list" && { rows: 1 }
      }
    ),
    a && /* @__PURE__ */ c(
      jn,
      {
        message: r,
        xPlacement: d,
        yPlacement: p
      }
    )
  ] });
}, ye = ({ onClick: n, onKeyDown: e, type: t = "primary", padding: o = "0.4rem 0.8rem", children: s }) => /* @__PURE__ */ c(
  "button",
  {
    onClick: n,
    onKeyDown: e,
    className: `fm-button fm-button-${t}`,
    style: { padding: o },
    children: s
  }
);
function K6(n) {
  return U({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "M85.57 446.25h340.86a32 32 0 0 0 28.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0 0 28.17 47.17z" }, child: [] }, { tag: "path", attr: { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "m250.26 195.39 5.74 122 5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 5.95z" }, child: [] }, { tag: "path", attr: { d: "M256 397.25a20 20 0 1 1 20-20 20 20 0 0 1-20 20z" }, child: [] }] })(n);
}
const Hn = ({
  children: n,
  show: e,
  setShow: t,
  heading: o,
  dialogWidth: s = "25%",
  contentClassName: i = "",
  closeButton: a = !0
}) => {
  const l = ae(null), r = ce(), u = (d) => {
    d.key === "Escape" && t(!1);
  };
  return ee(() => {
    e ? l.current.showModal() : l.current.close();
  }, [e]), /* @__PURE__ */ L(
    "dialog",
    {
      ref: l,
      className: "fm-modal dialog",
      style: { width: s },
      onKeyDown: u,
      children: [
        /* @__PURE__ */ L("div", { className: "fm-modal-header", children: [
          /* @__PURE__ */ c("span", { className: "fm-modal-heading", children: o }),
          a && /* @__PURE__ */ c(
            so,
            {
              size: 18,
              onClick: () => t(!1),
              className: "close-icon",
              title: r("close")
            }
          )
        ] }),
        n
      ]
    }
  );
}, Pe = (n) => n.split(".").pop(), _6 = 220, q6 = ({ filesViewRef: n, file: e, onRename: t, triggerAction: o }) => {
  const [s, i] = R(e == null ? void 0 : e.name), [a, l] = R(!1), [r, u] = R(!1), [d, f] = R(""), [p, g] = R("right"), [m, h] = R("bottom"), { currentPathFiles: x, setCurrentPathFiles: F } = ge(), { activeLayout: k } = Ce(), N = ce(), A = ae(null), v = Oe((y) => {
    var C;
    (C = A.current) != null && C.contains(y.target) || (y.preventDefault(), y.stopPropagation());
  }), T = (y) => {
    if (y.stopPropagation(), y.key === "Enter") {
      y.preventDefault(), v.setIsClicked(!0);
      return;
    }
    if (y.key === "Escape") {
      y.preventDefault(), F(
        (S) => S.map((E) => (E.key === e.key && (E.isEditing = !1), E))
      ), o.close();
      return;
    }
    /[\\/:*?"<>|]/.test(y.key) ? (y.preventDefault(), f(N("invalidFileName")), u(!0)) : u(!1);
  };
  ee(() => {
    if (r) {
      const y = setTimeout(() => {
        u(!1), f("");
      }, 7e3);
      return () => clearTimeout(y);
    }
  }, [r]);
  function $(y) {
    if (s === "" || s === e.name) {
      F(
        (C) => C.map((S) => (S.key === e.key && (S.isEditing = !1), S))
      ), o.close();
      return;
    } else if (x.some((C) => C.name === s)) {
      u(!0), f(N("folderExists", { renameFile: s })), v.setIsClicked(!1);
      return;
    } else if (!e.isDirectory && !y) {
      const C = Pe(e.name), S = Pe(s);
      if (C !== S) {
        l(!0);
        return;
      }
    }
    u(!1), be(t, "onRename", e, s), F((C) => C.filter((S) => S.key !== e.key)), o.close();
  }
  const w = () => {
    var y, C, S, E, I, M;
    if ((C = (y = v.ref) == null ? void 0 : y.current) == null || C.focus(), e.isDirectory)
      (E = (S = v.ref) == null ? void 0 : S.current) == null || E.select();
    else {
      const D = Pe(e.name), J = e.name.length - D.length - 1;
      (M = (I = v.ref) == null ? void 0 : I.current) == null || M.setSelectionRange(0, J);
    }
  };
  return ee(() => {
    var y;
    if (w(), (y = v.ref) != null && y.current) {
      const I = n.current.getBoundingClientRect(), M = v.ref.current, D = M.getBoundingClientRect();
      I.right - D.left > 313 ? g("right") : g("left"), I.bottom - (D.top + M.clientHeight) > 88 ? h("bottom") : h("top");
    }
  }, []), ee(() => {
    v.isClicked && $(!1), w();
  }, [v.isClicked]), /* @__PURE__ */ L(me, { children: [
    /* @__PURE__ */ c(
      Un,
      {
        id: e.name,
        nameInputRef: v.ref,
        maxLength: _6,
        value: s,
        onChange: (y) => {
          i(y.target.value), u(!1);
        },
        onKeyDown: T,
        onClick: (y) => y.stopPropagation(),
        ...k === "list" && { rows: 1 }
      }
    ),
    r && /* @__PURE__ */ c(
      jn,
      {
        message: d,
        xPlacement: p,
        yPlacement: m
      }
    ),
    /* @__PURE__ */ c(
      Hn,
      {
        heading: N("rename"),
        show: a,
        setShow: l,
        dialogWidth: "25vw",
        closeButton: !1,
        children: /* @__PURE__ */ L("div", { className: "fm-rename-folder-container", ref: A, children: [
          /* @__PURE__ */ c("div", { className: "fm-rename-folder-input", children: /* @__PURE__ */ L("div", { className: "fm-rename-warning", children: [
            /* @__PURE__ */ c(K6, { size: 70, color: "orange" }),
            /* @__PURE__ */ c("div", { children: N("fileNameChangeWarning") })
          ] }) }),
          /* @__PURE__ */ L("div", { className: "fm-rename-folder-action", children: [
            /* @__PURE__ */ c(
              ye,
              {
                type: "secondary",
                onClick: () => {
                  F(
                    (y) => y.map((C) => (C.key === e.key && (C.isEditing = !1), C))
                  ), l(!1), o.close();
                },
                children: N("no")
              }
            ),
            /* @__PURE__ */ c(
              ye,
              {
                type: "danger",
                onClick: () => {
                  l(!1), $(!0);
                },
                children: N("yes")
              }
            )
          ] })
        ] })
      }
    )
  ] });
}, tt = (n, e = 2) => {
  if (isNaN(n)) return "";
  const t = n / 1024, o = t / 1024, s = o / 1024;
  if (t < 1024)
    return `${t.toFixed(e)} KB`;
  if (o < 1024)
    return `${o.toFixed(e)} MB`;
  if (o >= 1024)
    return `${s.toFixed(e)} GB`;
}, Vn = ({ name: n, id: e, checked: t, onClick: o, onChange: s, className: i = "", title: a, disabled: l = !1 }) => /* @__PURE__ */ c(
  "input",
  {
    className: `fm-checkbox ${i}`,
    type: "checkbox",
    name: n,
    id: e,
    checked: t,
    onClick: o,
    onChange: s,
    title: a,
    disabled: l
  }
), ut = 50, G6 = ({
  index: n,
  file: e,
  onCreateFolder: t,
  onRename: o,
  enableFilePreview: s,
  onFileOpen: i,
  filesViewRef: a,
  selectedFileIndexes: l,
  triggerAction: r,
  handleContextMenu: u,
  setLastSelectedFile: d,
  draggable: f,
  formatDate: p
}) => {
  var X, ue, Le, Ie;
  const [g, m] = R(!1), [h, x] = R(0), [F, k] = R("hidden"), [N, A] = R(""), [v, T] = R(null), { activeLayout: $ } = Ce(), w = $ === "grid" ? 48 : 20, y = Je(w), { setCurrentPath: C, currentPathFiles: S, onFolderChange: E } = ge(), { setSelectedFiles: I } = ve(), { clipBoard: M, handleCutCopy: D, setClipBoard: J, handlePasting: oe } = et(), re = ae(null), K = Je(ut), b = (M == null ? void 0 : M.isMoving) && M.files.find((Q) => Q.name === e.name && Q.path === e.path), P = () => {
    i(e), e.isDirectory ? (C(e.path), E == null || E(e.path), I([])) : s && r.show("previewFile");
  }, B = (Q, he) => {
    if (l.length > 0 && Q) {
      let we = !1, Se = l[0], Ne = n;
      if (Se >= Ne) {
        const Yn = Se;
        Se = Ne, Ne = Yn, we = !0;
      }
      const yt = S.slice(Se, Ne + 1);
      I(we ? yt.reverse() : yt);
    } else l.length > 0 && he ? I((we) => {
      const Se = we.filter((Ne) => Ne.path !== e.path);
      return we.length === Se.length ? [...we, e] : Se;
    }) : I([e]);
  }, j = (Q) => {
    if (Q.stopPropagation(), e.isEditing) return;
    B(Q.shiftKey, Q.ctrlKey);
    const he = (/* @__PURE__ */ new Date()).getTime();
    if (he - h < 300) {
      P();
      return;
    }
    x(he);
  }, H = (Q) => {
    Q.key === "Enter" && (Q.stopPropagation(), I([e]), P());
  }, _ = (Q) => {
    Q.stopPropagation(), Q.preventDefault(), !e.isEditing && (g || I([e]), d(e), u(Q, !0));
  }, W = () => {
    k("visible");
  }, Y = () => {
    !g && k("hidden");
  }, q = (Q) => {
    Q.target.checked ? I((he) => [...he, e]) : I((he) => he.filter((we) => we.name !== e.name && we.path !== e.path)), m(Q.target.checked);
  }, Z = (Q) => {
    Q.dataTransfer.setDragImage(re.current, 30, 50), Q.dataTransfer.effectAllowed = "copy", D(!0);
  }, G = () => J(null), ie = (Q) => {
    Q.preventDefault(), g || !e.isDirectory ? Q.dataTransfer.dropEffect = "none" : (T({ x: Q.clientX, y: Q.clientY + 12 }), Q.dataTransfer.dropEffect = "copy", A("file-drop-zone"));
  }, z = (Q) => {
    Q.currentTarget.contains(Q.relatedTarget) || (A((he) => he && ""), T(null));
  }, le = (Q) => {
    Q.preventDefault(), !(g || !e.isDirectory) && (oe(e), A((he) => he && ""), T(null));
  };
  return ee(() => {
    m(l.includes(n)), k(l.includes(n) ? "visible" : "hidden");
  }, [l]), /* @__PURE__ */ L(
    "div",
    {
      className: `file-item-container ${N} ${g || e.isEditing ? "file-selected" : ""} ${b ? "file-moving" : ""}`,
      tabIndex: 0,
      title: e.name,
      onClick: j,
      onKeyDown: H,
      onContextMenu: _,
      onMouseOver: W,
      onMouseLeave: Y,
      draggable: g && f,
      onDragStart: Z,
      onDragEnd: G,
      onDragEnter: ie,
      onDragOver: ie,
      onDragLeave: z,
      onDrop: le,
      children: [
        /* @__PURE__ */ L("div", { className: "file-item", children: [
          !e.isEditing && /* @__PURE__ */ c(
            Vn,
            {
              name: e.name,
              id: e.name,
              checked: g,
              className: `selection-checkbox ${F}`,
              onChange: q,
              onClick: (Q) => Q.stopPropagation()
            }
          ),
          e.isDirectory ? /* @__PURE__ */ c(Pt, { size: w }) : /* @__PURE__ */ c(me, { children: y[(ue = (X = e.name) == null ? void 0 : X.split(".").pop()) == null ? void 0 : ue.toLowerCase()] ?? /* @__PURE__ */ c(We, { size: w }) }),
          e.isEditing ? /* @__PURE__ */ c("div", { className: `rename-file-container ${$}`, children: r.actionType === "createFolder" ? /* @__PURE__ */ c(
            Y6,
            {
              filesViewRef: a,
              file: e,
              onCreateFolder: t,
              triggerAction: r
            }
          ) : /* @__PURE__ */ c(
            q6,
            {
              filesViewRef: a,
              file: e,
              onRename: o,
              triggerAction: r
            }
          ) }) : /* @__PURE__ */ c("span", { className: "text-truncate file-name", children: e.name })
        ] }),
        $ === "list" && /* @__PURE__ */ L(me, { children: [
          /* @__PURE__ */ c("div", { className: "modified-date", children: p(e.updatedAt) }),
          /* @__PURE__ */ c("div", { className: "size", children: (e == null ? void 0 : e.size) > 0 ? tt(e == null ? void 0 : e.size) : "" })
        ] }),
        v && /* @__PURE__ */ L(
          "div",
          {
            style: {
              top: `${v.y}px`,
              left: `${v.x}px`
            },
            className: "drag-move-tooltip",
            children: [
              "Move to ",
              /* @__PURE__ */ c("span", { className: "drop-zone-file-name", children: e.name })
            ]
          }
        ),
        /* @__PURE__ */ c("div", { ref: re, className: "drag-icon", children: e.isDirectory ? /* @__PURE__ */ c(Pt, { size: ut }) : /* @__PURE__ */ c(me, { children: K[(Ie = (Le = e.name) == null ? void 0 : Le.split(".").pop()) == null ? void 0 : Ie.toLowerCase()] ?? /* @__PURE__ */ c(We, { size: ut }) }) })
      ]
    }
  );
}, J6 = ({ subMenuRef: n, list: e, position: t = "right" }) => /* @__PURE__ */ c("ul", { ref: n, className: `sub-menu ${t}`, children: e == null ? void 0 : e.map((o) => /* @__PURE__ */ L("li", { onClick: o.onClick, children: [
  /* @__PURE__ */ c("span", { className: "item-selected", children: o.selected && /* @__PURE__ */ c(Cn, { size: 13 }) }),
  o.icon,
  /* @__PURE__ */ c("span", { children: o.title })
] }, o.title)) }), Z6 = ({ filesViewRef: n, contextMenuRef: e, menuItems: t, visible: o, clickPosition: s }) => {
  const [i, a] = R(0), [l, r] = R(0), [u, d] = R(null), [f, p] = R("right"), g = ae(null), m = () => {
    const { clickX: F, clickY: k } = s, N = n.current, A = N.getBoundingClientRect(), v = N.offsetWidth - N.clientWidth, T = e.current.getBoundingClientRect(), $ = T.width, w = T.height, y = F - A.left, C = A.width - (y + v) > $, S = !C, E = k - A.top, I = A.height - E > w, M = !I;
    C ? (a(`${y}px`), p("right")) : S && (a(`${y - $}px`), p("left")), I ? r(`${E + N.scrollTop}px`) : M && r(`${E + N.scrollTop - w}px`);
  }, h = (F) => {
    F.preventDefault(), F.stopPropagation();
  }, x = (F) => {
    d(F);
  };
  if (ee(() => {
    o && e.current ? m() : (r(0), a(0), d(null));
  }, [o]), o)
    return /* @__PURE__ */ c(
      "div",
      {
        ref: e,
        onContextMenu: h,
        onClick: (F) => F.stopPropagation(),
        className: `fm-context-menu ${l ? "visible" : "hidden"}`,
        style: {
          top: l,
          left: i
        },
        children: /* @__PURE__ */ c("div", { className: "file-context-menu-list", children: /* @__PURE__ */ c("ul", { children: t.filter((F) => !F.hidden).map((F, k) => {
          const N = F.hasOwnProperty("children"), A = u === k && N;
          return /* @__PURE__ */ L("div", { children: [
            /* @__PURE__ */ L(
              "li",
              {
                onClick: F.onClick,
                className: `${F.className ?? ""} ${A ? "active" : ""}`,
                onMouseOver: () => x(k),
                children: [
                  F.icon,
                  /* @__PURE__ */ c("span", { children: F.title }),
                  N && /* @__PURE__ */ L(me, { children: [
                    /* @__PURE__ */ c(lo, { size: 14, className: "list-expand-icon" }),
                    A && /* @__PURE__ */ c(
                      J6,
                      {
                        subMenuRef: g,
                        list: F.children,
                        position: f
                      }
                    )
                  ] })
                ]
              }
            ),
            F.divider && k !== t.filter((v) => !v.hidden).length - 1 && /* @__PURE__ */ c("div", { className: "divider" })
          ] }, F.title);
        }) }) })
      }
    );
};
function X6(n) {
  return U({ attr: { viewBox: "0 0 256 256", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" }, child: [] }] })(n);
}
const Q6 = (n, e, t, o, s) => {
  const i = (X) => {
    var ue;
    return !(X != null && X.isDirectory) && ((ue = X == null ? void 0 : X.name) == null ? void 0 : ue.toLowerCase().endsWith(".zip"));
  }, a = v.length === 1 && i(v[0]), [l, r] = R([]), [u, d] = R(!1), [f, p] = R(!1), [g, m] = R({ clickX: 0, clickY: 0 }), [h, x] = R(null), { clipBoard: F, setClipBoard: k, handleCutCopy: N, handlePasting: A } = et(), { selectedFiles: v, setSelectedFiles: T, handleDownload: $ } = ve(), { currentPath: w, setCurrentPath: y, currentPathFiles: C, setCurrentPathFiles: S, onFolderChange: E } = ge(), { activeLayout: I, setActiveLayout: M } = Ce(), D = ce(), J = () => {
    s(h), h.isDirectory ? (y(h.path), E == null || E(h.path), r([]), T([])) : e && t.show("previewFile"), d(!1);
  }, oe = (X) => {
    N(X), d(!1);
  }, re = () => {
    A(h), d(!1);
  }, K = () => {
    d(!1), t.show("rename");
  }, b = () => {
    $(), d(!1);
  }, P = () => {
    d(!1), t.show("delete");
  }, B = () => {
    d(!1), t.show("compress");
  }, j = () => {
    d(!1), t.show("extract");
  }, H = () => {
    d(!1), be(n, "onRefresh"), k(null);
  }, _ = () => {
    t.show("createFolder"), d(!1);
  }, W = () => {
    d(!1), t.show("uploadFile");
  }, Y = () => {
    T(C), d(!1);
  }, q = [
    {
      title: D("view"),
      icon: I === "grid" ? /* @__PURE__ */ c(xt, { size: 18 }) : /* @__PURE__ */ c(Be, { size: 18 }),
      onClick: () => {
      },
      children: [
        {
          title: D("grid"),
          icon: /* @__PURE__ */ c(xt, { size: 18 }),
          selected: I === "grid",
          onClick: () => {
            M("grid"), d(!1);
          }
        },
        {
          title: D("list"),
          icon: /* @__PURE__ */ c(Be, { size: 18 }),
          selected: I === "list",
          onClick: () => {
            M("list"), d(!1);
          }
        }
      ]
    },
    {
      title: D("refresh"),
      icon: /* @__PURE__ */ c(vn, { size: 18 }),
      onClick: H,
      divider: !0
    },
    {
      title: D("newFolder"),
      icon: /* @__PURE__ */ c(hn, { size: 18 }),
      onClick: _,
      hidden: !o.create,
      divider: !o.upload
    },
    {
      title: D("upload"),
      icon: /* @__PURE__ */ c(bn, { size: 18 }),
      onClick: W,
      divider: !0,
      hidden: !o.upload
    },
    {
      title: D("selectAll"),
      icon: /* @__PURE__ */ c(ro, { size: 18 }),
      onClick: Y
    }
  ], Z = [
    {
      title: D("open"),
      icon: h != null && h.isDirectory ? /* @__PURE__ */ c(X6, { size: 20 }) : /* @__PURE__ */ c(We, { size: 16 }),
      onClick: J,
      divider: !0
    },
    {
      title: D("cut"),
      icon: /* @__PURE__ */ c(gn, { size: 19 }),
      onClick: () => oe(!0),
      divider: !(h != null && h.isDirectory) && !o.copy,
      hidden: !o.move
    },
    {
      title: D("copy"),
      icon: /* @__PURE__ */ c(fn, { strokeWidth: 0.1, size: 17 }),
      onClick: () => oe(!1),
      divider: !(h != null && h.isDirectory),
      hidden: !o.copy
    },
    {
      title: D("paste"),
      icon: /* @__PURE__ */ c(ft, { size: 18 }),
      onClick: re,
      className: `${F ? "" : "disable-paste"}`,
      hidden: !(h != null && h.isDirectory) || !o.move && !o.copy,
      divider: !0
    },
    {
      title: D("rename"),
      icon: /* @__PURE__ */ c(xn, { size: 19 }),
      onClick: K,
      hidden: v.length > 1,
      hidden: !o.rename
    },
    {
      title: D("download"),
      icon: /* @__PURE__ */ c(gt, { size: 18 }),
      onClick: b,
      hidden: !o.download
    },
    {
      title: D("compress"),
      icon: /* @__PURE__ */ c(wn, { size: 18 }),
      onClick: B,
      hidden: !o.compress
    },
    {
      title: D("extract"),
      icon: /* @__PURE__ */ c($n, { size: 18 }),
      onClick: j,
      hidden: !o.extract || !a
    },
    {
      title: D("delete"),
      icon: /* @__PURE__ */ c(yn, { size: 19 }),
      onClick: P,
      hidden: !o.delete
    }
  ], G = () => {
    S((X) => [
      ...X,
      {
        name: Dn("New Folder", !0, X),
        isDirectory: !0,
        path: w,
        isEditing: !0,
        key: (/* @__PURE__ */ new Date()).valueOf()
      }
    ]);
  }, ie = () => {
    S((X) => {
      const ue = l.at(-1);
      return X[ue] ? X.map((Le, Ie) => Ie === ue ? {
        ...Le,
        isEditing: !0
      } : Le) : (t.close(), X);
    }), r([]), T([]);
  }, z = () => {
    r([]), T((X) => X.length > 0 ? [] : X);
  }, le = (X, ue = !1) => {
    X.preventDefault(), m({ clickX: X.clientX, clickY: X.clientY }), p(ue), !ue && z(), d(!0);
  };
  return ee(() => {
    if (t.isActive)
      switch (t.actionType) {
        case "createFolder":
          G();
          break;
        case "rename":
          ie();
          break;
      }
  }, [t.isActive]), ee(() => {
    r([]), T([]);
  }, [w]), ee(() => {
    v.length > 0 ? r(() => v.map((X) => C.findIndex((ue) => ue.path === X.path))) : r([]);
  }, [v, C]), {
    emptySelecCtxItems: q,
    selecCtxItems: Z,
    handleContextMenu: le,
    unselectFiles: z,
    visible: u,
    setVisible: d,
    setLastSelectedFile: x,
    selectedFileIndexes: l,
    clickPosition: g,
    isSelectionCtx: f
  };
}, ey = ({ unselectFiles: n, onSort: e, sortConfig: t }) => {
  const o = ce(), [s, i] = R(!1), { selectedFiles: a, setSelectedFiles: l } = ve(), { currentPathFiles: r } = ge(), u = Ze(() => r.length > 0 && a.length === r.length, [a, r]), d = (p) => {
    p.target.checked ? (l(r), i(!0)) : n();
  }, f = (p) => {
    e && e(p);
  };
  return /* @__PURE__ */ L(
    "div",
    {
      className: "files-header",
      onMouseOver: () => i(!0),
      onMouseLeave: () => i(!1),
      children: [
        /* @__PURE__ */ c("div", { className: "file-select-all", children: (s || u) && /* @__PURE__ */ c(
          Vn,
          {
            id: "selectAll",
            checked: u,
            onChange: d,
            title: "Select all",
            disabled: r.length === 0
          }
        ) }),
        /* @__PURE__ */ L(
          "div",
          {
            className: `file-name ${(t == null ? void 0 : t.key) === "name" ? "active" : ""}`,
            onClick: () => f("name"),
            children: [
              o("name"),
              (t == null ? void 0 : t.key) === "name" && /* @__PURE__ */ c("span", { className: "sort-indicator", children: t.direction === "asc" ? " ▲" : " ▼" })
            ]
          }
        ),
        /* @__PURE__ */ L(
          "div",
          {
            className: `file-date ${(t == null ? void 0 : t.key) === "modified" ? "active" : ""}`,
            onClick: () => f("modified"),
            children: [
              o("modified"),
              (t == null ? void 0 : t.key) === "modified" && /* @__PURE__ */ c("span", { className: "sort-indicator", children: t.direction === "asc" ? " ▲" : " ▼" })
            ]
          }
        ),
        /* @__PURE__ */ L(
          "div",
          {
            className: `file-size ${(t == null ? void 0 : t.key) === "size" ? "active" : ""}`,
            onClick: () => f("size"),
            children: [
              o("size"),
              (t == null ? void 0 : t.key) === "size" && /* @__PURE__ */ c("span", { className: "sort-indicator", children: t.direction === "asc" ? " ▲" : " ▼" })
            ]
          }
        )
      ]
    }
  );
}, Bn = ({
  onCreateFolder: n,
  onRename: e,
  onFileOpen: t,
  onRefresh: o,
  enableFilePreview: s,
  triggerAction: i,
  permissions: a,
  formatDate: l
}) => {
  const { currentPathFiles: r, sortConfig: u, setSortConfig: d } = ge(), f = ae(null), { activeLayout: p } = Ce(), g = ce(), {
    emptySelecCtxItems: m,
    selecCtxItems: h,
    handleContextMenu: x,
    unselectFiles: F,
    visible: k,
    setVisible: N,
    setLastSelectedFile: A,
    selectedFileIndexes: v,
    clickPosition: T,
    isSelectionCtx: $
  } = Q6(o, s, i, a, t), w = Oe(() => N(!1)), y = (C) => {
    let S = "asc";
    u.key === C && u.direction === "asc" && (S = "desc"), d({ key: C, direction: S });
  };
  return /* @__PURE__ */ L(
    "div",
    {
      ref: f,
      className: `files ${p}`,
      onContextMenu: x,
      onClick: F,
      children: [
        p === "list" && /* @__PURE__ */ c(ey, { unselectFiles: F, onSort: y, sortConfig: u }),
        (r == null ? void 0 : r.length) > 0 ? /* @__PURE__ */ c(me, { children: r.map((C, S) => /* @__PURE__ */ c(
          G6,
          {
            index: S,
            file: C,
            onCreateFolder: n,
            onRename: e,
            onFileOpen: t,
            enableFilePreview: s,
            triggerAction: i,
            filesViewRef: f,
            selectedFileIndexes: v,
            handleContextMenu: x,
            setVisible: N,
            setLastSelectedFile: A,
            draggable: a.move,
            formatDate: l
          },
          S
        )) }) : /* @__PURE__ */ c("div", { className: "empty-folder", children: g("folderEmpty") }),
        /* @__PURE__ */ c(
          Z6,
          {
            filesViewRef: f,
            contextMenuRef: w.ref,
            menuItems: $ ? h : m,
            visible: k,
            setVisible: N,
            clickPosition: T
          }
        )
      ]
    }
  );
};
Bn.displayName = "FileList";
const ty = ({ triggerAction: n, onDelete: e }) => {
  const [t, o] = R(""), { selectedFiles: s, setSelectedFiles: i } = ve(), a = ce();
  ee(() => {
    o(() => {
      if (s.length === 1)
        return a("deleteItemConfirm", { fileName: s[0].name });
      if (s.length > 1)
        return a("deleteItemsConfirm", { count: s.length });
    });
  }, [a]);
  const l = () => {
    e(s), i([]), n.close();
  };
  return /* @__PURE__ */ L("div", { className: "file-delete-confirm", children: [
    /* @__PURE__ */ c("p", { className: "file-delete-confirm-text", children: t }),
    /* @__PURE__ */ L("div", { className: "file-delete-confirm-actions", children: [
      /* @__PURE__ */ c(ye, { type: "secondary", onClick: () => n.close(), children: a("cancel") }),
      /* @__PURE__ */ c(ye, { type: "danger", onClick: l, children: a("delete") })
    ] })
  ] });
};
function ny(n) {
  return U({ attr: { viewBox: "0 0 1024 1024", fill: "currentColor", fillRule: "evenodd" }, child: [{ tag: "path", attr: { d: "M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" }, child: [] }] })(n);
}
function oy(n) {
  return U({ attr: { viewBox: "0 0 1024 1024" }, child: [{ tag: "path", attr: { d: "M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z" }, child: [] }, { tag: "path", attr: { d: "M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z" }, child: [] }] })(n);
}
const sy = ({ percent: n = 0, isCanceled: e = !1, isCompleted: t = !1, error: o }) => {
  const s = ce();
  return /* @__PURE__ */ L("div", { role: "progressbar", className: "fm-progress", children: [
    !o && /* @__PURE__ */ c("div", { className: "fm-progress-bar", children: /* @__PURE__ */ c("div", { className: "fm-progress-bar-fill", style: { width: `${n}%` } }) }),
    e ? /* @__PURE__ */ c("span", { className: "fm-upload-canceled", children: s("canceled") }) : o ? /* @__PURE__ */ c("span", { className: "fm-upload-canceled", children: o }) : /* @__PURE__ */ c("div", { className: "fm-progress-status", children: /* @__PURE__ */ c("span", { children: t ? s("completed") : s("percentDone", { percent: n }) }) })
  ] });
};
function iy(n) {
  return U({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M256 388c-72.597 0-132-59.405-132-132 0-72.601 59.403-132 132-132 36.3 0 69.299 15.4 92.406 39.601L278 234h154V80l-51.698 51.702C348.406 99.798 304.406 80 256 80c-96.797 0-176 79.203-176 176s78.094 176 176 176c81.045 0 148.287-54.134 169.401-128H378.85c-18.745 49.561-67.138 84-122.85 84z" }, child: [] }] })(n);
}
const ay = ({
  index: n,
  fileData: e,
  setFiles: t,
  setIsUploading: o,
  fileUploadConfig: s,
  onFileUploaded: i,
  handleFileRemove: a
}) => {
  var $, w, y, C;
  const [l, r] = R(0), [u, d] = R(!1), [f, p] = R(!1), [g, m] = R(!1), h = Je(33), x = ae(), { onError: F } = Qe(), k = ce(), N = (S) => {
    r(0), o((I) => ({
      ...I,
      [n]: !1
    }));
    const E = {
      type: "upload",
      message: k("uploadFail"),
      response: {
        status: S.status,
        statusText: S.statusText,
        data: S.response
      }
    };
    t(
      (I) => I.map((M, D) => n === D ? {
        ...M,
        error: E.message
      } : M)
    ), m(!0), F(E, e.file);
  }, A = (S) => {
    if (!S.error)
      return new Promise((E, I) => {
        const M = new XMLHttpRequest();
        x.current = M, o((K) => ({
          ...K,
          [n]: !0
        })), M.upload.onprogress = (K) => {
          if (K.lengthComputable) {
            const b = Math.round(K.loaded / K.total * 100);
            r(b);
          }
        }, M.onload = () => {
          o((K) => ({
            ...K,
            [n]: !1
          })), M.status === 200 || M.status === 201 ? (d(!0), i(M.response), E(M.response)) : (I(M.statusText), N(M));
        }, M.onerror = () => {
          I(M.statusText), N(M);
        };
        const D = (s == null ? void 0 : s.method) || "POST";
        M.open(D, s == null ? void 0 : s.url, !0);
        const J = s == null ? void 0 : s.headers;
        for (let K in J)
          M.setRequestHeader(K, J[K]);
        const oe = new FormData(), re = S == null ? void 0 : S.appendData;
        for (let K in re)
          re[K] && oe.append(K, re[K]);
        oe.append("file", S.file), M.send(oe);
      });
  };
  ee(() => {
    x.current || A(e);
  }, []);
  const v = () => {
    x.current && (x.current.abort(), o((S) => ({
      ...S,
      [n]: !1
    })), p(!0), r(0));
  }, T = () => {
    e != null && e.file && (t(
      (S) => S.map((E, I) => n === I ? {
        ...E,
        error: !1
      } : E)
    ), A({ ...e, error: !1 }), p(!1), m(!1));
  };
  return e.removed ? null : /* @__PURE__ */ L("li", { children: [
    /* @__PURE__ */ c("div", { className: "file-icon", children: h[Pe(($ = e.file) == null ? void 0 : $.name)] ?? /* @__PURE__ */ c(We, { size: 33 }) }),
    /* @__PURE__ */ L("div", { className: "file", children: [
      /* @__PURE__ */ L("div", { className: "file-details", children: [
        /* @__PURE__ */ L("div", { className: "file-info", children: [
          /* @__PURE__ */ c("span", { className: "file-name text-truncate", title: (w = e.file) == null ? void 0 : w.name, children: (y = e.file) == null ? void 0 : y.name }),
          /* @__PURE__ */ c("span", { className: "file-size", children: tt((C = e.file) == null ? void 0 : C.size) })
        ] }),
        u ? /* @__PURE__ */ c(T6, { title: k("uploaded"), className: "upload-success" }) : f || g ? /* @__PURE__ */ c(iy, { className: "retry-upload", title: "Retry", onClick: T }) : /* @__PURE__ */ c(
          "div",
          {
            className: "rm-file",
            title: `${e.error ? k("Remove") : k("abortUpload")}`,
            onClick: e.error ? () => a(n) : v,
            children: /* @__PURE__ */ c(ny, {})
          }
        )
      ] }),
      /* @__PURE__ */ c(
        sy,
        {
          percent: l,
          isCanceled: f,
          isCompleted: u,
          error: e.error
        }
      )
    ] })
  ] });
}, ry = ({
  fileUploadConfig: n,
  maxFileSize: e,
  acceptedFileTypes: t,
  onFileUploading: o,
  onFileUploaded: s
}) => {
  const [i, a] = R([]), [l, r] = R(!1), [u, d] = R({}), { currentFolder: f, currentPathFiles: p } = ge(), { onError: g } = Qe(), m = ae(null), h = ce(), x = (T) => {
    T.key === "Enter" && m.current.click();
  }, F = (T) => {
    if (t && !t.includes(Pe(T.name)))
      return h("fileTypeNotAllowed");
    if (p.some(
      (y) => y.name.toLowerCase() === T.name.toLowerCase() && !y.isDirectory
    )) return h("fileAlreadyExist");
    if (e && T.size > e) return `${h("maxUploadSize")} ${tt(e, 0)}.`;
  }, k = (T) => {
    if (T = T.filter(
      ($) => !i.some((w) => w.file.name.toLowerCase() === $.name.toLowerCase())
    ), T.length > 0) {
      const $ = T.map((w) => {
        const y = o(w, f), C = F(w);
        return C && g({ type: "upload", message: C }, w), {
          file: w,
          appendData: y,
          ...C && { error: C }
        };
      });
      a((w) => [...w, ...$]);
    }
  }, N = (T) => {
    T.preventDefault(), r(!1);
    const $ = Array.from(T.dataTransfer.files);
    k($);
  }, A = (T) => {
    const $ = Array.from(T.target.files);
    k($);
  }, v = (T) => {
    a(($) => {
      const w = $.map((y, C) => T === C ? {
        ...y,
        removed: !0
      } : y);
      return w.every((y) => !!y.removed) ? [] : w;
    });
  };
  return /* @__PURE__ */ L("div", { className: `fm-upload-file ${i.length > 0 ? "file-selcted" : ""}`, children: [
    /* @__PURE__ */ L("div", { className: "select-files", children: [
      /* @__PURE__ */ c(
        "div",
        {
          className: `draggable-file-input ${l ? "dragging" : ""}`,
          onDrop: N,
          onDragOver: (T) => T.preventDefault(),
          onDragEnter: () => r(!0),
          onDragLeave: () => r(!1),
          children: /* @__PURE__ */ L("div", { className: "input-text", children: [
            /* @__PURE__ */ c(oy, { size: 30 }),
            /* @__PURE__ */ c("span", { children: h("dragFileToUpload") })
          ] })
        }
      ),
      /* @__PURE__ */ c("div", { className: "btn-choose-file", children: /* @__PURE__ */ L(ye, { padding: "0", onKeyDown: x, children: [
        /* @__PURE__ */ c("label", { htmlFor: "chooseFile", children: h("chooseFile") }),
        /* @__PURE__ */ c(
          "input",
          {
            ref: m,
            type: "file",
            id: "chooseFile",
            className: "choose-file-input",
            onChange: A,
            multiple: !0,
            accept: t
          }
        )
      ] }) })
    ] }),
    i.length > 0 && /* @__PURE__ */ L("div", { className: "files-progress", children: [
      /* @__PURE__ */ c("div", { className: "heading", children: Object.values(u).some((T) => T) ? /* @__PURE__ */ L(me, { children: [
        /* @__PURE__ */ c("h2", { children: h("uploading") }),
        /* @__PURE__ */ c(mt, { loading: !0, className: "upload-loading" })
      ] }) : /* @__PURE__ */ c("h2", { children: h("completed") }) }),
      /* @__PURE__ */ c("ul", { children: i.map((T, $) => /* @__PURE__ */ c(
        ay,
        {
          index: $,
          fileData: T,
          setFiles: a,
          fileUploadConfig: n,
          setIsUploading: d,
          onFileUploaded: s,
          handleFileRemove: v
        },
        $
      )) })
    ] })
  ] });
}, sn = ["jpg", "jpeg", "png"], an = ["mp4", "mov", "avi"], rn = ["mp3", "wav", "m4a"], ln = ["txt", "pdf"], ly = ({ filePreviewPath: n, filePreviewComponent: e }) => {
  var h;
  const [t, o] = R(!0), [s, i] = R(!1), { selectedFiles: a } = ve(), l = Je(73), r = (h = Pe(a[0].name)) == null ? void 0 : h.toLowerCase(), u = `${n}${a[0].path}`, d = ce(), f = Ze(
    () => e == null ? void 0 : e(a[0]),
    [e]
  ), p = () => {
    o(!1), i(!1);
  }, g = () => {
    o(!1), i(!0);
  }, m = () => {
    window.location.href = u;
  };
  return xe.isValidElement(f) ? f : /* @__PURE__ */ L("section", { className: `file-previewer ${r === "pdf" ? "pdf-previewer" : ""}`, children: [
    s || ![
      ...sn,
      ...an,
      ...rn,
      ...ln
    ].includes(r) && /* @__PURE__ */ L("div", { className: "preview-error", children: [
      /* @__PURE__ */ c("span", { className: "error-icon", children: l[r] ?? /* @__PURE__ */ c(L6, { size: 73 }) }),
      /* @__PURE__ */ c("span", { className: "error-msg", children: d("previewUnavailable") }),
      /* @__PURE__ */ L("div", { className: "file-info", children: [
        /* @__PURE__ */ c("span", { className: "file-name", children: a[0].name }),
        a[0].size && /* @__PURE__ */ c("span", { children: "-" }),
        /* @__PURE__ */ c("span", { className: "file-size", children: tt(a[0].size) })
      ] }),
      /* @__PURE__ */ c(ye, { onClick: m, padding: "0.45rem .9rem", children: /* @__PURE__ */ L("div", { className: "download-btn", children: [
        /* @__PURE__ */ c(gt, { size: 18 }),
        /* @__PURE__ */ c("span", { children: d("download") })
      ] }) })
    ] }),
    sn.includes(r) && /* @__PURE__ */ L(me, { children: [
      /* @__PURE__ */ c(mt, { isLoading: t }),
      /* @__PURE__ */ c(
        "img",
        {
          src: u,
          alt: "Preview Unavailable",
          className: `photo-popup-image ${t ? "img-loading" : ""}`,
          onLoad: p,
          onError: g,
          loading: "lazy"
        }
      )
    ] }),
    an.includes(r) && /* @__PURE__ */ c("video", { src: u, className: "video-preview", controls: !0, autoPlay: !0 }),
    rn.includes(r) && /* @__PURE__ */ c("audio", { src: u, controls: !0, autoPlay: !0, className: "audio-preview" }),
    ln.includes(r) && /* @__PURE__ */ c(me, { children: /* @__PURE__ */ c(
      "iframe",
      {
        src: u,
        onLoad: p,
        onError: g,
        frameBorder: "0",
        className: `photo-popup-iframe ${t ? "img-loading" : ""}`
      }
    ) })
  ] });
}, cy = /[\\/:*?"<>|]/, dy = ({ onCompress: n, triggerAction: e }) => {
  const { selectedFiles: t, setSelectedFiles: o } = ve(), { currentFolder: s, currentPathFiles: i } = ge(), a = ce(), [l, r] = R(""), [u, d] = R("");
  ee(() => {
    if (!t || t.length === 0) {
      r(""), d("");
      return;
    }
    const p = t.length === 1 ? t[0].name.replace(/\.zip$/i, "") : "Archive";
    r(`${p}.zip`), d("");
  }, [t]);
  const f = () => {
    if (!t || t.length === 0) {
      e.close();
      return;
    }
    let p = l.trim();
    if (!p) {
      d(a("zipNameRequired"));
      return;
    }
    if (cy.test(p)) {
      d(a("invalidFileName"));
      return;
    }
    if (p.toLowerCase().endsWith(".zip") || (p = `${p}.zip`), i == null ? void 0 : i.some(
      (m) => {
        var h;
        return ((h = m.name) == null ? void 0 : h.toLowerCase()) === p.toLowerCase();
      }
    )) {
      d(a("zipAlreadyExists", { name: p }));
      return;
    }
    be(n, "onCompress", t, p, s), o([]), e.close();
  };
  return /* @__PURE__ */ L("div", { className: "compress-action", children: [
    /* @__PURE__ */ c("p", { className: "compress-action__description", children: a("compressSelectionDescription") }),
    /* @__PURE__ */ c("label", { className: "compress-action__label", htmlFor: "zipName", children: a("zipName") }),
    /* @__PURE__ */ c(
      "input",
      {
        id: "zipName",
        className: "compress-action__input",
        value: l,
        onChange: (p) => {
          r(p.target.value), d("");
        },
        onKeyDown: (p) => {
          p.key === "Enter" && (p.preventDefault(), f());
        }
      }
    ),
    u && /* @__PURE__ */ c("span", { className: "compress-action__error", children: u }),
    /* @__PURE__ */ L("div", { className: "compress-action__actions", children: [
      /* @__PURE__ */ c(ye, { type: "secondary", onClick: e.close, children: a("cancel") }),
      /* @__PURE__ */ c(ye, { onClick: f, children: a("compress") })
    ] })
  ] });
}, uy = ({ onExtract: n, triggerAction: e }) => {
  const { selectedFiles: t, setSelectedFiles: o } = ve(), { currentFolder: s } = ge(), i = ce(), a = t == null ? void 0 : t[0], l = () => {
    if (!a) {
      e.close();
      return;
    }
    be(n, "onExtract", a, s), o([]), e.close();
  };
  return /* @__PURE__ */ L("div", { className: "extract-action", children: [
    /* @__PURE__ */ c("p", { className: "extract-action__description", children: i("extractDescription", { fileName: (a == null ? void 0 : a.name) ?? "" }) }),
    /* @__PURE__ */ L("div", { className: "extract-action__actions", children: [
      /* @__PURE__ */ c(ye, { type: "secondary", onClick: e.close, children: i("cancel") }),
      /* @__PURE__ */ c(ye, { onClick: l, children: i("extract") })
    ] })
  ] });
}, pt = (n) => n.toLowerCase(), pe = (n, e, t = !1) => {
  const o = ae(/* @__PURE__ */ new Set([])), s = Ze(() => new Set(n.map((r) => pt(r))), [n]), i = (r) => {
    if (!r.repeat && (o.current.add(pt(r.key)), s.isSubsetOf(o.current) && !t)) {
      r.preventDefault(), e(r);
      return;
    }
  }, a = (r) => {
    o.current.delete(pt(r.key));
  }, l = () => {
    o.current.clear();
  };
  ee(() => (window.addEventListener("keydown", i), window.addEventListener("keyup", a), window.addEventListener("blur", l), () => {
    window.removeEventListener("keydown", i), window.removeEventListener("keyup", a), window.removeEventListener("blur", l);
  }), [s, e, t]);
}, fe = {
  createFolder: ["Alt", "Shift", "N"],
  uploadFiles: ["Control", "U"],
  cut: ["Control", "X"],
  copy: ["Control", "C"],
  paste: ["Control", "V"],
  rename: ["F2"],
  download: ["Control", "D"],
  delete: ["Delete"],
  selectAll: ["Control", "A"],
  jumpToFirst: ["Home"],
  jumpToLast: ["End"],
  listLayout: ["Control", "Shift", "!"],
  // Act as Ctrl + Shift + 1 but could cause problems for QWERTZ or DVORAK etc. keyborad layouts.
  gridLayout: ["Control", "Shift", "@"],
  // Act as Ctrl + Shift + 2 but could cause problems for QWERTZ or DVORAK etc. keyborad layouts.
  refresh: ["F5"],
  clearSelection: ["Escape"]
}, py = (n, e, t) => {
  const { setClipBoard: o, handleCutCopy: s, handlePasting: i } = et(), { currentFolder: a, currentPathFiles: l } = ge(), { selectedFiles: r, setSelectedFiles: u, handleDownload: d } = ve(), { setActiveLayout: f } = Ce(), p = () => {
    t.create && n.show("createFolder");
  }, g = () => {
    t.upload && n.show("uploadFile");
  }, m = () => {
    t.move && s(!0);
  }, h = () => {
    t.copy && s(!1);
  }, x = () => {
    i(a);
  }, F = () => {
    t.rename && n.show("rename");
  }, k = () => {
    t.download && d();
  }, N = () => {
    t.delete && r.length && n.show("delete");
  }, A = () => {
    l.length > 0 && u([l[0]]);
  }, v = () => {
    l.length > 0 && u([l.at(-1)]);
  }, T = () => {
    u(l);
  }, $ = () => {
    u((S) => S.length > 0 ? [] : S);
  }, w = () => {
    be(e, "onRefresh"), o(null);
  }, y = () => {
    f("grid");
  }, C = () => {
    f("list");
  };
  pe(fe.createFolder, p, n.isActive), pe(fe.uploadFiles, g, n.isActive), pe(fe.cut, m, n.isActive), pe(fe.copy, h, n.isActive), pe(fe.paste, x, n.isActive), pe(fe.rename, F, n.isActive), pe(fe.download, k, n.isActive), pe(fe.delete, N, n.isActive), pe(fe.jumpToFirst, A, n.isActive), pe(fe.jumpToLast, v, n.isActive), pe(fe.selectAll, T, n.isActive), pe(fe.clearSelection, $, n.isActive), pe(fe.refresh, w, n.isActive), pe(fe.gridLayout, y, n.isActive), pe(fe.listLayout, C, n.isActive);
}, fy = ({
  fileUploadConfig: n,
  onFileUploading: e,
  onFileUploaded: t,
  onDelete: o,
  onCompress: s,
  onExtract: i,
  onRefresh: a,
  maxFileSize: l,
  filePreviewPath: r,
  filePreviewComponent: u,
  acceptedFileTypes: d,
  triggerAction: f,
  permissions: p
}) => {
  const [g, m] = R(null), { selectedFiles: h } = ve(), x = ce();
  py(f, a, p);
  const F = {
    uploadFile: {
      title: x("upload"),
      component: /* @__PURE__ */ c(
        ry,
        {
          fileUploadConfig: n,
          maxFileSize: l,
          acceptedFileTypes: d,
          onFileUploading: e,
          onFileUploaded: t
        }
      ),
      width: "35%"
    },
    delete: {
      title: x("delete"),
      component: /* @__PURE__ */ c(ty, { triggerAction: f, onDelete: o }),
      width: "25%"
    },
    previewFile: {
      title: x("preview"),
      component: /* @__PURE__ */ c(
        ly,
        {
          filePreviewPath: r,
          filePreviewComponent: u
        }
      ),
      width: "50%"
    },
    compress: {
      title: x("compress"),
      component: /* @__PURE__ */ c(dy, { onCompress: s, triggerAction: f }),
      width: "35%"
    },
    extract: {
      title: x("extract"),
      component: /* @__PURE__ */ c(uy, { onExtract: i, triggerAction: f }),
      width: "30%"
    }
  };
  if (ee(() => {
    var k;
    if (f.isActive) {
      const N = f.actionType, A = F[N];
      if (!A) {
        m(null);
        return;
      }
      if (N === "previewFile") {
        const v = ((k = h == null ? void 0 : h[0]) == null ? void 0 : k.name) ?? x("preview");
        m({ ...A, title: v });
        return;
      }
      m(A);
    } else
      m(null);
  }, [f.isActive, f.actionType, h, x]), g)
    return /* @__PURE__ */ c(
      Hn,
      {
        heading: g.title,
        show: f.isActive,
        setShow: f.close,
        dialogWidth: g.width,
        children: g == null ? void 0 : g.component
      }
    );
}, hy = () => {
  const [n, e] = R(!1), [t, o] = R(null);
  return {
    isActive: n,
    actionType: t,
    show: (a) => {
      e(!0), o(a);
    },
    close: () => {
      e(!1), o(null);
    }
  };
}, my = (n, e) => {
  const [t, o] = R({ col1: n, col2: e }), [s, i] = R(!1), a = ae(null);
  return {
    containerRef: a,
    colSizes: t,
    setColSizes: o,
    isDragging: s,
    handleMouseDown: () => {
      i(!0);
    },
    handleMouseUp: () => {
      i(!1);
    },
    handleMouseMove: (d) => {
      if (!s) return;
      d.preventDefault();
      const p = a.current.getBoundingClientRect(), g = (d.clientX - p.left) / p.width * 100;
      g >= 15 && g <= 60 && o({ col1: g, col2: 100 - g });
    }
  };
}, gy = (n, e, t) => {
  const o = n[e];
  if (o && isNaN(Date.parse(o)))
    return new Error(
      `Invalid prop \`${e}\` supplied to \`${t}\`. Expected a valid date string (ISO 8601) but received \`${o}\`.`
    );
}, cn = (n, e, t) => {
  const o = n[e];
  try {
    new URL(o);
    return;
  } catch {
    return new Error(
      `Invalid prop \`${e}\` supplied to \`${t}\`. Expected a valid URL but received \`${o}\`.`
    );
  }
}, vy = {
  create: !0,
  upload: !0,
  move: !0,
  copy: !0,
  rename: !0,
  download: !0,
  delete: !0,
  compress: !0,
  extract: !0
}, $y = (n) => {
  if (!n || isNaN(Date.parse(n))) return "";
  n = new Date(n);
  let e = n.getHours();
  const t = n.getMinutes(), o = e >= 12 ? "PM" : "AM";
  e = e % 12, e = e || 12;
  const s = n.getMonth() + 1, i = n.getDate(), a = n.getFullYear();
  return `${s}/${i}/${a} ${e}:${t < 10 ? "0" + t : t} ${o}`;
}, Wn = ({
  files: n,
  fileUploadConfig: e,
  isLoading: t,
  onCreateFolder: o,
  onFileUploading: s = () => {
  },
  onFileUploaded: i = () => {
  },
  onCut: a,
  onCopy: l,
  onPaste: r,
  onRename: u,
  onDownload: d,
  onDelete: f = () => null,
  onCompress: p = () => null,
  onExtract: g = () => null,
  onLayoutChange: m = () => {
  },
  onRefresh: h,
  onFileOpen: x = () => {
  },
  onFolderChange: F = () => {
  },
  onSelect: k,
  onSelectionChange: N,
  onError: A = () => {
  },
  layout: v = "grid",
  enableFilePreview: T = !0,
  maxFileSize: $,
  filePreviewPath: w,
  acceptedFileTypes: y,
  height: C = "600px",
  width: S = "100%",
  initialPath: E = "",
  filePreviewComponent: I,
  primaryColor: M = "#6155b4",
  fontFamily: D = "Nunito Sans, sans-serif",
  language: J = "en-US",
  permissions: oe = {},
  collapsibleNav: re = !1,
  defaultNavExpanded: K = !0,
  className: b = "",
  style: P = {},
  formatDate: B = $y
}) => {
  const [j, H] = R(K), _ = hy(), { containerRef: W, colSizes: Y, isDragging: q, handleMouseMove: Z, handleMouseUp: G, handleMouseDown: ie } = my(20, 80), z = {
    "--file-manager-font-family": D,
    "--file-manager-primary-color": M,
    height: C,
    width: S
  }, le = Ze(
    () => ({ ...vy, ...oe }),
    [oe]
  );
  return /* @__PURE__ */ L(
    "main",
    {
      className: `file-explorer ${b}`,
      onContextMenu: (X) => X.preventDefault(),
      style: { ...z, ...P },
      children: [
        /* @__PURE__ */ c(mt, { loading: t }),
        /* @__PURE__ */ c(s6, { language: J, children: /* @__PURE__ */ c(a6, { filesData: n, onError: A, children: /* @__PURE__ */ c(l6, { initialPath: E, onFolderChange: F, children: /* @__PURE__ */ c(
          c6,
          {
            onDownload: d,
            onSelect: k,
            onSelectionChange: N,
            children: /* @__PURE__ */ c(d6, { onPaste: r, onCut: a, onCopy: l, children: /* @__PURE__ */ L(ho, { layout: v, children: [
              /* @__PURE__ */ c(
                An,
                {
                  onLayoutChange: m,
                  onRefresh: h,
                  triggerAction: _,
                  permissions: le
                }
              ),
              /* @__PURE__ */ L(
                "section",
                {
                  ref: W,
                  onMouseMove: Z,
                  onMouseUp: G,
                  className: "files-container",
                  children: [
                    /* @__PURE__ */ L(
                      "div",
                      {
                        className: `navigation-pane ${j ? "open" : "closed"}`,
                        style: {
                          width: Y.col1 + "%"
                        },
                        children: [
                          /* @__PURE__ */ c(Mn, { onFileOpen: x }),
                          /* @__PURE__ */ c(
                            "div",
                            {
                              className: `sidebar-resize ${q ? "sidebar-dragging" : ""}`,
                              onMouseDown: ie
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ L(
                      "div",
                      {
                        className: "folders-preview",
                        style: { width: (j ? Y.col2 : 100) + "%" },
                        children: [
                          /* @__PURE__ */ c(
                            $t,
                            {
                              collapsibleNav: re,
                              isNavigationPaneOpen: j,
                              setNavigationPaneOpen: H
                            }
                          ),
                          /* @__PURE__ */ c(
                            Bn,
                            {
                              onCreateFolder: o,
                              onRename: u,
                              onFileOpen: x,
                              onRefresh: h,
                              enableFilePreview: T,
                              triggerAction: _,
                              permissions: le,
                              formatDate: B
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ c(
                fy,
                {
                  fileUploadConfig: e,
                  onFileUploading: s,
                  onFileUploaded: i,
                  onDelete: f,
                  onCompress: p,
                  onExtract: g,
                  onRefresh: h,
                  maxFileSize: $,
                  filePreviewPath: w,
                  filePreviewComponent: I,
                  acceptedFileTypes: y,
                  triggerAction: _,
                  permissions: le
                }
              )
            ] }) })
          }
        ) }) }) })
      ]
    }
  );
};
Wn.displayName = "FileManager";
Wn.propTypes = {
  files: O.arrayOf(
    O.shape({
      name: O.string.isRequired,
      isDirectory: O.bool.isRequired,
      path: O.string.isRequired,
      updatedAt: gy,
      size: O.number
    })
  ).isRequired,
  fileUploadConfig: O.shape({
    url: cn,
    headers: O.objectOf(O.string),
    method: O.oneOf(["POST", "PUT"])
  }),
  isLoading: O.bool,
  onCreateFolder: O.func,
  onFileUploading: O.func,
  onFileUploaded: O.func,
  onRename: O.func,
  onDelete: O.func,
  onCompress: O.func,
  onExtract: O.func,
  onCut: O.func,
  onCopy: O.func,
  onPaste: O.func,
  onDownload: O.func,
  onLayoutChange: O.func,
  onRefresh: O.func,
  onFileOpen: O.func,
  onFolderChange: O.func,
  onSelect: O.func,
  onSelectionChange: O.func,
  onError: O.func,
  layout: O.oneOf(["grid", "list"]),
  maxFileSize: O.number,
  enableFilePreview: O.bool,
  filePreviewPath: cn,
  acceptedFileTypes: O.string,
  height: O.oneOfType([O.string, O.number]),
  width: O.oneOfType([O.string, O.number]),
  initialPath: O.string,
  filePreviewComponent: O.func,
  primaryColor: O.string,
  fontFamily: O.string,
  language: O.string,
  permissions: O.shape({
    create: O.bool,
    upload: O.bool,
    move: O.bool,
    copy: O.bool,
    rename: O.bool,
    download: O.bool,
    delete: O.bool,
    compress: O.bool,
    extract: O.bool
  }),
  collapsibleNav: O.bool,
  defaultNavExpanded: O.bool,
  className: O.string,
  style: O.object,
  formatDate: O.func
};
export {
  Wn as FileManager
};
