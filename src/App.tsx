import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import Calendar from "./components/Calendar";
import { MouseEvent } from "react";
import ListGroup from "./components/ListGroup";

const App = () => {
  let items = ["Info", "Agenda", "Contacto"];
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = enero, 11 = diciembre
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const numbers = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
  }));

  return (
    <div className="main-agenda-apll">
      <div className="navbar bg-body-tertiary navbar-fixed-apll">
        <div className="container-fluid">
          <h1 className="navbar-brand mb-0 h1">Duo Polarizados</h1>
        </div>
        <div className="sub-nav-by-apll">
          <ListGroup items={items} onSelectItem={handleSelectItem} />
        </div>
      </div>
      <Calendar months={months} days={days} numbers={numbers}></Calendar>
    </div>
  );
};

export default App;
