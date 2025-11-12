import React, { Fragment, useState } from "react";
import Button from "./Button";

interface Props {
  days: Array<string>;
  number: number;
  isAvailable?: boolean;
  onClick: (number: number) => void;
}

const getDayText = (days: Array<string>, number: number): string => {
  // Simple logic to get a day text based on the number
  return days[(number - 1) % days.length];
};

function Card({ days, number, isAvailable, onClick }: Props) {
  return (
    <Fragment>
      <div className="card mb-3 card-by-apll">
        <div className="card-body">
          <h5 className="card-title card-title-by-apll">
            {getDayText(days, number)} <span>{number}</span>
          </h5>
          {isAvailable ? (
            <div className="alert alert-success" role="alert">
              Día no disponible
            </div>
          ) : (
            <div>
              <p className="card-text card-text-by-apll">
                Agenda aqui tu dia para colocacion de laminas de seguridad o
                polarizados.
              </p>
              <Button buttonType="normal" onClick={() => onClick(number)}>
                Agendar YA!
              </Button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Card;
