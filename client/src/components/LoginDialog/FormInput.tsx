import { useState } from "react";
import { GrFormViewHide } from "react-icons/gr";
import { GrFormView } from "react-icons/gr";
const FormInput = ({ label, type, value, onChange, placeHolder }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isPasswordField = type === "password";

  return (
    <div className="mb-4 relative">
      <label className="block text-white mb-2">{label}</label>
      <input
        type={isPasswordField && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded p-2 text-black"
        placeholder={placeHolder}
        required
      />
      {isPasswordField && (
        <span
          onClick={togglePasswordVisibility}
          className="absolute opacity-80 right-0 mt-[0.33rem] mr-1 cursor-pointer text-gray-500"
        >
          {showPassword ? <GrFormView color="black" size={"2rem"} /> : <GrFormViewHide color="black" size={"2rem"} /> }
        </span>
      )}
    </div>
  );
};

export default FormInput;
