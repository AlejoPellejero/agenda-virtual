interface Props {
  children: string;
  buttonType?: "normal" | "close";
  onClick: () => void;
}

const Button = ({ children, onClick, buttonType }: Props) => {
  const getButton = () => {
    if (buttonType === "close") {
      return (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClick}
        ></button>
      );
    }
    return (
      <button
        type="button"
        className="btn btn-dark btn-by-apll"
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return getButton();
};

export default Button;
