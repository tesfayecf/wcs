import React from 'react'
import { authenticate } from './Authenticate'

async function Authenticated() {

    await authenticate()

    return (
        <div>
            <div>Authenticated</div>
        </div>
    )
}

export default Authenticated