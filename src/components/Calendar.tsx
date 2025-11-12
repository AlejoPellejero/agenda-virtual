import React, { useState, useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import Card from "./Card";
import ModaL from "./Modal";

interface Props {
  months: Array<string>;
  days: Array<string>;
  numbers: Array<DayObject>;
}

interface DayObject {
  day: number;
  isAvailable?: boolean;
}

interface SavedEntry {
  name: string;
  email: string;
  phone: string;
  tipo: string;
  description: string;
  dayNumber?: number | null;
}

const setDayAvailability = (
  dayObj: DayObject,
  isAvailable: boolean
): DayObject => {
  return {
    ...dayObj,
    isAvailable,
  };
};

const rowsGenerator = (
  arr: DayObject[],
  size: number,
  savedEntries: SavedEntry[]
): DayObject[][] => {
  const res: DayObject[][] = [];
  let daysCount = 0;
  const updatedArr = [...arr]; // copia del array original
  const sortedEntries = [...savedEntries].sort((a, b) => {
    const dayA = a.dayNumber ?? 0; // Si es null o undefined → 0
    const dayB = b.dayNumber ?? 0;
    return dayA - dayB; // ascendente
  });

  for (let i = 0; i < updatedArr.length; i += size) {
    let isDay = false;
    let j = 0;

    while (!isDay && j < sortedEntries.length) {
      if (updatedArr[(sortedEntries[j].dayNumber ?? i + daysCount) - 1].day) {
        updatedArr[i + daysCount] = {
          ...updatedArr[i + daysCount],
          isAvailable: true,
        };
        isDay = true;
        break;
      }
      j++;
    }

    if (!isDay) {
      updatedArr[i + daysCount] = {
        ...updatedArr[i + daysCount],
        isAvailable: false,
      };
    }

    res.push(updatedArr.slice(i, i + size));
  }

  return res;
};

const Calendar = ({ months, days, numbers }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const storageKey = "agenda_saved_entries";

  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as SavedEntry[]) : [];
    } catch (e) {
      console.warn("Could not parse saved entries from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedEntries));
    } catch (e) {
      console.warn("Could not save entries to localStorage", e);
    }
  }, [savedEntries]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = numbers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(numbers.length / itemsPerPage);
  const rows = rowsGenerator(currentItems, 4, savedEntries);
  let countDays = 0;

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
              setSelectedNumber(null);
            }}
            initialNumber={selectedNumber}
            onSave={(entry) => {
              setSavedEntries((prev) => [...prev, entry]);
            }}
          />
        )}
        <div className="options-day-by-apll">
          {rows.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((number) => (
                <div className="col day-apll" key={number.day}>
                  <Card
                    number={number.day}
                    isAvailable={number.isAvailable}
                    days={days}
                    onClick={(n: number) => {
                      setSelectedNumber(n);
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
          {savedEntries.length === 0 ? (
            <p className="text-muted">No hay entradas guardadas aún.</p>
          ) : (
            <ul className="list-group">
              {savedEntries.map((entry, idx) => (
                <li className="list-group-item" key={idx}>
                  <strong>Día:</strong> {entry.dayNumber ?? "-"} —{" "}
                  <strong>Nombre:</strong> {entry.name} — <strong>Tipo:</strong>{" "}
                  {entry.tipo} — <strong>Mail:</strong> {entry.email}
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
