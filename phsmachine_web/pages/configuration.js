import { useState, Fragment, useEffect } from 'react'

import Layout from '../components/layout'
import { setTheme, loadTheme } from "../helpers"

import { FcCheckmark } from "react-icons/fc"
import { HiOutlineSelector } from "react-icons/hi"

import { Listbox, Transition } from '@headlessui/react'

const configuration = () => {

    const themes = [
        { name: "light" }, { name: "dark" }, { name: "cupcake" }, { name: "bumblebee" }, { name: "emerald" }, { name: "corporate" }, { name: "synthwave" }, { name: "retro" }, { name: "cyberpunk" }, { name: "valentine" }, { name: "halloween" }, { name: "garden" }, { name: "forest" }, { name: "aqua" }, { name: "lofi" }, { name: "pastel" }, { name: "fantasy" }, { name: "wireframe" }, { name: "black" }, { name: "luxury" }, { name: "dracula" }, { name: "cmyk" }, { name: "autumn" }, { name: "business" }, { name: "acid" }, { name: "lemonade" }, { name: "night" }, { name: "coffee" }, { name: "winter" }]


    const [selected, setSelected] = useState({name : "Choose Theme"})

    useEffect(() => {
        if(selected.name === "Choose Theme") return
        setTheme(selected.name)
    }, [selected])


    return (
        <div className='p-10'>
            <p className='text-xl card-title font-lato font-semibold'>Configuration</p>
            <div className='divider'></div>
            <p>Theme</p>
            <div className='w-4/5'>
                <Listbox value={selected} onChange={setSelected}>
                    <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg  py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                < HiOutlineSelector
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {themes.map((person, personIdx) => (
                                    <Listbox.Option
                                        key={personIdx}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'opacity-100' : 'opacity-75'
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {person.name}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <FcCheckmark className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        </div>
    )
}

configuration.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default configuration