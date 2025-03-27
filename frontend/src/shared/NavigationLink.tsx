import { Link } from "react-router-dom";

type Props = {
  to: string;
  bg: string;
  text: string;
  textColor: string;
  hoverBg?: string;
  fontSize?: string;
  onClick?: () => Promise<void> | void;
};

const NavigationLink = (props: Props) => {
  const {
    to,
    bg,
    text,
    textColor,
    hoverBg,
    fontSize = "14px",
    onClick
  } = props;

  return (
    <Link
      onClick={onClick}
      className="nav-link"
      to={to}
      style={{ 
        background: bg, 
        color: textColor,
        fontSize: fontSize,
        transition: "all 0.3s ease",
        display: "inline-block",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        fontWeight: 600,
      }}
      onMouseEnter={(e) => {
        if (hoverBg) {
          e.currentTarget.style.background = hoverBg;
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = bg;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
      }}
    >
      {text}
    </Link>
  );
};

export default NavigationLink;