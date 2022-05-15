
const signin = () => {
    return (
        <div className="grid grid-cols-2 h-screen w-screen">
            <div className="flex items-center bg-[#FDE9F4]">
                <div className="m-auto my-10 w-9/12 text-[#663A52]">
                    <p className="font-inter text-xl opacity-80 font-light tracking-wide mb-8">PHS</p>
                    <p className="font-inter text-2xl font-semibold tracking-wider mb-8 mr-8">Helping piggery owners in resolving & preventing pig heat stress</p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="m-auto w-7/12">
                    <p className="font-inter text-2xl font-semibold tracking-wide mb-8">Signin To PHS</p>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium  dark:text-gray-300">Email</label>
                        <input type="text" placeholder="" className="input input-bordered w-full input-md " />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium dark:text-gray-300">Password</label>
                        <input type="text" placeholder="" className="input input-bordered w-full input-md " />
                    </div>
                    <button className="btn btn-primary btn-md btn-wide">Sign In</button>
                </div>
            </div>
        </div>
    )
}

export default signin