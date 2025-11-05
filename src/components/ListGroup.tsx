import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
//import { MouseEvent } from "react";

interface Props {
  items: string[];
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  //const [name, setName] = useState("");

  /*const getMessage = () => {
    return items.length === 0 ? <p>No items found</p> : null;
  }*/

  return (
    <Fragment>
      <div className="list-by-apll">
        <ul className="list-group">
          {items.map((item, index) => (
            <li
              className={
                index === selectedIndex
                  ? "list-group-item active"
                  : "list-group-item"
              }
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                onSelectItem(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
}

export default ListGroup;
