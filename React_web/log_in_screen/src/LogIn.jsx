import React from "react";
import UserInput from "./UserInput";

function LogIn() {
  return (
    <div class="col-md-6 text-center">
      <div class="card mt-5">
        <div class="card-body">
          <h3 class="card-title text-center">Login</h3>
          <form>
            <div class="form-group">
            <UserInput
                label="username"
                type="text"
                placeholder="Enter User Name" />
            </div>
            <div class="form-group">
                <UserInput
                label="password"
                type="password"
                placeholder="Enter Password" />
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
