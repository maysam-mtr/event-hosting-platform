import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 80%; // responsive width
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  display: block;
`;

const BoothOverlay = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 6px;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export default function BoothMap({ imageUrl, booths, map }) {
  const imageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const updateScale = () => {
      const img = imageRef.current;
      if (img) {
        const displayedWidth = img.clientWidth;
        const displayedHeight = img.clientHeight;

        const scaleX = displayedWidth / map.width;
        const scaleY = displayedHeight / map.height;

        setScale({ x: scaleX, y: scaleY });
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [map.width, map.height]);

  return (
    <ImageWrapper>
      <ImageContainer>
        <PreviewImage src={imageUrl} ref={imageRef} />
        {booths.map((booth, index) => {
          const left = booth.x * scale.x + (booth.width * scale.x) / 2;
          const top = booth.y * scale.y + (booth.height * scale.y) / 2;

          return (
            <BoothOverlay
              key={booth.id}
              style={{ left: `${left}px`, top: `${top}px` }}
            >
              {/*booth.id*/}
              {index}
            </BoothOverlay>
          );
        })}
      </ImageContainer>
    </ImageWrapper>
  );
}


