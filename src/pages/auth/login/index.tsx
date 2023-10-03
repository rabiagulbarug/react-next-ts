import {useAuth} from "@/src/context/auth.context";
import React, {useCallback, useState} from "react";
import {LoginParams} from "@/src/handlers/auth/login.handler";
import {useForm} from "react-hook-form";
import Link from "next/link";
import {BiLoader, BiLock, BiLogoGmail} from "react-icons/bi";

const Login = ({onLogin}: {onLogin?: () => void}) => {
    const {login} = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false)
    const {register, handleSubmit, formState: {errors}} = useForm<LoginParams>()

    const onSubmit = useCallback(({email, password}: LoginParams) => {
        setHasError(false);
        setIsLoading(true);
        login({email, password}, () => {
            onLogin && onLogin()
            setHasError(false)
            setIsLoading(false)
        }, e => {
            setHasError(true);
            setIsLoading(false);
        })
    }, [login])


    return (
        <div className="row">
            <div className="col-md-12 mt-5">
                <div className="card" >
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1">
                                       <BiLogoGmail/>
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
                                        <BiLock/>
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
                                    <input type="checkbox"
                                           className="form-check-input" id="exampleCheck1"/>
                                    <label className="login-check" htmlFor="exampleCheck1">Remember me</label>
                                </div>
                            </div>
                            <div className="col-6 text-end">
                                <Link href="/" className="login-forgot">
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
                                            <Link href='/'>Register here</Link>
                                        </span>
                            </div>
                        </div>

                        {isLoading &&
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <BiLoader/>
                            </div>}
                        {hasError && (
                            <span style={{color: "#AF0000"}} className='error-message'>Email or password is incorrect</span>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
