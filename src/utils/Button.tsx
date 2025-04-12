type buttonDataTypes = {
  ind: number;
  name: string;
  fore_color: string;
  back_color: string;
  hover: boolean;
  font_size?: string;
  subtitle?: string;
};

interface propsTypes {
  button: buttonDataTypes;
}

import CircleActive from "../assets/points/active/circle.svg?react";
import CrossActive from "../assets/points/active/cross.svg?react";

export default function Button({ button }: propsTypes) {
  let className = "btn-inside-styles";

  if (button.hover) {
    className += " btn-hover";
  }

  if (!button.font_size) {
    button.font_size = "1.5rem";
  }

  const funcSetIconInfo = () => {
    const newName = button.name.split(" ");
    let icon = null;
    const componentSize = "20px";

    if (newName[0] == "CROSS") {
      icon = (
        <CrossActive
          width={componentSize}
          height={componentSize}
          fill="var(--cross-color)"
        />
      );
    } else {
      icon = (
        <CircleActive
          width={componentSize}
          height={componentSize}
          fill="var(--circle-color)"
        />
      );
    }

    return (
      <span className="flex-style">
        {icon}
        {newName[1]}
      </span>
    );
  };

  return (
    <>
      <button
        className="btn-styles"
        style={{ backgroundColor: button.fore_color }}
      >
        <div
          className={className}
          style={{
            backgroundColor: button.back_color,
          }}
        >
          <p
            style={{
              fontSize: button.font_size,
            }}
          >
            {button.ind === 1 ? funcSetIconInfo() : button.name}
          </p>
          <span className="subtitle">{button.subtitle}</span>
        </div>
      </button>
    </>
  );
}
