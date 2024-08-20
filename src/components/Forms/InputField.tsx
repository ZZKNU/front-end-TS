const InputField = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
  onCheck,
  checkButtonLabel,
  isChecked,
}: {
  label: string;
  id: string;
  name?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  onCheck?: () => void;
  checkButtonLabel?: string;
  isChecked?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="flex space-x-2">
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
      />
      {onCheck && (
        <button
          type="button"
          onClick={onCheck}
          className="mt-1 px-3 py-1 bg-amber-600 text-white rounded-md shadow-sm hover:bg-amber-500 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 whitespace-nowrap"
        >
          {checkButtonLabel}
        </button>
      )}
    </div>
    {error && (
      <p className={`text-sm ${isChecked ? "text-blue-500" : "text-red-500"}`}>
        {error}
      </p>
    )}
  </div>
);

export default InputField;
