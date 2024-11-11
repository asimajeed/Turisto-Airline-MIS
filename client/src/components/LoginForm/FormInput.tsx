const FormInput = ({ label, type, value, onChange }: any) => (
  <div className="mb-4">
    <label className="block text-white mb-2">{label}</label>
    <input type={type} value={value} onChange={onChange} className="w-full border border-gray-300 rounded p-2" required />
  </div>
);

export default FormInput;
