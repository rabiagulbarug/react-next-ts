import {BiChevronRightCircle, BiLoader, BiLock, BiLogoGmail} from "react-icons/bi";
import Link from "next/link";
import React from "react";

const Register = () => {
    return (
        <>
            <div className="row">
                <div className="col-md-12 mt-5">
                    <div className="global-card">
                        <form>
                            <span>Register</span>
                            <div className="form-floating register-form">
                                <input type="text" className="form-control" id="Name"
                                       placeholder="Name"
                                />
                                <label htmlFor="Name">Name</label>
                                <span className="login-floating-icons">
                                    <BiChevronRightCircle/>
                                </span>
                            </div>

                            <div className="form-floating register-form" style={{marginTop: 10}}>
                                <input type="text" className="form-control" id="Surname"
                                       placeholder="Surname"
                                />
                                <label htmlFor="Surname">Surname</label>
                                <span className="login-floating-icons">
                                    <BiChevronRightCircle/>
                                </span>
                            </div>
                            <div className="form-floating register-form">
                                <input type="text" className="form-control" id="Phone"
                                       placeholder="Phone"
                                />
                                <label htmlFor="Phone">Phone</label>
                                <span className="login-floating-icons">
                                    <BiChevronRightCircle/>
                                </span>
                            </div>
                            <div className="form-floating register-form">
                                <input type="email" className="form-control" id="Mail"
                                       placeholder="Mail"
                                />
                                <label htmlFor="Mail">Mail</label>
                                <span className="login-floating-icons">
                                    <BiChevronRightCircle/>
                                </span>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-12 text-center">
                                    <button className="login-button" type="submit">
                                        SAVE
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
