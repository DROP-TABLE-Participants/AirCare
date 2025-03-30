"use client";
import React, { useState, useEffect, useRef } from "react";

interface InlineSVGProps {
  src: string;
  fill: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const InlineSVG: React.FC<InlineSVGProps> = ({
  src,
  fill,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [originalSVG, setOriginalSVG] = useState<string | null>(null);
  const [svgContent, setSVGContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => setOriginalSVG(text))
      .catch((err) => console.error("Error fetching SVG:", err));
  }, [src]);

  useEffect(() => {
    if (originalSVG) {
      // Replace any existing fill attributes with the desired fill value.
      const modified = originalSVG.replace(/fill="[^"]*"/g, `fill="${fill}"`);
      setSVGContent(modified);
    }
  }, [originalSVG, fill]);

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
    />
  );
};

export interface PlanePart {
  name: string;
  svg: string;
  style: React.CSSProperties;
}

interface PlaneProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  onClickPart?: (partName: string) => void;
  // List of part names that should be rendered as problematic (e.g. red fill/stroke)
  problemParts?: string[];
  // Optional custom parts configuration; if omitted, the defaultParts array is used.
  parts?: PlanePart[];
}

// Define scaling factor for mobile screens
const getResponsiveScale = (): number => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640 ? 0.7 : 1;
  }
  return 1;
};

const defaultParts: PlanePart[] = [
  {
    name: "front",
    svg: "/Plane/front.svg",
    style: { margin: "0 3px" },
  },
  {
    name: "body1",
    svg: "/Plane/body1.svg",
    style: { margin: "0 3px" },
  },
  {
    name: "bodyTwo",
    svg: "/Plane/bodyTwo.svg",
    style: { margin: "0 3px" },
  },
  {
    name: "back",
    svg: "/Plane/back.svg",
    style: { margin: "0 3px" },
  },
  {
    name: "leftWing",
    svg: "/Plane/leftWing.svg",
    style: {
      position: "absolute",
      top: "110%",
      left: "50%",
      transform: "translateX(-50%)",  
    },
  },
  {
    name: "rightWing",
    svg: "/Plane/rightWing.svg",
    style: {
      position: "absolute",
      bottom: "110%",
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
  {
    name: "backLeftWing",
    svg: "/Plane/backLeftWing.svg",
    style: { position: "absolute", top: "110%", right: "22%" },
  },
  {
    name: "backRightWing",
    svg: "/Plane/backRightWing.svg",
    style: { position: "absolute", bottom: "110%", right: "22%" },
  },
];

const Plane: React.FC<PlaneProps> = ({
  className = "",
  width = "100%",
  height = "auto",
  alt = "Airplane illustration",
  onClickPart = () => {},
  // Default problematic parts for illustration.
  problemParts = ["leftWing", "rightWing", "backLeftWing", "backRightWing"],
  parts,
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [hint, setHint] = useState<string>("");
  const [clickedPoint, setClickedPoint] = useState<{ x: number; y: number } | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update scale factor based on screen size
  useEffect(() => {
    const updateScale = () => {
      setScale(getResponsiveScale());
    };
    
    updateScale();
    
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Default problem descriptions for some parts.
  const problemDescriptions: { [key: string]: string } = {
    leftWing: "Left Wing: Structural damage detected.",
    rightWing: "Right Wing: Engine malfunction reported.",
    backLeftWing: "Back Left Wing: Fuel leak detected.",
    backRightWing: "Back Right Wing: Navigation system error.",
  };

  const handlePartMouseEnter = (partName: string) => {
    setHoveredPart(partName);
  };

  const handlePartMouseLeave = () => {
    setHoveredPart(null);
  };

  const getFillColor = (partName: string): string => {
    const hasProblem = problemParts.includes(partName);
    return hasProblem ? "#FF5858" : "#CCCFDE";
  };

  const getStrokeColor = (partName: string): string => {
    const hasProblem = problemParts.includes(partName);
    return hasProblem ? "#FF0200" : "#AEB5D7";
  };

  const getStyle = (baseStyles: React.CSSProperties, partName: string): React.CSSProperties => {
    const isHovered = hoveredPart === partName;
    return {
      ...baseStyles,
      cursor: "pointer",
      transition: "all 0.2s ease",
    };
  };

  const handlePartClick = (e: React.MouseEvent<HTMLDivElement>, partName: string) => {
    onClickPart(partName);

    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }

    if (problemParts.includes(partName)) {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const targetRect = e.currentTarget.getBoundingClientRect();
        // Position the hint just to the right of the clicked element.
        const x = targetRect.right - containerRect.left + (10 * scale);
        const y = targetRect.top - containerRect.top;
        setClickedPoint({ x, y });
        setHint(problemDescriptions[partName] || `Problem with ${partName}`);
        setTimeout(() => {
          setIsPopupVisible(true);
        }, 10);
      }
    } else {
      handleClosePopup();
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    popupTimeoutRef.current = setTimeout(() => {
      setHint("");
      setClickedPoint(null);
    }, 300);
  };

  const partsToRender = parts || defaultParts;

  return (
    <div
      ref={containerRef}
      className="px-2 md:px-0"
      style={{ position: "relative", width: "100%", margin: "0 auto", textAlign: "center" }}
    >
      <div
        className={`plane-container ${className}`}
        style={{
          width,
          height,
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          // marginTop: "200px",
          transform: `scale(${scale})`.trim(),
        }}
      >
        {partsToRender.map((part) => (
          <div
            key={part.name}
            style={{...part.style}}
            onClick={(e) => handlePartClick(e, part.name)}
            onMouseEnter={() => handlePartMouseEnter(part.name)}
            onMouseLeave={handlePartMouseLeave}
          >
            <InlineSVG
              src={part.svg}
              fill={getFillColor(part.name)}
              style={{
                ...getStyle(part.style, part.name),
                stroke: getStrokeColor(part.name),
                strokeWidth: "1px",
              }}
            />
          </div>
        ))}
      </div>

      {hint && clickedPoint && (
        <div
          style={{
            position: "absolute",
            left: `${clickedPoint.x}px`,
            top: `${clickedPoint.y}px`,
            background: "white",
            color: "black",
            padding: `${6 * scale}px ${10 * scale}px`,
            borderRadius: "12px",
            fontSize: `${12 * scale}px`,
            cursor: "pointer",
            border: "2px solid red",
            zIndex: 100,
            maxWidth: "200px",
            transform: `translateY(-50%) scale(${isPopupVisible ? 1 : 0.7})`,
            opacity: isPopupVisible ? 1 : 0,
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transformOrigin: "left center",
          }}
          onClick={handleClosePopup}
        >
          {hint}
        </div>
      )}
    </div>
  );
};

export default Plane;
