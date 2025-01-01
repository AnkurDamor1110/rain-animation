import React, { useEffect, useState } from 'react';
import './RainAnimation.css'; // Make sure to include necessary styles

const RainAnimation = () => {
    const [grid, setGrid] = useState([]);
    const [raindrops, setRaindrops] = useState([]);
    const [globalColor, setGlobalColor] = useState([255, 0, 255]); // Shared base color for all raindrops (RGB)
  
    const rows = 15;
    const cols = 20;
  
    useEffect(() => {
      // Initialize the grid
      const initialGrid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ isActive: false, shade: 0 }))
      );
      setGrid(initialGrid);
    }, [rows, cols]);
  
    // Random color generator (returns an RGB array)
    const getRandomColor = () => {
      const colors = [
        [255, 0, 255],   // Magenta
        [128, 0, 128],   // Purple
        [75, 0, 130],    // Indigo
        [148, 0, 211],   // Dark Violet
        [255, 69, 0],    // Orange Red
        [0, 255, 0],     // Green
        [0, 206, 209],   // Dark Turquoise
        [255, 215, 0],   // Gold
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
  
    // Change global color every 4 seconds
    useEffect(() => {
      const colorChangeInterval = setInterval(() => {
        setGlobalColor(getRandomColor());
      }, 6000); // Change color every 4 seconds
  
      return () => clearInterval(colorChangeInterval);
    }, []);
  
    // Function to animate rain
    useEffect(() => {
      const interval = setInterval(() => {
        setGrid((prevGrid) => {
          // Create a deep copy of the grid
          const newGrid = prevGrid.map((row) =>
            row.map(() => ({ isActive: false, shade: 0 }))
          );
  
          // Move raindrops down
          const newRaindrops = raindrops.map((drop) => {
            const { column, height, position, delay } = drop;
  
            // Apply delay before the raindrop starts falling
            if (delay > 0) {
              return { ...drop, delay: delay - 1 };
            }
  
            // Move the raindrop down
            const newPosition = position + 1;
  
            // Update the grid to reflect the raindrop
            for (let i = 0; i < height; i++) {
              const rowIndex = newPosition - i;
              if (rowIndex >= 0 && rowIndex < rows) {
                newGrid[rowIndex][column] = {
                  isActive: true,
                  shade: i, // Shade level depends on position in the raindrop
                };
              }
            }
  
            // Keep raindrop in the grid while it hasn't fully fallen out
            if (newPosition < rows + height) {
              return { ...drop, position: newPosition };
            } else {
              return null; // Remove raindrop after it falls out
            }
          });
  
          // Filter out completed raindrops
          const activeRaindrops = newRaindrops.filter((drop) => drop !== null);
  
          // Add up to 4 new raindrops at a time
          for (let i = 0; i < 4; i++) {
            if (Math.random() > 0.6 && activeRaindrops.length < 10) {
              const newDrop = {
                column: Math.floor(Math.random() * cols), // Random column
                height: Math.floor(Math.random() * 5) + 4, // Minimum 4 boxes
                position: 0, // Start from the top
                delay: i * 2, // Staggered delay for new drops
              };
              activeRaindrops.push(newDrop);
            }
          }
  
          // Update raindrops state
          setRaindrops(activeRaindrops);
  
          return newGrid;
        });
      }, 100);
  
      return () => clearInterval(interval);
    }, [raindrops, rows, cols]);
  
    const getShadeColor = (baseColor, shadeLevel) => {
      // Decrease brightness for each box in the raindrop
      const [r, g, b] = baseColor;
      const factor = Math.max(0.2, 1 - shadeLevel * 0.2); // Gradually reduce intensity
      return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
    };
  
    return (
      <div className="app">
        <h1>Rain Animation with Gradient Effect</h1>
        <div className="grid-container">
          {grid.map((row, rowIndex) => (
            <div className="grid-row" key={rowIndex}>
              {row.map((cell, colIndex) => (
                <div
                  className={`grid-cell ${cell.isActive ? "active" : ""}`}
                  key={colIndex}
                  style={{
                    backgroundColor: cell.isActive
                      ? getShadeColor(globalColor, cell.shade)
                      : "#000",
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default RainAnimation;
