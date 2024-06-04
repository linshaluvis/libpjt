import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './ForgotPassword.css';


function ForgotPassword() {
  const passwordEle = useRef(null);
  const navigate = useNavigate();
  const baseURL = 'http://127.0.0.1:8000';

  function togglePasswordVisibility() {
    if (passwordEle.current.type == "text") {
      passwordEle.current.type = "password";
    } else {
      passwordEle.current.type = "text";
    }
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validatePassword() {
    var pss = document.getElementById("password").value;
    var conf = document.getElementById("confirmPassword").value;
    if (pss != conf) {
      alert("Password and confirm password should be same.!");
      return false;
    }
    return true;
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    let samePassword = validatePassword();

    const data = {
      username: username,
      password: password,
    };
    if (samePassword) {
      axios
        .post(`${baseURL}/update_password/`, data)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: `${res.data.message}`,
            });
            navigate("/");
          }
        })
        .catch((err) => {
          console.log("ERROR==", err);
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-transparent text-white mb-5"
              style={{ borderRadius: "1rem", border: "3px solid #fff" }}
            >
              <Link to={"/"} className="ms-4 mt-4">
                <span style={{ cursor: "pointer" }}>
                  <i className="fa fa-arrow-left fw-bold text-white"></i>
                </span>
              </Link>
              <div className="card-body p-4 pt-2 py-5">
                <div className="mb-md-3 pb-3">
                  <h2 className="text-uppercase text-center mb-4">
                    Forgot Password.?
                  </h2>

                  <form
                    action="#"
                    className="form"
                    onSubmit={handleUpdatePassword}
                  >
                    <div className="form-outline mb-3 position-relative">
                      <input
                        type="text"
                        id="userName"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label text-left" for="userName">
                        User Name
                      </label>
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.85rem", width: "max-content" }}
                        id="userErr"
                      ></div>
                    </div>

                    <div className="form-outline mb-3 position-relative">
                      <input
                        type="password"
                        id="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control form-control-lg"
                        required
                      />
                      <i
                        className="fa fa-eye eye-icon"
                        style={{ color: "#152733" }}
                        onClick={togglePasswordVisibility}
                      ></i>
                      <label className="form-label text-left" for="password">
                        Password
                      </label>
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.85rem", width: "max-content" }}
                        id="passErr"
                      ></div>
                    </div>

                    <div className="form-outline mb-3 position-relative">
                      <input
                        type="password"
                        id="confirmPassword"
                        ref={passwordEle}
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control form-control-lg"
                        required
                      />
                      <i
                        className="fa fa-eye eye-icon"
                        style={{ color: "#152733" }}
                        onClick={togglePasswordVisibility}
                      ></i>
                      <label class="form-label text-left" for="confirmPassword">
                        Confirm Password
                      </label>
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.85rem", width: "max-content" }}
                        id="confirmPassErr"
                      ></div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-outline-light px-5"
                        type="submit"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;