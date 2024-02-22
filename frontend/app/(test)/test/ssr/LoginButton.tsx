'use client'
import React from 'react'
import { login } from '@/app/(test)/test/ssr/login'



function LoginButton() {
    const [pending, startTransition] = React.useTransition()

    const onLogin = async () => {
        await login();
    }

    return (
        <div style={{ height: "200px", width: "200px", backgroundColor: "red", color: "black" }} onClick={onLogin}>
            <div onClick={onLogin}>
                <button style={{ backgroundColor: "blue", color: "white" }} onClick={onLogin}>
                    Login
                </button>
            </div>
        </div >
    )
}

export default LoginButton