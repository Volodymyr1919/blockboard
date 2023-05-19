import React, { useEffect, useRef, useState } from "react";

interface ChildBlockProps {
  text: string;
  childBlocks: ChildBlockProps[];
  onTextChange: (text: string) => void;
}

const ChildBlock: React.FC<ChildBlockProps> = ({
  text,
  childBlocks,
  onTextChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTextChange(event.target.value);
  };

  const handleAddChildBlock = () => {
    const newChildBlock: ChildBlockProps = {
      text: "",
      childBlocks: [],
      onTextChange: () => {},
    };

    setExpanded(true);
    childBlocks.push(newChildBlock);
  };

  return (
    <div style={{ marginLeft: "1rem" }}>
      <input type="text" value={text} onChange={handleTextChange} />
      <button onClick={handleAddChildBlock}>+</button>
      {expanded &&
        childBlocks.map((childBlock, index) => (
          <ChildBlock
            key={index}
            text={childBlock.text}
            childBlocks={childBlock.childBlocks}
            onTextChange={(newText) => {
              childBlocks[index].text = newText;
              onTextChange(text);
            }}
          />
        ))}
    </div>
  );
};

const scaleArray = [
  {value: "0.1", view: "10%"},
  {value: "0.2", view: "20%"},
  {value: "0.3", view: "30%"},
  {value: "0.4", view: "40%"},
  {value: "0.5", view: "50%"},
  {value: "0.6", view: "60%"},
  {value: "0.7", view: "70%"},
  {value: "0.8", view: "80%"},
  {value: "0.9", view: "90%"},
  {value: "1", view: "100%"},
  {value: "1.1", view: "110%"},
  {value: "1.2", view: "120%"},
  {value: "1.3", view: "130%"},
  {value: "1.4", view: "140%"},
  {value: "1.5", view: "150%"},
  {value: "1.6", view: "160%"},
  {value: "1.7", view: "170%"},
  {value: "1.8", view: "180%"},
  {value: "1.9", view: "190%"},
  {value: "2", view: "200%"},
]

const Board: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [childBlocks, setChildBlocks] = useState<ChildBlockProps[]>([
    {
      text: "Categories",
      childBlocks: [],
      onTextChange: () => {},
    },
  ]);

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseDown = (event: MouseEvent) => {
      const startX = event.clientX;
      const startY = event.clientY;

      const handleMouseMove = (event: MouseEvent) => {
        const diffX = event.clientX - startX;
        const diffY = event.clientY - startY;

        if (container) {
          container.style.transform = `translate(${diffX}px, ${diffY}px)`;
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [scale]);

  const handleCenterClick = () => {
    const container = containerRef.current;
    if (container) {
      container.style.transform = "none";
      container.style.left = "45%";
      container.style.top = "40%";
    }
  };

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };

  const handleZoom = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event.target.value;
    setScale(1 * value);
  }

  const handleAddChildBlock = () => {
    const newChildBlock: ChildBlockProps = {
      text: "",
      childBlocks: [],
      onTextChange: () => {},
    };

    childBlocks[0].childBlocks.push(newChildBlock);
    setChildBlocks([...childBlocks]);
  };

  return (
    <div className="wrapper">
      <div className="wrapper__header">
        <button onClick={handleCenterClick}>{"Go to center"}</button>
        <button onClick={handleZoomIn}>+</button>
        <select name="scaling" id="scaling" defaultValue={1} onChange={handleZoom}>
          {scaleArray.map(item => <option key={item.value} value={item.value}>{item.view}</option>)}
        </select>
        <button onClick={handleZoomOut}>-</button>
      </div>
      <div
        className="wrapper__main"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <div className="main__child" ref={containerRef}>
          <div>
            <ChildBlock
              text={childBlocks[0].text}
              childBlocks={childBlocks[0].childBlocks}
              onTextChange={(newText) => {
                childBlocks[0].text = newText;
                setChildBlocks([...childBlocks]);
              }}
            />
            <button onClick={handleAddChildBlock}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
