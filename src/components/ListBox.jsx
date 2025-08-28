import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../ThemeContext";

const CustomListbox = ({ selectedForm, setSelectedForm, customForms }) => {
  const { classes } = useTheme();

  return (
    <Listbox value={selectedForm} onChange={setSelectedForm}>
      <div className="relative w-full">
        {/* Button */}
        <Listbox.Button
          className={`relative w-full cursor-default rounded-lg border px-10 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm transition ${classes.cardBg} ${classes.cardBorder} ${classes.textPrimary}`}
        >
          {/* Icon */}
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </span>
          {/* Text */}
          <span className="block truncate">
            {selectedForm || "اختر نوع النموذج"}
          </span>
        </Listbox.Button>

        {/* Options */}
        <AnimatePresence>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options
              className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md p-1 text-base shadow-lg ring-1 ring-blue focus:outline-none sm:text-sm z-40 ${classes.cardBg}`}
            >
              {/* Default option */}
              <Listbox.Option
                value=""
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100 text-blue-900" : classes.textPrimary
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      اختر نوع النموذج
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <Check className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>

              {/* Custom forms */}
              {customForms.map((form) => (
                <Listbox.Option
                  key={form.id}
                  value={form.title}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : classes.textPrimary
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {form.title}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <Check className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </AnimatePresence>
      </div>
    </Listbox>
  );
};

export default CustomListbox;
