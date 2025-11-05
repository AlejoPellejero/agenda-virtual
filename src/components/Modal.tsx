import React, { Fragment, useState, useEffect } from "react";
import Button from "./Button";

interface Props {
  onClick: () => void;
  initialNumber?: number | null;
  onSave?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  tipo: string;
  description: string;
  dayNumber?: number | null;
}

const Modal = ({ onClick, initialNumber, onSave }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    tipo: "",
    description: "",
    dayNumber: null,
  });

  const onHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      tipo: "",
      description: "",
      dayNumber: null,
    });
  };

  // Sync initialNumber into formData whenever the modal opens / the number changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, dayNumber: initialNumber ?? null }));
  }, [initialNumber]);

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
                name="tipo"
                value={formData.tipo}
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
                placeholder="Descripcion general: medidas, fechas, marcas, etc..."
                className="form-control"
                name="description"
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
