import React from 'react'
import LoginButton from '../LoginButton'
import { authenticate } from '../auth/Authenticate'

async function Unauthenticated() {

    await authenticate()

    return (
        <div>
            <div>Unauthenticated</div>
            <LoginButton />
        </div>
    )
}

export default Unauthenticated