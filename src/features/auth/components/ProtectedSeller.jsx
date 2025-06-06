import React from 'react'
import { useSelector } from 'react-redux'
import { selectLoggedInUser } from '../AuthSlice'
import { Navigate } from 'react-router-dom';

const ProtectedSeller = ({children}) => {
    const user = useSelector(selectLoggedInUser);
    //console.log(`fine`);
    if(!user){
        return <Navigate to="/login" replace={true}></Navigate>
    }
    //console.log(`fine user`);
    if(user && user.role !== 'seller'){
        return <Navigate to="/" replace={true}></Navigate>
    }
    //console.log(`fine seller`);
    if(user && user.role === 'seller' && !user.brand){
        return <Navigate to="/" replace={true}></Navigate>
    }
    //console.log(`fine brand`);
    return children;
}

export default ProtectedSeller