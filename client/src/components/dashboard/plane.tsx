"use client";
import React, { useState, useEffect, useRef } from 'react';

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
  onMouseLeave
}) => {
  const [originalSVG, setOriginalSVG] = useState<string | null>(null);
  const [svgContent, setSVGContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        setOriginalSVG(text);
      })
      .catch((err) => {
        console.error("Error fetching SVG:", err);
      });
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

interface PlaneProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  onClickPart?: (partName: string) => void;
  // List of parts that should display a problem (rendered in red)
  problemParts?: string[];
}

const Plane: React.FC<PlaneProps> = ({
  className = '',
  width = '100%',
  height = 'auto',
  alt = 'Airplane illustration',
  onClickPart = () => {},
  problemParts = ["leftWing", "rightWing", "backLeftWing", "backRightWing"],
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [hint, setHint] = useState<string>('');
  const [clickedPoint, setClickedPoint] = useState<{ x: number; y: number } | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mapping of problematic parts to their description.
  const problemDescriptions: { [key: string]: string } = {
    leftWing: "Left Wing: Structural damage detected.",
    rightWing: "Right Wing: Engine malfunction reported.",
    backLeftWing: "Back Left Wing: Fuel leak detected.",
    backRightWing: "Back Right Wing: Navigation system error."
  };

  const handlePartMouseEnter = (partName: string) => {
    setHoveredPart(partName);
  };

  const handlePartMouseLeave = () => {
    setHoveredPart(null);
  };

  const getFillColor = (partName: string): string => {
    const hasProblem = problemParts.includes(partName);
    return hasProblem ? '#FF5858' : '#CCCFDE';
  };

  // Combine base styles with a hover scale effect.
  const getStyle = (baseStyles: React.CSSProperties, partName: string): React.CSSProperties => {
    const isHovered = hoveredPart === partName;
    return {
      ...baseStyles,
      cursor: 'pointer',
      transform: `${baseStyles.transform || ''} ${isHovered ? 'scale(1.05)' : ''}`.trim(),
      transition: 'all 0.2s ease',
    };
  };

  // Compute the clicked part's position relative to the container.
  const handlePartClick = (
    e: React.MouseEvent<HTMLDivElement>,
    partName: string
  ) => {
    onClickPart(partName);
    
    // Clear any existing timeout
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }
    
    if (problemParts.includes(partName)) {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const targetRect = e.currentTarget.getBoundingClientRect();
        // Position the hint to the right of the clicked element with a small offset.
        const x = targetRect.right - containerRect.left + 10;
        const y = targetRect.top - containerRect.top;
        
        // First set the position and content
        setClickedPoint({ x, y });
        setHint(problemDescriptions[partName] || `Problem with ${partName}`);
        
        // Then trigger the animation (small delay to ensure DOM update)
        setTimeout(() => {
          setIsPopupVisible(true);
        }, 10);
      }
    } else {
      handleClosePopup();
    }
  };

  const handleClosePopup = () => {
    // Start the closing animation
    setIsPopupVisible(false);
    
    // After animation completes, remove the popup
    popupTimeoutRef.current = setTimeout(() => {
      setHint('');
      setClickedPoint(null);
    }, 300); // Match this with the CSS transition duration
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', margin: '0 auto', textAlign: 'center' }}>
      <div
        className={`plane-container ${className}`}
        style={{
          width,
          height,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Main body parts container */}
        <div
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{ margin: '0 3px' }}
            onClick={(e) => handlePartClick(e, 'front')}
            onMouseEnter={() => handlePartMouseEnter('front')}
            onMouseLeave={handlePartMouseLeave}
          >
            <InlineSVG
              src="/Plane/front.svg"
              fill={getFillColor('front')}
              style={getStyle({ margin: '0 3px' }, 'front')}
            />
          </div>
          <div
            style={{ margin: '0 3px' }}
            onClick={(e) => handlePartClick(e, 'body1')}
            onMouseEnter={() => handlePartMouseEnter('body1')}
            onMouseLeave={handlePartMouseLeave}
          >
            <InlineSVG
              src="/Plane/body1.svg"
              fill={getFillColor('body1')}
              style={getStyle({ margin: '0 3px' }, 'body1')}
            />
          </div>
          <div
            style={{ margin: '0 3px' }}
            onClick={(e) => handlePartClick(e, 'bodyTwo')}
            onMouseEnter={() => handlePartMouseEnter('bodyTwo')}
            onMouseLeave={handlePartMouseLeave}
          >
            <InlineSVG
              src="/Plane/bodyTwo.svg"
              fill={getFillColor('bodyTwo')}
              style={getStyle({ margin: '0 3px' }, 'bodyTwo')}
            />
          </div>
          <div
            style={{ margin: '0 3px' }}
            onClick={(e) => handlePartClick(e, 'back')}
            onMouseEnter={() => handlePartMouseEnter('back')}
            onMouseLeave={handlePartMouseLeave}
          >
            <InlineSVG
              src="/Plane/back.svg"
              fill={getFillColor('back')}
              style={getStyle({ margin: '0 3px' }, 'back')}
            />
          </div>
        </div>

        {/* Left Wing */}
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          onClick={(e) => handlePartClick(e, 'leftWing')}
          onMouseEnter={() => handlePartMouseEnter('leftWing')}
          onMouseLeave={handlePartMouseLeave}
        >
          <InlineSVG
            src="/Plane/leftWing.svg"
            fill={getFillColor('leftWing')}
            style={getStyle({}, 'leftWing')}
          />
        </div>

        {/* Right Wing */}
        <div
          style={{
            position: 'absolute',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          onClick={(e) => handlePartClick(e, 'rightWing')}
          onMouseEnter={() => handlePartMouseEnter('rightWing')}
          onMouseLeave={handlePartMouseLeave}
        >
          <InlineSVG
            src="/Plane/rightWing.svg"
            fill={getFillColor('rightWing')}
            style={getStyle({}, 'rightWing')}
          />
        </div>

        {/* Back Left Wing */}
        <div
          style={{
            position: 'absolute',
            top: '110%',
            right: '22%',
          }}
          onClick={(e) => handlePartClick(e, 'backLeftWing')}
          onMouseEnter={() => handlePartMouseEnter('backLeftWing')}
          onMouseLeave={handlePartMouseLeave}
        >
          <InlineSVG
            src="/Plane/backLeftWing.svg"
            fill={getFillColor('backLeftWing')}
            style={getStyle({}, 'backLeftWing')}
          />
        </div>

        {/* Back Right Wing */}
        <div
          style={{
            position: 'absolute',
            bottom: '110%',
            right: '22%',
          }}
          onClick={(e) => handlePartClick(e, 'backRightWing')}
          onMouseEnter={() => handlePartMouseEnter('backRightWing')}
          onMouseLeave={handlePartMouseLeave}
        >
          <InlineSVG
            src="/Plane/backRightWing.svg"
            fill={getFillColor('backRightWing')}
            style={getStyle({}, 'backRightWing')}
          />
        </div>
      </div>

      {/* Hint popup positioned next to the clicked part */}
      {hint && clickedPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${clickedPoint.x}px`,
            top: `${clickedPoint.y}px`,
            background: 'white',
            color: 'black',
            padding: '8px 12px',
            borderRadius: '12px',
            fontSize: '14px',
            cursor: 'pointer',
            border: '2px solid red',
            zIndex: 100,
            transform: `translateY(-50%) scale(${isPopupVisible ? 1 : 0.7})`,
            opacity: isPopupVisible ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy animation
            transformOrigin: 'left center'
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
