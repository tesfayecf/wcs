import React from 'react'
import LoginButton from '../LoginButton'
import { authenticate } from '../authenticated/Authenticate'

async function Unauthenticated() {

    // await authenticate()

    return (
        <div>
            <div>Unauthenticated</div>
            <LoginButton />
        </div>
    )
}

export default Unauthenticated