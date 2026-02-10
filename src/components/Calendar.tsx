import React, { useState, useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import Card from "./Card";
import ModaL from "./Modal";
import { FormData, DayObject } from "./Calendar.interfaces";

interface Props {
  months: Array<string>;
  days: Array<string>;
  daysOfMonth: Array<DayObject>;
}

const storageKey = "agenda_saved_entries";
const cardsPerPage = 8;

const setDayAvailability = (
  dayObj: DayObject,
  isAvailable: boolean,
): DayObject => {
  return {
    ...dayObj,
    isAvailable,
  };
};

const columnsGenerator = (
  cardsArr: DayObject[],
  columnsQty: number,
  daySheduled: FormData[],
): DayObject[][] => {
  const res: DayObject[][] = [];
  let daysCount = 0;
  const updatedCardsArr = [...cardsArr];
  const sortedDayScheduled = [...daySheduled].sort((a, b) => {
    const dayA = a.dayNumber ?? 0; // Si es null o undefined → 0
    const dayB = b.dayNumber ?? 0;
    return dayA - dayB; // ascendente
  });

  for (let i = 0; i < updatedCardsArr.length; i += columnsQty) {
    let isDay = false;
    let j = 0;
    let daysSet = 0;

    while (!isDay && j <= 7) {
      const scheduledDayNumber =
        sortedDayScheduled.length > 0 &&
        sortedDayScheduled[daysSet] &&
        !sortedDayScheduled[daysSet].isScheduled
          ? (sortedDayScheduled[daysSet].dayNumber ?? 0)
          : 0;

      updatedCardsArr[j] = {
        ...updatedCardsArr[j],
        isAvailable: true,
      };

      if (scheduledDayNumber > 0 && !sortedDayScheduled[daysSet].isScheduled) {
        if (updatedCardsArr[j].day === scheduledDayNumber) {
          updatedCardsArr[j] = {
            ...updatedCardsArr[j],
            isAvailable: false,
          };
          daysSet++;
        }
      }
      j++;
    }

    res.push(updatedCardsArr.slice(i, i + columnsQty));
  }

  return res;
};

const Calendar = ({ months, days, daysOfMonth }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [daySelected, setDaySelected] = useState<number>(0);

  const [dayScheduled, setSheduledDay] = useState<FormData[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as FormData[]) : [];
    } catch (e) {
      console.warn("Could not parse saved entries from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(dayScheduled));
    } catch (e) {
      console.warn("Could not save entries to localStorage", e);
    }
  }, [dayScheduled]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = daysOfMonth.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(daysOfMonth.length / cardsPerPage);
  const columns = columnsGenerator(currentCards, 4, dayScheduled);

  return (
    <Fragment>
      <div className="calendar-apll">
        <nav className="navbar bg-body-tertiary navbar-filter-apll">
          <div className="container-fluid">
            Filtros: x dias, solo fin de semana, dias libres, etc.
          </div>
        </nav>

        {showModal && (
          <ModaL
            onClick={() => {
              setShowModal(false);
              setDaySelected(0);
            }}
            daySelected={daySelected}
            onSave={(entry) => {
              setSheduledDay((prev) => [...prev, entry]);
            }}
          />
        )}
        <div className="options-day-by-apll">
          {columns.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((card) => (
                <div className="col day-apll" key={card.day}>
                  <Card
                    number={card.day}
                    isAvailable={card.isAvailable}
                    days={days}
                    onClick={(n: number) => {
                      setDaySelected(n);
                      setShowModal(true);
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="pagination-container-apll">
          <ul className="pagination">
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
              >
                Previous Weeks
              </a>
            </li>

            <li className="page-item">
              <a
                className="page-link"
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              >
                Next Weeks
              </a>
            </li>
          </ul>
        </div>
        {/* Saved entries panel (persisted in localStorage) */}
        <div className="saved-entries mt-4">
          <h6>Entradas guardadas</h6>
          {dayScheduled.length === 0 ? (
            <p className="text-muted">No hay entradas guardadas aún.</p>
          ) : (
            <ul className="list-group">
              {dayScheduled.map((entry, idx) => (
                <li className="list-group-item" key={idx}>
                  <strong>Día:</strong> {entry.dayNumber ?? "-"} —{" "}
                  <strong>Nombre:</strong> {entry.name} — <strong>Tipo:</strong>{" "}
                  {entry.type} — <strong>Mail:</strong> {entry.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Calendar;
