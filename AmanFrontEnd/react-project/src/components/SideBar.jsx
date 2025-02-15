function SideBar(){


    function sidepan(){
        document.getElementById("sidebar").classList.add("hidden");

    }
    return(
        <div id="sidebar" className=" fixed right-0 flex flex-col w-[15%] h-screen max-h-svw top-0 ml-auto bg-[#212327]">

            <div className="flex justify-between align-middle px-3 my-3.5">
                <div className="flex my-auto justify-center size-9 rounded-xl hover:bg-[#383b41] transition delay-10 duration-200 ease-in-out">
                    <button className="" onClick={sidepan}>
                        <img id="panelogo" src="./pane3.png" className="scale-x-[-1] size-7" alt="" />
                    </button>
                </div>
                <div className="mr-3.5 w-[170px] object-fill">
                  <img src="./logo.png" alt=""/>
                </div>
                
            </div>

            <div className="my-3 mx-auto flex flex-col">

                <input type="text" className="bg-[#303030] px-7 py-1 rounded-xl border border-[#524a4a] " placeholder="Search By House ID"/>

                <h1 className="mx-auto mt-8 text-stone-100 text-xl font-semibold">Triggered Sensors</h1>

                <div id="house-card-container" className="w-[100%] mx-auto my-4 flex flex-col text-stone-100">
                    <div id="house-card" className="flex px-4 py-2 justify-between mx-auto h-28 w-[100%] bg-[#303030] rounded-xl hover:bg-[#3b3b3b] hover:drop-shadow-xl  hover: transition delay-50 duration-200 ease-linear">
                        <div className="flex flex-col justify-center object-fill w-[60px] pr-1.5">
                            <img src="./homered.png" alt="" />
                        </div>
                        <div id="house-info" className="mx-auto my-auto font-semibold">
                            <h1>HouseID: <span className="font-normal">351351</span></h1>
                            <h1>UserID:  <span className="font-normal">341341</span></h1>
                            <h1>SensorID: <span className="font-normal">23243</span></h1>
                        </div>
                     </div>
                </div>
                <div id="house-card-container" className="w-[100%] mx-auto my-4 flex flex-col text-stone-100">
                    <div id="house-card" className="flex px-4 py-2 justify-between mx-auto h-28 w-[100%] bg-[#303030] rounded-xl hover:bg-[#3b3b3b] hover:drop-shadow-xl  hover: transition delay-50 duration-200 ease-linear">
                        <div className="flex flex-col justify-center object-fill w-[60px] pr-1.5">
                            <img src="./homered.png" alt="" />
                        </div>
                        <div id="house-info" className="mx-auto my-auto font-semibold">
                            <h1>HouseID: <span className="font-normal">351351</span></h1>
                            <h1>UserID:  <span className="font-normal">341341</span></h1>
                            <h1>SensorID: <span className="font-normal">23243</span></h1>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    )
}


export default SideBar;