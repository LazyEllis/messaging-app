import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const AutocompleteList = ({
  id,
  label,
  value,
  options,
  onChange,
  onInputChange,
  onClose,
}) => (
  <div>
    <label htmlFor={id} className="block text-base font-medium text-gray-100">
      {label}
    </label>
    <Combobox
      value={value}
      onChange={onChange}
      onClose={onClose}
      as="div"
      className="relative mt-2 block"
    >
      <ComboboxInput
        id={id}
        displayValue={(item) => item?.name}
        onChange={onInputChange}
        className="focus:outline-blurple-500 block w-full rounded-md bg-white/5 py-1.5 pr-12 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 transition-discrete placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2"
      />

      <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-e-md px-2">
        <ChevronDownIcon className="size-5 text-gray-400" />
      </ComboboxButton>

      <ComboboxOptions
        transition
        className="absolute inset-x-0 z-10 mt-2 max-h-60 w-[--input-width] overflow-auto rounded-md bg-gray-800 py-1 text-base outline-1 -outline-offset-1 outline-white/10 transition transition-discrete data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {options.map((option) => (
          <ComboboxOption
            key={option.id}
            value={option}
            className="data-focus:bg-blurple-500 block truncate px-3 py-2 text-gray-300 select-none hover:text-white data-focus:text-white"
          >
            {option.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  </div>
);

export default AutocompleteList;
