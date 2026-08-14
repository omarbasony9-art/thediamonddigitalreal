import { useEffect } from "react";

const SITE_URL = "https://thediamonddigital.com";

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [key, val] = attr.split("=");
    el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

interface SeoOptions {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
}

export function useSeo({ title, description, canonical, ogType = "website" }: SeoOptions) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${canonical}`;

    document.title = title;

    setMeta('meta[name="description"]', 'name=description', description);
    setMeta('meta[property="og:title"]', 'property=og:title', title);
    setMeta('meta[property="og:description"]', 'property=og:description', description);
    setMeta('meta[property="og:url"]', 'property=og:url', canonicalUrl);
    setMeta('meta[property="og:type"]', 'property=og:type', ogType);
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', description);

    setLink("canonical", canonicalUrl);
  }, [title, description, canonical, ogType]);
}
