import { useEffect, useRef } from "react";

export const ScrollOnReveal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Wait one frame for the section to fully render and lay out
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.height <= viewportHeight) {
        // Section fits on screen: scroll to bottom of section
        const sectionBottom = rect.top + window.scrollY + rect.height;
        window.scrollTo({
          top: sectionBottom - viewportHeight,
          behavior: "smooth",
        });
      } else {
        // Section taller than viewport: scroll one screen height down
        const sectionTop = rect.top + window.scrollY;
        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        });
      }
    });
  }, []);

  return <div ref={ref}>{children}</div>;
};
