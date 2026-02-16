const Input = ({ id, label, type, required, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-base font-medium text-gray-100">
      {label}
    </label>
    <div className="mt-2">
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="focus:outline-blurple-500 block w-full rounded-md bg-black/8 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2"
      />
    </div>
  </div>
);

export default Input;
