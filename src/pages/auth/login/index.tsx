import {useAuth} from "@/src/context/auth.context";
import React, {useCallback, useState} from "react";
import {LoginParams} from "@/src/handlers/auth/login.handler";
import {useForm} from "react-hook-form";
import Link from "next/link";

const Login = ({onLogin}: {onLogin?: () => void}) => {
    const {login} = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false)
    const [rememberMe, setRememberMe] = useState<boolean>(true);
    const [confirmationStep, setConfirmationStep] = useState<boolean>(false);
    const {register, handleSubmit, formState: {errors}} = useForm<LoginParams>()

    const onSubmit = useCallback(({email, password}: LoginParams) => {
        setHasError(false);
        setIsLoading(true);
        login({email, password, remember_me: rememberMe ? 1 : 0}, () => {
            onLogin && onLogin()
            setHasError(false)
            setIsLoading(false)
        }, e => {
            setHasError(true);
            setIsLoading(false);
        })
    }, [login, rememberMe])

    const handleChange = (event: any) => {
        setRememberMe(event.target.checked);
    };

    return (
                    <div className="row">
                        <div className="col-md-12 mt-5">
                            <form onSubmit={handleSubmit(onSubmit)}>

                                <div className="input-group login-form mb-3">
                                    <span className="input-group-text" id="basic-addon1">
                                        <img src="/assets/images/mail-icon.png"/>
                                    </span>
                                    <input className="form-control"
                                           aria-label="Username"
                                           type="text"
                                           required
                                           id="email"
                                           autoComplete="email"
                                           autoFocus
                                           {...register('email', {required: true})}/>

                                </div>
                                {errors.email &&
                                    <span style={{color: "red"}}
                                          className='error-message'>E-mail field is required</span>}

                                <div className="input-group login-password mb-3">
                                    <span className="input-group-text password">
                                        <img src="/assets/images/password-icon.png"/>
                                    </span>
                                    <input type="password" className="form-control"
                                           required
                                           id="password"
                                           autoComplete="current-password"
                                           {...register('password', {required: true})}/>

                                </div>
                                {errors.password &&
                                    <span style={{color: "red"}}
                                          className='error-message'>Password field is required</span>}

                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-check login-check">
                                            <input type="checkbox" checked={rememberMe} onChange={handleChange}
                                                   className="form-check-input" id="exampleCheck1"/>
                                            <label className="login-check" htmlFor="exampleCheck1">Remember me</label>
                                        </div>
                                    </div>
                                    <div className="col-6 text-end">
                                        <Link href="/auth/forget-password" className="login-forgot">
                                            forgot password?</Link>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-12 text-center">
                                        <button className="login-button" type="submit"
                                                disabled={isLoading}>
                                            LOGIN
                                        </button>
                                    </div>
                                    <div className="col-md-12 mt-3 text-center">
                                        <span className="login-alt-span">Do not have an account ?
                                            <Link href='/auth/post-check'>Register here</Link>
                                        </span>
                                    </div>
                                </div>

                                {isLoading &&
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                        {/* dönen ok */}
                                    </div>}
                                {hasError && (
                                    <span style={{color: "#AF0000"}} className='error-message'>Email or password is incorrect</span>
                                )}
                            </form>
                        </div>
                    </div>
    )
}

export default Login
