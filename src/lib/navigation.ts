export function isNavItemActive(pathname: string, href: string): boolean {
  const [pathWithoutHash] = href.split("#");
  const [navPath = "/"] = pathWithoutHash.split("?");
  const normalizedPath = navPath || "/";

  if (normalizedPath === "/") return pathname === "/";

  return (
    pathname === normalizedPath || pathname.startsWith(`${normalizedPath}/`)
  );
}
