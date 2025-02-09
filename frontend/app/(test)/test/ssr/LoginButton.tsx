'use client'
import React from 'react'
import { login } from '@/app/(test)/test/ssr/login'

import { useRouter } from 'next/navigation'

function LoginButton() {
    const [pending, startTransition] = React.useTransition()
    const router = useRouter()


    const onLogin = async () => {
        const loginState = await login();
        if (loginState) {
            router.push("./auth")
        }
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