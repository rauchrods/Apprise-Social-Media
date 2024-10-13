import "./button.scss";

const Button = ({
  children,
  onClick = () => {},
  className = "",
  ...props
}) => {
  return (
    <button onClick={onClick} className={`my-button ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
