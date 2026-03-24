import React, { useState } from 'react';

const MAP_IMAGES = [
  { id: 'epic-final', label: 'Epic Pass Final', src: '/assets/campaign-map.png' },
];

export function MapLabPage() {
  const [selectedMap, setSelectedMap] = useState(MAP_IMAGES[0]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.5, Math.min(4, z + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="map-lab">
      <div className="map-lab__toolbar">
        <div className="map-lab__toolbar-group">
          <label className="map-lab__label">Map</label>
          <select
            className="map-lab__select"
            value={selectedMap.id}
            onChange={(e) => {
              const m = MAP_IMAGES.find((img) => img.id === e.target.value);
              if (m) setSelectedMap(m);
            }}
          >
            {MAP_IMAGES.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="map-lab__toolbar-group">
          <label className="map-lab__label">Zoom: {Math.round(zoom * 100)}%</label>
          <input
            type="range"
            min="50"
            max="400"
            value={zoom * 100}
            onChange={(e) => setZoom(Number(e.target.value) / 100)}
            className="map-lab__slider"
          />
          <button className="map-lab__btn" onClick={resetView}>Reset</button>
        </div>

        <div className="map-lab__toolbar-group">
          <span className="map-lab__hint">Scroll to zoom. Drag to pan.</span>
        </div>
      </div>

      <div
        className="map-lab__viewport"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={selectedMap.src}
          alt={selectedMap.label}
          className="map-lab__image"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
