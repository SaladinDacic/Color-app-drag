import { useState } from "react";
import { v4 as uuid } from "uuid";
//npm i react-beautiful-dnd --legacy-peer-deps
//npm i @types/react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.scss";

function App() {
  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const [manualColor, setManualColor] = useState<string>();
  const [colorsHistory, setColorsHistory] = useState<string[]>(["#121212", "#ab9a9a", "#55f555", "#55f", "#9050f0"]);

  const list = colorsHistory.map((hexaString, idx) => {
    const key = uuid();
    return (
      <Draggable key={key} draggableId={key} index={idx}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <i>|||</i>
              <li
                style={{
                  // ...provided.draggableProps.style,
                  listStyleType: "none",
                  color: hexaString,
                  fontWeight: (hexaString === manualColor && isHexaColor(manualColor)) || hexaString === currentColor ? 900 : 100,
                }}
              >
                {hexaString}
              </li>
              <i>|||</i>
            </div>
          </div>
        )}
      </Draggable>
    );
  });

  function handleRandomColorAddition(randomColor: string, manualColor?: string) {
    if (isHexaColor(randomColor) && !manualColor) {
      setCurrentColor(randomColor);
      if (currentColor) {
        setColorsHistory((oldHexaArr) => {
          if (!oldHexaArr.includes(currentColor as string)) {
            return [...oldHexaArr, currentColor as string];
          } else {
            return oldHexaArr;
          }
        });
      }
    }
  }
  function handleManualColorAddition(manualColor: string) {
    if (isHexaColor(manualColor)) {
      setCurrentColor(manualColor);
      setColorsHistory((oldHexaArr) => {
        if (!oldHexaArr.includes(manualColor as string)) {
          return [...oldHexaArr, manualColor as string];
        } else {
          return oldHexaArr;
        }
      });
    }
  }
  return (
    <div className="App">
      <button
        style={{ color: isHexaColor(manualColor as string) ? manualColor : (currentColor as string) }}
        onClick={async () => {
          if (manualColor && isHexaColor(manualColor)) {
            handleManualColorAddition(manualColor);
          } else {
            const randomColor = await getHexaData();
            handleRandomColorAddition(randomColor);
          }
        }}
      >{`${manualColor ?? currentColor ?? "unesi boju ili klikni za random"}`}</button>
      <DragDropContext
        onDragEnd={(props) => {
          setColorsHistory((oldColorArr) => {
            let oldArrCopy = [...oldColorArr];
            let source = props.source.index;
            let destination = props.destination?.index as number;
            oldArrCopy.splice(destination, 0, oldArrCopy.splice(source, 1)[0]);

            return oldArrCopy;
          });
        }}
      >
        <Droppable droppableId={"droppable-1"} type="COLOR">
          {(provided, snapshot) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} /* style={{ backgroundColor: snapshot.isDraggingOver ? "blue" : "grey" }} */>
              {list}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <input
        value={manualColor as string}
        onChange={(evt) => {
          if (evt.target.value === "") setManualColor(undefined);
          else setManualColor(evt.target.value);
        }}
        type="text"
      />
    </div>
  );
}

export default App;

async function getHexaData(): Promise<string> {
  const hexaColorArr = ["#a41113", "#6c1bb3", "#a18bb9", "#430583", "#04e08c", "#13e9c4", "#599828", "#261035", "#a9f5df", "#57abd1"];
  const randomColor = hexaColorArr[Math.floor(Math.random() * hexaColorArr.length)];
  return randomColor;
}

function isHexaColor(color: string): boolean {
  if (color) {
    const colorStrArr = color?.match(/#([0-9]|[a-f]){6}/gi) as string[];
    if (Array.isArray(colorStrArr)) {
      const hexString = colorStrArr[0];
      if (hexString === color) {
        return true;
      }
    }
  }
  return false;
}
