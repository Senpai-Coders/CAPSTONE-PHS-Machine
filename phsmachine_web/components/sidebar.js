import Link from "next/link"
import { useRouter } from "next/router"

import { GiCctvCamera } from 'react-icons/gi'
import { FaThermometerHalf } from 'react-icons/fa'
import { GoGear } from 'react-icons/go'

const sidebar = () => {

    const router = useRouter()

    const PHS_ROUTES = [
        {
            path: "/",
            icon: GiCctvCamera
        },
        {
            path: "/analysis",
            icon: FaThermometerHalf
        },
        {
            path: "/configuration",
            icon: GoGear
        }
    ]
// hidden
    return (
        <aside className=" z-30 flex-shrink-0 px-5 overflow-y-auhref dark:bg-gray-800 lg:block">
            <div className="overflow-y-auto mt-8 overflow-x-hidden space-y-14 flex-grow">
                <div className="flex items-center my-4">
                    <Link
                        className="lg:block ml-6 text-2xl font-bold text-gray-800 dark:text-gray-200"
                        href="/"
                    >
                        PHS
                    </Link>
                </div>
                <div className="flex flex-col items-center py-2 space-y-14 mb-3">
                    {PHS_ROUTES.map((routes, idx) => (

                        <routes.icon onClick={()=> router.push(routes.path)} key={idx} className={`${router.pathname === routes.path ? 'scale-110' : ''} h-7 w-7 text-[#5C3858] cursor-pointer duration-300`} />

                    ))}
                </div>
            </div>
        </aside>
    )
}

export default sidebar