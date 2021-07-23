class UsersController < ApplicationController
    before_action :authorized, only: [:index, :update, :destroy]
    skip_before_action :authorized, only: [:show, :login]
    def index
        users = User.all
        render json: users, except: [:password_digest]
    end

    def show
        user = User.find_by(:id)
        render json: user
    end

    def create
        user = User.new(user_params)
        if user.save
            token = encode_token({ user_id: user.id })
            render json: { user: user, token: token }, status: :accepted
        else
            render json: { errors: user.errors.full_messages }, status: :unauthorized
        end
    end

    def update
        user = User.find(params[:id])
        user.update(edit_params)
        if user.valid?
            token = encode_token({ user_id: user.id })
            render json: { user: user, token: token }, status: :accepted
        else
            render json: { errors: user.errors.full_messages }, status: :unauthorized
        end
    end

    def destroy
        user = User.find(params[:id])
        user.destroy
    end

    private

    def user_params
        params.permit(:username, :password)
    end

    def edit_params
        params.permit(:username, :password)
    end
end
