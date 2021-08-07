define("./workbox-7f1d7524.js", ["exports"], function (e) {
  "use strict";
  try {
    self["workbox:core:5.1.3"] && _();
  } catch (e) {}
  const t = (e, ...t) => {
    let n = e;
    return t.length > 0 && (n += " :: " + JSON.stringify(t)), n;
  };
  class n extends Error {
    constructor(e, n) {
      super(t(e, n)), (this.name = e), (this.details = n);
    }
  }
  try {
    self["workbox:routing:5.1.3"] && _();
  } catch (e) {}
  const s = (e) => (e && "object" == typeof e ? e : { handle: e });
  class r {
    constructor(e, t, n = "GET") {
      (this.handler = s(t)), (this.match = e), (this.method = n);
    }
  }
  class i extends r {
    constructor(e, t, n) {
      super(
        ({ url: t }) => {
          const n = e.exec(t.href);
          if (n && (t.origin === location.origin || 0 === n.index))
            return n.slice(1);
        },
        t,
        n
      );
    }
  }
  const o = (e) =>
    new URL(String(e), location.href).href.replace(
      new RegExp("^" + location.origin),
      ""
    );
  class c {
    constructor() {
      this.t = new Map();
    }
    get routes() {
      return this.t;
    }
    addFetchListener() {
      self.addEventListener("fetch", (e) => {
        const { request: t } = e,
          n = this.handleRequest({ request: t, event: e });
        n && e.respondWith(n);
      });
    }
    addCacheListener() {
      self.addEventListener("message", (e) => {
        if (e.data && "CACHE_URLS" === e.data.type) {
          const { payload: t } = e.data,
            n = Promise.all(
              t.urlsToCache.map((e) => {
                "string" == typeof e && (e = [e]);
                const t = new Request(...e);
                return this.handleRequest({ request: t });
              })
            );
          e.waitUntil(n),
            e.ports && e.ports[0] && n.then(() => e.ports[0].postMessage(!0));
        }
      });
    }
    handleRequest({ request: e, event: t }) {
      const n = new URL(e.url, location.href);
      if (!n.protocol.startsWith("http")) return;
      const { params: s, route: r } = this.findMatchingRoute({
        url: n,
        request: e,
        event: t,
      });
      let i,
        o = r && r.handler;
      if ((!o && this.s && (o = this.s), o)) {
        try {
          i = o.handle({ url: n, request: e, event: t, params: s });
        } catch (e) {
          i = Promise.reject(e);
        }
        return (
          i instanceof Promise &&
            this.i &&
            (i = i.catch((s) =>
              this.i.handle({ url: n, request: e, event: t })
            )),
          i
        );
      }
    }
    findMatchingRoute({ url: e, request: t, event: n }) {
      const s = this.t.get(t.method) || [];
      for (const r of s) {
        let s;
        const i = r.match({ url: e, request: t, event: n });
        if (i)
          return (
            (s = i),
            ((Array.isArray(i) && 0 === i.length) ||
              (i.constructor === Object && 0 === Object.keys(i).length) ||
              "boolean" == typeof i) &&
              (s = void 0),
            { route: r, params: s }
          );
      }
      return {};
    }
    setDefaultHandler(e) {
      this.s = s(e);
    }
    setCatchHandler(e) {
      this.i = s(e);
    }
    registerRoute(e) {
      this.t.has(e.method) || this.t.set(e.method, []),
        this.t.get(e.method).push(e);
    }
    unregisterRoute(e) {
      if (!this.t.has(e.method))
        throw new n("unregister-route-but-not-found-with-method", {
          method: e.method,
        });
      const t = this.t.get(e.method).indexOf(e);
      if (!(t > -1)) throw new n("unregister-route-route-not-registered");
      this.t.get(e.method).splice(t, 1);
    }
  }
  let a;
  const u = () => (
    a || ((a = new c()), a.addFetchListener(), a.addCacheListener()), a
  );
  const h = {
      googleAnalytics: "googleAnalytics",
      precache: "precache-v2",
      prefix: "workbox",
      runtime: "runtime",
      suffix: "undefined" != typeof registration ? registration.scope : "",
    },
    l = (e) =>
      [h.prefix, e, h.suffix].filter((e) => e && e.length > 0).join("-"),
    f = (e) => e || l(h.precache),
    w = (e) => e || l(h.runtime),
    p = new Set();
  const d = (e, t) => e.filter((e) => t in e),
    y = async ({ request: e, mode: t, plugins: n = [] }) => {
      const s = d(n, "cacheKeyWillBeUsed");
      let r = e;
      for (const e of s)
        (r = await e.cacheKeyWillBeUsed.call(e, { mode: t, request: r })),
          "string" == typeof r && (r = new Request(r));
      return r;
    },
    g = async ({
      cacheName: e,
      request: t,
      event: n,
      matchOptions: s,
      plugins: r = [],
    }) => {
      const i = await self.caches.open(e),
        o = await y({ plugins: r, request: t, mode: "read" });
      let c = await i.match(o, s);
      for (const t of r)
        if ("cachedResponseWillBeUsed" in t) {
          const r = t.cachedResponseWillBeUsed;
          c = await r.call(t, {
            cacheName: e,
            event: n,
            matchOptions: s,
            cachedResponse: c,
            request: o,
          });
        }
      return c;
    },
    R = async ({
      cacheName: e,
      request: t,
      response: s,
      event: r,
      plugins: i = [],
      matchOptions: c,
    }) => {
      const a = await y({ plugins: i, request: t, mode: "write" });
      if (!s) throw new n("cache-put-with-no-response", { url: o(a.url) });
      const u = await (async ({
        request: e,
        response: t,
        event: n,
        plugins: s = [],
      }) => {
        let r = t,
          i = !1;
        for (const t of s)
          if ("cacheWillUpdate" in t) {
            i = !0;
            const s = t.cacheWillUpdate;
            if (
              ((r = await s.call(t, { request: e, response: r, event: n })), !r)
            )
              break;
          }
        return i || (r = r && 200 === r.status ? r : void 0), r || null;
      })({ event: r, plugins: i, response: s, request: a });
      if (!u) return;
      const h = await self.caches.open(e),
        l = d(i, "cacheDidUpdate"),
        f =
          l.length > 0
            ? await g({ cacheName: e, matchOptions: c, request: a })
            : null;
      try {
        await h.put(a, u);
      } catch (e) {
        throw (
          ("QuotaExceededError" === e.name &&
            (await (async function () {
              for (const e of p) await e();
            })()),
          e)
        );
      }
      for (const t of l)
        await t.cacheDidUpdate.call(t, {
          cacheName: e,
          event: r,
          oldResponse: f,
          newResponse: u,
          request: a,
        });
    },
    q = g,
    m = async ({ request: e, fetchOptions: t, event: s, plugins: r = [] }) => {
      if (
        ("string" == typeof e && (e = new Request(e)),
        s instanceof FetchEvent && s.preloadResponse)
      ) {
        const e = await s.preloadResponse;
        if (e) return e;
      }
      const i = d(r, "fetchDidFail"),
        o = i.length > 0 ? e.clone() : null;
      try {
        for (const t of r)
          if ("requestWillFetch" in t) {
            const n = t.requestWillFetch,
              r = e.clone();
            e = await n.call(t, { request: r, event: s });
          }
      } catch (e) {
        throw new n("plugin-error-request-will-fetch", { thrownError: e });
      }
      const c = e.clone();
      try {
        let n;
        n = "navigate" === e.mode ? await fetch(e) : await fetch(e, t);
        for (const e of r)
          "fetchDidSucceed" in e &&
            (n = await e.fetchDidSucceed.call(e, {
              event: s,
              request: c,
              response: n,
            }));
        return n;
      } catch (e) {
        for (const t of i)
          await t.fetchDidFail.call(t, {
            error: e,
            event: s,
            originalRequest: o.clone(),
            request: c.clone(),
          });
        throw e;
      }
    };
  try {
    self["workbox:strategies:5.1.3"] && _();
  } catch (e) {}
  const v = {
    cacheWillUpdate: async ({ response: e }) =>
      200 === e.status || 0 === e.status ? e : null,
  };
  let U;
  async function L(e, t) {
    const n = e.clone(),
      s = {
        headers: new Headers(n.headers),
        status: n.status,
        statusText: n.statusText,
      },
      r = t ? t(s) : s,
      i = (function () {
        if (void 0 === U) {
          const e = new Response("");
          if ("body" in e)
            try {
              new Response(e.body), (U = !0);
            } catch (e) {
              U = !1;
            }
          U = !1;
        }
        return U;
      })()
        ? n.body
        : await n.blob();
    return new Response(i, r);
  }
  try {
    self["workbox:precaching:5.1.3"] && _();
  } catch (e) {}
  function x(e) {
    if (!e) throw new n("add-to-cache-list-unexpected-type", { entry: e });
    if ("string" == typeof e) {
      const t = new URL(e, location.href);
      return { cacheKey: t.href, url: t.href };
    }
    const { revision: t, url: s } = e;
    if (!s) throw new n("add-to-cache-list-unexpected-type", { entry: e });
    if (!t) {
      const e = new URL(s, location.href);
      return { cacheKey: e.href, url: e.href };
    }
    const r = new URL(s, location.href),
      i = new URL(s, location.href);
    return (
      r.searchParams.set("__WB_REVISION__", t),
      { cacheKey: r.href, url: i.href }
    );
  }
  class N {
    constructor(e) {
      (this.o = f(e)),
        (this.u = new Map()),
        (this.h = new Map()),
        (this.l = new Map());
    }
    addToCacheList(e) {
      const t = [];
      for (const s of e) {
        "string" == typeof s
          ? t.push(s)
          : s && void 0 === s.revision && t.push(s.url);
        const { cacheKey: e, url: r } = x(s),
          i = "string" != typeof s && s.revision ? "reload" : "default";
        if (this.u.has(r) && this.u.get(r) !== e)
          throw new n("add-to-cache-list-conflicting-entries", {
            firstEntry: this.u.get(r),
            secondEntry: e,
          });
        if ("string" != typeof s && s.integrity) {
          if (this.l.has(e) && this.l.get(e) !== s.integrity)
            throw new n("add-to-cache-list-conflicting-integrities", {
              url: r,
            });
          this.l.set(e, s.integrity);
        }
        if ((this.u.set(r, e), this.h.set(r, i), t.length > 0)) {
          const e = `Workbox is precaching URLs without revision info: ${t.join(
            ", "
          )}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
          console.warn(e);
        }
      }
    }
    async install({ event: e, plugins: t } = {}) {
      const n = [],
        s = [],
        r = await self.caches.open(this.o),
        i = await r.keys(),
        o = new Set(i.map((e) => e.url));
      for (const [e, t] of this.u)
        o.has(t) ? s.push(e) : n.push({ cacheKey: t, url: e });
      const c = n.map(({ cacheKey: n, url: s }) => {
        const r = this.l.get(n),
          i = this.h.get(s);
        return this.p({
          cacheKey: n,
          cacheMode: i,
          event: e,
          integrity: r,
          plugins: t,
          url: s,
        });
      });
      await Promise.all(c);
      return { updatedURLs: n.map((e) => e.url), notUpdatedURLs: s };
    }
    async activate() {
      const e = await self.caches.open(this.o),
        t = await e.keys(),
        n = new Set(this.u.values()),
        s = [];
      for (const r of t) n.has(r.url) || (await e.delete(r), s.push(r.url));
      return { deletedURLs: s };
    }
    async p({
      cacheKey: e,
      url: t,
      cacheMode: s,
      event: r,
      plugins: i,
      integrity: o,
    }) {
      const c = new Request(t, {
        integrity: o,
        cache: s,
        credentials: "same-origin",
      });
      let a,
        u = await m({ event: r, plugins: i, request: c });
      for (const e of i || []) "cacheWillUpdate" in e && (a = e);
      if (
        !(a
          ? await a.cacheWillUpdate({ event: r, request: c, response: u })
          : u.status < 400)
      )
        throw new n("bad-precaching-response", { url: t, status: u.status });
      u.redirected && (u = await L(u)),
        await R({
          event: r,
          plugins: i,
          response: u,
          request: e === t ? c : new Request(e),
          cacheName: this.o,
          matchOptions: { ignoreSearch: !0 },
        });
    }
    getURLsToCacheKeys() {
      return this.u;
    }
    getCachedURLs() {
      return [...this.u.keys()];
    }
    getCacheKeyForURL(e) {
      const t = new URL(e, location.href);
      return this.u.get(t.href);
    }
    async matchPrecache(e) {
      const t = e instanceof Request ? e.url : e,
        n = this.getCacheKeyForURL(t);
      if (n) {
        return (await self.caches.open(this.o)).match(n);
      }
    }
    createHandler(e = !0) {
      return async ({ request: t }) => {
        try {
          const e = await this.matchPrecache(t);
          if (e) return e;
          throw new n("missing-precache-entry", {
            cacheName: this.o,
            url: t instanceof Request ? t.url : t,
          });
        } catch (n) {
          if (e) return fetch(t);
          throw n;
        }
      };
    }
    createHandlerBoundToURL(e, t = !0) {
      if (!this.getCacheKeyForURL(e))
        throw new n("non-precached-url", { url: e });
      const s = this.createHandler(t),
        r = new Request(e);
      return () => s({ request: r });
    }
  }
  let b;
  const M = () => (b || (b = new N()), b);
  const O = (e, t) => {
    const n = M().getURLsToCacheKeys();
    for (const s of (function* (
      e,
      {
        ignoreURLParametersMatching: t,
        directoryIndex: n,
        cleanURLs: s,
        urlManipulation: r,
      } = {}
    ) {
      const i = new URL(e, location.href);
      (i.hash = ""), yield i.href;
      const o = (function (e, t = []) {
        for (const n of [...e.searchParams.keys()])
          t.some((e) => e.test(n)) && e.searchParams.delete(n);
        return e;
      })(i, t);
      if ((yield o.href, n && o.pathname.endsWith("/"))) {
        const e = new URL(o.href);
        (e.pathname += n), yield e.href;
      }
      if (s) {
        const e = new URL(o.href);
        (e.pathname += ".html"), yield e.href;
      }
      if (r) {
        const e = r({ url: i });
        for (const t of e) yield t.href;
      }
    })(e, t)) {
      const e = n.get(s);
      if (e) return e;
    }
  };
  let E = !1;
  function K(e) {
    E ||
      ((({
        ignoreURLParametersMatching: e = [/^utm_/],
        directoryIndex: t = "index.html",
        cleanURLs: n = !0,
        urlManipulation: s,
      } = {}) => {
        const r = f();
        self.addEventListener("fetch", (i) => {
          const o = O(i.request.url, {
            cleanURLs: n,
            directoryIndex: t,
            ignoreURLParametersMatching: e,
            urlManipulation: s,
          });
          if (!o) return;
          let c = self.caches
            .open(r)
            .then((e) => e.match(o))
            .then((e) => e || fetch(o));
          i.respondWith(c);
        });
      })(e),
      (E = !0));
  }
  const C = [],
    S = {
      get: () => C,
      add(e) {
        C.push(...e);
      },
    },
    P = (e) => {
      const t = M(),
        n = S.get();
      e.waitUntil(
        t.install({ event: e, plugins: n }).catch((e) => {
          throw e;
        })
      );
    },
    T = (e) => {
      const t = M();
      e.waitUntil(t.activate());
    };
  (e.NavigationRoute = class extends r {
    constructor(e, { allowlist: t = [/./], denylist: n = [] } = {}) {
      super((e) => this.g(e), e), (this.R = t), (this.q = n);
    }
    g({ url: e, request: t }) {
      if (t && "navigate" !== t.mode) return !1;
      const n = e.pathname + e.search;
      for (const e of this.q) if (e.test(n)) return !1;
      return !!this.R.some((e) => e.test(n));
    }
  }),
    (e.StaleWhileRevalidate = class {
      constructor(e = {}) {
        if (
          ((this.o = w(e.cacheName)), (this.m = e.plugins || []), e.plugins)
        ) {
          const t = e.plugins.some((e) => !!e.cacheWillUpdate);
          this.m = t ? e.plugins : [v, ...e.plugins];
        } else this.m = [v];
        (this.v = e.fetchOptions), (this.U = e.matchOptions);
      }
      async handle({ event: e, request: t }) {
        "string" == typeof t && (t = new Request(t));
        const s = this.L({ request: t, event: e });
        let r,
          i = await q({
            cacheName: this.o,
            request: t,
            event: e,
            matchOptions: this.U,
            plugins: this.m,
          });
        if (i) {
          if (e)
            try {
              e.waitUntil(s);
            } catch (r) {}
        } else
          try {
            i = await s;
          } catch (e) {
            r = e;
          }
        if (!i) throw new n("no-response", { url: t.url, error: r });
        return i;
      }
      async L({ request: e, event: t }) {
        const n = await m({
            request: e,
            event: t,
            fetchOptions: this.v,
            plugins: this.m,
          }),
          s = R({
            cacheName: this.o,
            request: e,
            response: n.clone(),
            event: t,
            plugins: this.m,
          });
        if (t)
          try {
            t.waitUntil(s);
          } catch (e) {}
        return n;
      }
    }),
    (e.createHandlerBoundToURL = function (e) {
      return M().createHandlerBoundToURL(e);
    }),
    (e.precacheAndRoute = function (e, t) {
      !(function (e) {
        M().addToCacheList(e),
          e.length > 0 &&
            (self.addEventListener("install", P),
            self.addEventListener("activate", T));
      })(e),
        K(t);
    }),
    (e.registerRoute = function (e, t, s) {
      let o;
      if ("string" == typeof e) {
        const n = new URL(e, location.href);
        o = new r(({ url: e }) => e.href === n.href, t, s);
      } else if (e instanceof RegExp) o = new i(e, t, s);
      else if ("function" == typeof e) o = new r(e, t, s);
      else {
        if (!(e instanceof r))
          throw new n("unsupported-route-type", {
            moduleName: "workbox-routing",
            funcName: "registerRoute",
            paramName: "capture",
          });
        o = e;
      }
      return u().registerRoute(o), o;
    });
});
//# sourceMappingURL=workbox-7f1d7524.js.map
