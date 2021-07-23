class ApplicationController < ActionController::API
    SECRET = Rails.application.credentials.dig(:secret_key_base)
    before_action :authorized

    # This action will receive a user’s username... 
    # ... and password through params.
    def login
        # 1. Find a user from the users’ table
        user = User.find_by(username: login_params[:username])
        # 2. If a user is found, it will call the method authenticate on the user instance...
        # ...while passing in the user’s password from params
        if user && user.authenticate(login_params[:password])
            # 3. If there is a user and the user is authenticated...
            # ...we will generate a token for our user...
            # ...and render a json object that has both our user instance and that user’s token.
            token = JWT.encode({ user_id: user.id }, SECRET, 'HS256')
            render json: { user: user, token: token }
        else
            # 4. Otherwise, we can render a json object with an error message. 
            render json: { errors: user.errors.full_messages }
        end
    end

    def authorized
        # 5. Check if the headers in the request have an Authorization key
        if request.headers['Authorization']
            # 6. If it does, then we will grab the token from the headers and decode it,...
            encoded_token = request.headers['Authorization'].split(' ')[1]
            token = JWT.decode(encoded_token, SECRET)
            # ... use it to find the user instance that this token belongs to ...
            user_id = token[0]['user_id']
            user = User.find(user_id)
            # ... and render it as our response.
            render json: user
        else
            render json: { message: "Please log in" }
        end
        # If there is no Authorization key, then this action will do nothing.
    end

    private

    def login_params
        params.permit(:username, :password)
    end
end
