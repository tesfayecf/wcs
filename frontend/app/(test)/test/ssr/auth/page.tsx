'use client'
import React from 'react'
import { authenticate } from './Authenticate'
import { useRouter } from 'next/navigation'

async function Authenticated() {
    const router = useRouter()

    ////////////////////////////////////////////
    // const isAuthenticated = await authenticate()
    // if (!isAuthenticated) {
    //     router.push('./notauth')
    // }

    ////////////////////////////////////////////


    return (
        <div>
            <div>Authenticated</div>
        </div>
    )
}

export default Authenticated