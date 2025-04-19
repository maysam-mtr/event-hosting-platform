import styled from "styled-components";
import { useRef, useState, useEffect } from "react";

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px; // or whatever fits your layout
`;

const MapImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const Booth = styled.div`
  position: absolute;
  border: 2px solid #007bff;
  background-color: rgba(0, 123, 255, 0.2);
  color: #000;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export default function BoothMap({ mapUrl, booths, mapWidth }) {
    const imgRef = useRef();
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete) {
            setImageSize({ width: img.offsetWidth, height: img.offsetHeight });
        }
    }, []);

    const handleImageLoad = () => {
        const img = imgRef.current;
        if (img) {
            setImageSize({ width: img.offsetWidth, height: img.offsetHeight });
        }
        console.log(img)
    };

    useEffect(() => {
        console.log(imageSize)
    }, [imageSize])
  return (
    <MapWrapper>
      <MapImage ref={imgRef} onLoad={handleImageLoad} src={mapUrl} alt="Event Map" />
      {booths.map((booth) => (
        <Booth
            key={booth.id}
            style={{
                top: `${(booth.y / mapWidth) * imageSize.width}px`,
                left: `${(booth.x / mapWidth) * imageSize.width}px`,
                width: `${(booth.width / mapWidth) * imageSize.width}px`,
                height: `${(booth.height / mapWidth) * imageSize.width}px`,
                
            }}
            title={`Booth ${booth.id}`}
        >
            {booth.id}
        </Booth>
        ))}
    </MapWrapper>
  );
}
