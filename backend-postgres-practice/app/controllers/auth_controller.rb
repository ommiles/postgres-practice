class AuthController < ApplicationController
    skip_before_action :authorized
    def login
        user = User.find_by(username: params[:username])
        if user && user.authenticate(params[:password])
            token = encode_token(user_id: user.id)
            render json: {user: user, token: token}, status: :accepted
        else
            render json: {error: "Incorrect Username or password."}, status: :unauthorized
        end
    end
end