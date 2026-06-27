import { getHomepageServer } from "../api/cms-server";
import { DefaultHomepage } from "./default-homepage";
import { HomepageSection } from "./homepage-section";

/** CMS-driven homepage: render active sections by position, else the fallback. */
export async function Homepage() {
  const homepage = await getHomepageServer().catch(() => null);
  const sections = (homepage?.sections ?? [])
    .filter((s) => s.isActive)
    .sort((a, b) => a.position - b.position);

  if (sections.length === 0) {
    return <DefaultHomepage />;
  }

  return (
    <>
      {sections.map((section) => (
        <HomepageSection key={section.id} section={section} />
      ))}
    </>
  );
}
