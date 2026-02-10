import React, { Fragment, useState, useEffect } from "react";
import Button from "./Button";
import { FormData } from "./Calendar.interfaces";

interface Props {
  onClick: () => void;
  daySelected: number;
  onSave?: (data: FormData) => void;
}

const Modal = ({ onClick, daySelected, onSave }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    type: "",
    description: "",
    dayNumber: daySelected,
    isScheduled: false,
  });

  const onHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };

      return newState;
    });
  };

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Llamar al callback onSave pasado por props para que el padre (Calendar)
    // persista los datos y no se pierdan al desmontar el Modal.
    if (typeof onSave === "function") {
      onSave(formData);
    } else {
      // Si no hay onSave, solo logueamos localmente
      console.log("Datos guardados (local):", formData);
    }

    // Limpiamos el formulario
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: "",
      description: "",
      dayNumber: 0,
      isScheduled: false,
    });
  };

  // Sync initialNumber into formData whenever the modal opens / the number changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, dayNumber: daySelected }));
  }, [daySelected]);

  return (
    <Fragment>
      <div className="modal-by-apll">
        <div className="inner-content-by-apll">
          <div className="first-container-by-apll">
            <Button buttonType="close" onClick={onClick}>
              .
            </Button>
          </div>
          <form onSubmit={onHandleSubmit}>
            <div className="mb-3 form-group-by-apll">
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Nombre y Apellido:"
                value={formData.name}
                onChange={onHandleChange}
                required
              />
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Mail de contacto:"
                value={formData.email}
                onChange={onHandleChange}
                required
              />
            </div>
            <div className="mb-3 form-group-by-apll">
              <input
                className="form-control"
                type="text"
                name="phone"
                placeholder="Celular de contacto:"
                value={formData.phone}
                onChange={onHandleChange}
              />
              <select
                className="form-select"
                name="type"
                value={formData.type}
                onChange={onHandleChange}
                required
              >
                <option value="">Selecciona tipo</option>
                <option value="Auto">Auto</option>
                <option value="Camioneta">Camioneta</option>
                <option value="Camion/Maquina">Camion/Maquina</option>
                <option value="Casa">Casa</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="mb-3 form-group-by-apll">
              <textarea
                placeholder="Descripcion general: medidas del vidrio, tipo de polarizado o lamina, etc."
                className="form-control"
                name="description"
                value={formData.description}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-dark btn-by-apll">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;
