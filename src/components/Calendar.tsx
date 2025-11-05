import React, { useState, useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import Card from "./Card";
import ModaL from "./Modal";

interface Props {
  months: Array<string>;
  days: Array<string>;
  numbers: Array<number>;
}

interface SavedEntry {
  name: string;
  email: string;
  phone: string;
  tipo: string;
  description: string;
  dayNumber?: number | null;
}

const chunk = (arr: number[], size: number): number[][] => {
  const res: number[][] = [];
  let daysCount = 0;

  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
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
  const rows = chunk(currentItems, 4);
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
                <div className="col day-apll" key={number}>
                  <Card
                    number={number}
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
