import React, { useEffect, useState } from "react";
import { getServers } from "../../store/servers";
import { useDispatch, useSelector } from "react-redux";



const Servers = ({ sessionUser }) => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const servers = Object.values(useSelector((state) => state.servers));
    useEffect(() => {
        dispatch(getServers()).then(() => setIsLoaded(true));
    }, [dispatch]);
    return isLoaded && (
        <>
            {servers.map(server => {
                console.log(server)
                return (
                <div key={server.id}>
                    <h1 className="text-lg">{server.server_name}</h1>
                </div>
            )})}
        </>
    )
}

export default Servers;
