import { useEffect, useRef, useState } from "react";

interface CollapseTransitionProps {
  show: boolean;
  children: React.ReactNode;
  duration?: number;
}

export const CollapseTransition: React.FC<CollapseTransitionProps> = ({
  show,
  children,
  duration = 300,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (show) {
      // Mount content first at height 0
      setShouldRender(true);
    } else {
      // Collapse: set explicit height, then animate to 0
      const contentHeight = contentRef.current?.scrollHeight ?? 0;
      wrapper.style.height = `${contentHeight}px`;
      // Force reflow so browser registers the starting height
      wrapper.offsetHeight;
      wrapper.style.height = "0px";
    }
  }, [show]);

  // After shouldRender becomes true, measure and animate open
  useEffect(() => {
    if (!shouldRender || !show) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Ensure we start from 0
    wrapper.style.height = "0px";
    // Force reflow
    wrapper.offsetHeight;
    // Animate to full height
    const contentHeight = contentRef.current?.scrollHeight ?? 0;
    wrapper.style.height = `${contentHeight}px`;
  }, [shouldRender, show]);

  const handleTransitionEnd = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (show) {
      // Let content flow naturally after expanding
      wrapper.style.height = "auto";
    } else {
      setShouldRender(false);
    }
  };

  return (
    <div
      className="w-full"
      ref={wrapperRef}
      style={{
        overflow: "hidden",
        transition: `height ${duration}ms ease-in-out`,
        height: 0,
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {shouldRender && <div ref={contentRef}>{children}</div>}
    </div>
  );
};
